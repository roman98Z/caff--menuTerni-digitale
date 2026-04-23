"""Integer Linear Programming shift assignment (PuLP + CBC).

Decision variables
------------------
``x[i, j] ∈ {0, 1}`` — 1 iff user ``i`` is assigned to slot ``j``.

Objective (maximise)
--------------------
    sum over (i, j) of (1_{match_preference} * w_{ij} - epsilon * duration_{j}) * x[i, j]
    + BIG * sum over j of min(required_j, sum_i x[i, j])

We actually linearise "coverage" by introducing a slack variable ``u_j`` equal
to the number of unassigned positions for slot ``j`` and penalise it heavily.

Hard constraints encoded as linear inequalities
-----------------------------------------------
* sum_i x[i, j] <= required_j                — do not over-staff
* x[i, j] = 0 whenever slot j is inside a HARD unavailability window for user i
* For every pair of overlapping slots (j, k): x[i, j] + x[i, k] <= 1
* For every pair of slots (j, k) whose gap is < min_rest_i: x[i, j] + x[i, k] <= 1
* Daily / weekly hour caps encoded as sum of durations.

Soft constraints (violations enter the objective with small penalties):
* mild penalty when a preference doesn't match (implicit via reward for matches)
"""

from __future__ import annotations

import logging
from typing import Dict, List, Sequence, Tuple

from ..schemas import ShiftBase
from .base import GenerationResult, Slot, UserProfile

logger = logging.getLogger(__name__)

_BIG_PENALTY = 10_000.0


def _overlap(a: Slot, b: Slot) -> bool:
    return not (a.end <= b.start or a.start >= b.end)


def run(
    slots: Sequence[Slot],
    profiles: Sequence[UserProfile],
) -> GenerationResult:
    try:
        import pulp
    except ImportError:  # pragma: no cover
        logger.warning("PuLP not installed — falling back to greedy algorithm")
        from . import greedy
        return greedy.run(slots, profiles)

    if not slots or not profiles:
        return GenerationResult(shifts=[], unassigned_requirements=sum(s.required for s in slots), score=0.0, algorithm="ilp")

    slots = list(slots)
    profiles = list(profiles)
    n_slots = len(slots)
    n_users = len(profiles)

    prob = pulp.LpProblem("shift_scheduling", pulp.LpMaximize)

    # x[i, j]
    x: Dict[Tuple[int, int], "pulp.LpVariable"] = {
        (i, j): pulp.LpVariable(f"x_{i}_{j}", cat=pulp.LpBinary)
        for i in range(n_users)
        for j in range(n_slots)
    }
    # slack u[j] >= 0 : positions left open for slot j
    u = {
        j: pulp.LpVariable(f"u_{j}", lowBound=0, cat=pulp.LpInteger)
        for j in range(n_slots)
    }

    # Objective
    pref_reward = []
    for i, p in enumerate(profiles):
        for j, s in enumerate(slots):
            score = p.preference_score(s)
            pref_reward.append(score * x[(i, j)])
    prob += pulp.lpSum(pref_reward) - _BIG_PENALTY * pulp.lpSum(u.values())

    # 1) Coverage: assigned + slack = required
    for j, s in enumerate(slots):
        prob += (
            pulp.lpSum(x[(i, j)] for i in range(n_users)) + u[j] == s.required,
            f"cover_{j}",
        )

    # 2) Fix x to 0 for hard-infeasible (user, slot) pairs + 0 for inactive users
    for i, p in enumerate(profiles):
        if not p.user.active:
            for j in range(n_slots):
                prob += x[(i, j)] == 0
            continue
        for j, s in enumerate(slots):
            if p.unavailable(s.start, s.end):
                prob += x[(i, j)] == 0

    # 3) No overlapping slots per user  (j < k)
    for i in range(n_users):
        for j in range(n_slots):
            for k in range(j + 1, n_slots):
                if _overlap(slots[j], slots[k]):
                    prob += x[(i, j)] + x[(i, k)] <= 1

    # 4) Min rest between shifts
    for i, p in enumerate(profiles):
        if not p.min_rest:
            continue
        rest = p.min_rest * 3600
        for j in range(n_slots):
            for k in range(j + 1, n_slots):
                sj, sk = slots[j], slots[k]
                if sj.end <= sk.start:
                    gap = (sk.start - sj.end).total_seconds()
                    if gap < rest:
                        prob += x[(i, j)] + x[(i, k)] <= 1
                elif sk.end <= sj.start:
                    gap = (sj.start - sk.end).total_seconds()
                    if gap < rest:
                        prob += x[(i, j)] + x[(i, k)] <= 1

    # 5) Daily & weekly hour caps
    from collections import defaultdict

    by_day: Dict[str, List[int]] = defaultdict(list)
    by_week: Dict[Tuple[int, int], List[int]] = defaultdict(list)
    for j, s in enumerate(slots):
        by_day[s.start.date().isoformat()].append(j)
        iso_year, iso_week, _ = s.start.isocalendar()
        by_week[(iso_year, iso_week)].append(j)

    for i, p in enumerate(profiles):
        if p.max_per_day is not None:
            for _, js in by_day.items():
                prob += (
                    pulp.lpSum(slots[j].duration_hours * x[(i, j)] for j in js)
                    <= p.max_per_day
                )
        if p.max_per_week is not None:
            for _, js in by_week.items():
                prob += (
                    pulp.lpSum(slots[j].duration_hours * x[(i, j)] for j in js)
                    <= p.max_per_week
                )

    solver = pulp.PULP_CBC_CMD(msg=False, timeLimit=30)
    prob.solve(solver)

    if pulp.LpStatus[prob.status] not in ("Optimal", "Feasible"):
        logger.warning(
            "ILP solver status %s — falling back to greedy", pulp.LpStatus[prob.status]
        )
        from . import greedy
        return greedy.run(slots, profiles)

    assignments: List[ShiftBase] = []
    for (i, j), var in x.items():
        if var.value() and round(var.value()) == 1:
            s = slots[j]
            assignments.append(
                ShiftBase(
                    user_id=profiles[i].user.id,
                    start_time=s.start,
                    end_time=s.end,
                )
            )

    unassigned = int(sum(round(var.value() or 0) for var in u.values()))
    score = pulp.value(prob.objective) or 0.0
    return GenerationResult(
        shifts=assignments,
        unassigned_requirements=unassigned,
        score=float(score),
        algorithm="ilp",
    )
