"""Shared data structures and helpers for shift generation algorithms."""

from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime, time, timedelta
from typing import Dict, List, Optional, Sequence

from ..models import (
    Service,
    ShiftRequirement,
    ShiftTemplate,
    User,
    UserConstraint,
    UserPreference,
)
from ..schemas import ShiftBase


@dataclass
class Slot:
    """A concrete time slot (derived from a ShiftRequirement) that must be staffed."""

    start: datetime
    end: datetime
    required: int

    @property
    def duration_hours(self) -> float:
        return (self.end - self.start).total_seconds() / 3600.0


@dataclass
class UserProfile:
    user: User
    constraints: List[UserConstraint] = field(default_factory=list)
    preferences: List[UserPreference] = field(default_factory=list)

    @property
    def max_per_day(self) -> Optional[int]:
        vals = [c.max_hours_per_day for c in self.constraints if c.max_hours_per_day]
        return min(vals) if vals else None

    @property
    def max_per_week(self) -> Optional[int]:
        vals = [c.max_hours_per_week for c in self.constraints if c.max_hours_per_week]
        return min(vals) if vals else None

    @property
    def min_rest(self) -> Optional[int]:
        vals = [c.min_rest_hours for c in self.constraints if c.min_rest_hours]
        return max(vals) if vals else None

    def unavailable(self, start: datetime, end: datetime) -> bool:
        """True if the slot overlaps any HARD unavailability window."""
        for c in self.constraints:
            if (
                c.constraint_type == "HARD"
                and c.unavailable_start
                and c.unavailable_end
                and not (end <= c.unavailable_start or start >= c.unavailable_end)
            ):
                return True
        return False

    def preference_score(self, slot: Slot) -> int:
        """
        Higher = better fit for the user's preferences. Accumulates the weight of
        every preference that matches the slot (time + day of week).
        """
        score = 0
        for p in self.preferences:
            if p.preferred_days and (slot.start.isoweekday() not in p.preferred_days):
                continue
            if p.preferred_start and p.preferred_end:
                if _time_in_window(slot.start.time(), p.preferred_start, p.preferred_end):
                    score += p.weight
            else:
                score += p.weight
        return score


def _time_in_window(t: time, start: time, end: time) -> bool:
    if start <= end:
        return start <= t <= end
    # overnight window (e.g. 22:00 - 06:00)
    return t >= start or t <= end


@dataclass
class GenerationResult:
    shifts: List[ShiftBase] = field(default_factory=list)
    unassigned_requirements: int = 0
    score: Optional[float] = None
    algorithm: str = ""


def expand_requirements(
    requirements: Sequence[ShiftRequirement],
    horizon_start: datetime,
    horizon_end: datetime,
) -> List[Slot]:
    """Filter requirements to the horizon and convert them to Slot objects."""
    slots: List[Slot] = []
    for r in requirements:
        rs = _naive(r.start_time)
        re_ = _naive(r.end_time)
        if re_ <= horizon_start or rs >= horizon_end:
            continue
        s = max(rs, horizon_start)
        e = min(re_, horizon_end)
        if e > s:
            slots.append(Slot(start=s, end=e, required=r.required_count))
    return slots


def templates_to_slots(
    templates: Sequence[ShiftTemplate],
    horizon_start: datetime,
    horizon_end: datetime,
    default_required: int = 1,
) -> List[Slot]:
    """
    Fallback when no ShiftRequirements are configured: materialize the
    service's ShiftTemplates for every day in the horizon.
    """
    slots: List[Slot] = []
    day = horizon_start.date()
    while datetime.combine(day, time.min) < horizon_end:
        for t in templates:
            start_dt = datetime.combine(day, t.start_time)
            if t.end_time <= t.start_time:
                end_dt = datetime.combine(day + timedelta(days=1), t.end_time)
            else:
                end_dt = datetime.combine(day, t.end_time)
            if end_dt <= horizon_start or start_dt >= horizon_end:
                continue
            slots.append(
                Slot(
                    start=max(start_dt, horizon_start),
                    end=min(end_dt, horizon_end),
                    required=default_required,
                )
            )
        day += timedelta(days=1)
    return slots


def _naive(dt: datetime) -> datetime:
    return dt.replace(tzinfo=None) if dt.tzinfo else dt


# ---------------------------------------------------------------------------
# Hard-feasibility check used by every algorithm
# ---------------------------------------------------------------------------


def is_feasible(
    user: UserProfile,
    slot: Slot,
    assignments_by_user: Dict[int, List[ShiftBase]],
) -> bool:
    if not user.user.active:
        return False
    if user.unavailable(slot.start, slot.end):
        return False

    existing = assignments_by_user.get(user.user.id, [])

    # min_rest
    if user.min_rest:
        delta = timedelta(hours=user.min_rest)
        for a in existing:
            if not (slot.end + delta <= a.start_time or slot.start >= a.end_time + delta):
                return False

    # max_per_day
    if user.max_per_day is not None:
        same_day = [a for a in existing if a.start_time.date() == slot.start.date()]
        total = sum(
            (a.end_time - a.start_time).total_seconds() / 3600.0 for a in same_day
        )
        if total + slot.duration_hours > user.max_per_day:
            return False

    # max_per_week (ISO week)
    if user.max_per_week is not None:
        iso_week = slot.start.isocalendar()[:2]
        same_week = [
            a for a in existing if a.start_time.isocalendar()[:2] == iso_week
        ]
        total = sum(
            (a.end_time - a.start_time).total_seconds() / 3600.0 for a in same_week
        )
        if total + slot.duration_hours > user.max_per_week:
            return False

    # overlap with existing assignments
    for a in existing:
        if not (slot.end <= a.start_time or slot.start >= a.end_time):
            return False

    return True


def build_profiles(
    users: Sequence[User],
    constraints: Sequence[UserConstraint],
    preferences: Sequence[UserPreference],
) -> List[UserProfile]:
    by_user_constraints: Dict[int, List[UserConstraint]] = {}
    for c in constraints:
        by_user_constraints.setdefault(c.user_id, []).append(c)
    by_user_preferences: Dict[int, List[UserPreference]] = {}
    for p in preferences:
        by_user_preferences.setdefault(p.user_id, []).append(p)

    return [
        UserProfile(
            user=u,
            constraints=by_user_constraints.get(u.id, []),
            preferences=by_user_preferences.get(u.id, []),
        )
        for u in users
        if u.active
    ]
