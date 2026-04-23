"""Greedy shift assignment.

Strategy:
  * iterate the slots sorted by start time
  * for each slot, pick the feasible user with the highest preference score
    (ties broken by who currently has the least assigned hours, then by id)
  * repeat ``slot.required`` times per slot
"""

from __future__ import annotations

from typing import Dict, List, Sequence

from ..schemas import ShiftBase
from .base import GenerationResult, Slot, UserProfile, is_feasible


def run(
    slots: Sequence[Slot],
    profiles: Sequence[UserProfile],
) -> GenerationResult:
    assignments: List[ShiftBase] = []
    by_user: Dict[int, List[ShiftBase]] = {p.user.id: [] for p in profiles}
    hours_by_user: Dict[int, float] = {p.user.id: 0.0 for p in profiles}
    unassigned = 0

    sorted_slots = sorted(slots, key=lambda s: (s.start, s.end))

    for slot in sorted_slots:
        needed = slot.required
        for _ in range(needed):
            best = None
            best_score = -1
            for p in profiles:
                if not is_feasible(p, slot, by_user):
                    continue
                # already placed in this slot? skip
                if any(
                    a.start_time == slot.start and a.end_time == slot.end
                    for a in by_user[p.user.id]
                ):
                    continue
                score = p.preference_score(slot)
                # prefer lower current hours as tie-breaker
                score_tuple = (score, -hours_by_user[p.user.id], -p.user.id)
                if best is None or score_tuple > best_score:
                    best = p
                    best_score = score_tuple

            if best is None:
                unassigned += 1
                break
            assignment = ShiftBase(
                user_id=best.user.id,
                start_time=slot.start,
                end_time=slot.end,
            )
            assignments.append(assignment)
            by_user[best.user.id].append(assignment)
            hours_by_user[best.user.id] += slot.duration_hours

    return GenerationResult(
        shifts=assignments,
        unassigned_requirements=unassigned,
        score=float(
            sum(p.preference_score(Slot(a.start_time, a.end_time, 1))
                for a in assignments
                for p in profiles
                if p.user.id == a.user_id)
        ),
        algorithm="greedy",
    )
