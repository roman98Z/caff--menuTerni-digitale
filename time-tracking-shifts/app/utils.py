"""Small shared utilities (date parsing, shift matching, rate limiting)."""

from __future__ import annotations

import time
from collections import defaultdict, deque
from datetime import date, datetime, timedelta
from typing import Deque, Dict, Iterable, Optional, Tuple

from .models import Entry, Shift


# ---------------------------------------------------------------------------
# Date helpers
# ---------------------------------------------------------------------------


def parse_day_or_range(
    day: Optional[str],
    start: Optional[str],
    end: Optional[str],
) -> Tuple[datetime, datetime]:
    """
    Return the ``[start, end)`` datetime range given either a single ``day``
    (YYYY-MM-DD) or explicit ``start`` / ``end`` ISO-8601 strings.
    If nothing is provided, defaults to today.
    """
    if start and end:
        return _parse(start), _parse(end)
    if day:
        d = date.fromisoformat(day)
        return (
            datetime.combine(d, datetime.min.time()),
            datetime.combine(d + timedelta(days=1), datetime.min.time()),
        )
    # default: today
    today = date.today()
    return (
        datetime.combine(today, datetime.min.time()),
        datetime.combine(today + timedelta(days=1), datetime.min.time()),
    )


def _parse(value: str) -> datetime:
    try:
        return datetime.fromisoformat(value)
    except ValueError:
        return datetime.combine(date.fromisoformat(value), datetime.min.time())


# ---------------------------------------------------------------------------
# Late / early detection
# ---------------------------------------------------------------------------


def _naive(dt: datetime) -> datetime:
    return dt.replace(tzinfo=None) if dt.tzinfo else dt


def match_entries_to_shifts(
    entries: Iterable[Entry],
    shifts: Iterable[Shift],
    tolerance_minutes: int = 5,
) -> Dict[int, Tuple[Optional[int], Optional[int], bool, bool]]:
    """
    Associate each entry to the nearest planned shift and compute ``late``/``early``
    flags.

    Returns a dict keyed by ``entry.id`` with values
    ``(shift_id, delta_minutes, late, early)`` where:

    * ``delta_minutes`` is the signed difference in minutes between the entry
      datetime and the shift boundary (``start_time`` for entries of type
      ``entry``, ``end_time`` for ``exit`` entries). Positive = the entry happened
      after the boundary.
    * ``late`` is ``True`` when the entry happened ``> tolerance_minutes`` after
      a shift start (for type ``entry``) or before a shift end (for type ``exit``).
    * ``early`` is ``True`` when the entry happened ``> tolerance_minutes`` before
      a shift start (type ``entry``) or after a shift end (type ``exit``).
    """
    shifts_by_user: Dict[int, list[Shift]] = defaultdict(list)
    for s in shifts:
        shifts_by_user[s.user_id].append(s)

    result: Dict[int, Tuple[Optional[int], Optional[int], bool, bool]] = {}
    for entry in entries:
        entry_dt = _naive(entry.datetime)
        candidates = shifts_by_user.get(entry.user_id, [])
        if not candidates:
            result[entry.id] = (None, None, False, False)
            continue

        if entry.type == "entry":
            # nearest shift by start_time
            closest = min(candidates, key=lambda s: abs((_naive(s.start_time) - entry_dt).total_seconds()))
            boundary = _naive(closest.start_time)
            delta_sec = (entry_dt - boundary).total_seconds()
            delta_min = int(delta_sec / 60)
            late = delta_sec > tolerance_minutes * 60
            early = delta_sec < -tolerance_minutes * 60
        else:  # exit
            closest = min(candidates, key=lambda s: abs((_naive(s.end_time) - entry_dt).total_seconds()))
            boundary = _naive(closest.end_time)
            delta_sec = (entry_dt - boundary).total_seconds()
            delta_min = int(delta_sec / 60)
            # "late" exit = user checked out after planned end, "early" = before
            late = delta_sec > tolerance_minutes * 60
            early = delta_sec < -tolerance_minutes * 60

        result[entry.id] = (closest.id, delta_min, late, early)

    return result


# ---------------------------------------------------------------------------
# Minimal in-memory rate limiter (per-IP)
# ---------------------------------------------------------------------------


class RateLimiter:
    """Sliding-window rate limiter, fine for single-process small deployments."""

    def __init__(self, max_requests: int, window_seconds: int = 60):
        self.max_requests = max_requests
        self.window_seconds = window_seconds
        self._hits: Dict[str, Deque[float]] = defaultdict(deque)

    def check(self, key: str) -> bool:
        if self.max_requests <= 0:
            return True
        now = time.monotonic()
        window_start = now - self.window_seconds
        q = self._hits[key]
        while q and q[0] < window_start:
            q.popleft()
        if len(q) >= self.max_requests:
            return False
        q.append(now)
        return True
