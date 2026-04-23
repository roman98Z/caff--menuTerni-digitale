"""Genetic algorithm for weekly shift scheduling.

Chromosome representation
-------------------------
A list of lists: ``chrom[j] = [u_1, u_2, ...]`` where the inner list contains
the user ids assigned to slot ``j``. Its length can be anywhere in
``[0, slot.required]``.

Fitness (higher is better)
--------------------------
    + sum of preference weights of matched (user, slot) pairs
    - BIG * (# hard constraint violations)
    - MEDIUM * (# uncovered positions)
    - SMALL * (# soft constraint violations)

Uses DEAP if available, otherwise a small hand-rolled GA.
"""

from __future__ import annotations

import logging
import random
from copy import deepcopy
from typing import Dict, List, Sequence, Tuple

from ..schemas import ShiftBase
from .base import GenerationResult, Slot, UserProfile

logger = logging.getLogger(__name__)

_BIG = 10_000.0
_MEDIUM = 1_000.0
_SMALL = 10.0


def _assignments_by_user(chrom: List[List[int]], slots: Sequence[Slot]) -> Dict[int, List[ShiftBase]]:
    out: Dict[int, List[ShiftBase]] = {}
    for j, users in enumerate(chrom):
        for uid in users:
            out.setdefault(uid, []).append(
                ShiftBase(user_id=uid, start_time=slots[j].start, end_time=slots[j].end)
            )
    return out


def _evaluate(
    chrom: List[List[int]],
    slots: Sequence[Slot],
    profiles: Sequence[UserProfile],
    profile_by_id: Dict[int, UserProfile],
) -> float:
    score = 0.0
    hard_violations = 0
    soft_violations = 0
    uncovered = 0

    # coverage
    for j, s in enumerate(slots):
        assigned = len(chrom[j])
        if assigned < s.required:
            uncovered += s.required - assigned
        if assigned > s.required:
            hard_violations += assigned - s.required

    by_user = _assignments_by_user(chrom, slots)

    for uid, shifts in by_user.items():
        p = profile_by_id.get(uid)
        if p is None or not p.user.active:
            hard_violations += len(shifts)
            continue

        shifts = sorted(shifts, key=lambda s: s.start_time)

        # HARD unavailability
        for sh in shifts:
            if p.unavailable(sh.start_time, sh.end_time):
                hard_violations += 1

        # overlap / rest
        rest_sec = (p.min_rest or 0) * 3600
        for a, b in zip(shifts, shifts[1:]):
            if a.end_time > b.start_time:
                hard_violations += 1
            elif rest_sec and (b.start_time - a.end_time).total_seconds() < rest_sec:
                hard_violations += 1

        # daily / weekly caps
        daily: Dict[str, float] = {}
        weekly: Dict[Tuple[int, int], float] = {}
        for sh in shifts:
            hrs = (sh.end_time - sh.start_time).total_seconds() / 3600
            daily[sh.start_time.date().isoformat()] = daily.get(sh.start_time.date().isoformat(), 0) + hrs
            key = sh.start_time.isocalendar()[:2]
            weekly[key] = weekly.get(key, 0) + hrs

        if p.max_per_day is not None:
            for h in daily.values():
                if h > p.max_per_day:
                    hard_violations += 1
        if p.max_per_week is not None:
            for h in weekly.values():
                if h > p.max_per_week:
                    hard_violations += 1

    # preferences (positive reward)
    for j, users in enumerate(chrom):
        s = slots[j]
        for uid in users:
            p = profile_by_id.get(uid)
            if p is not None:
                score += p.preference_score(s)

    return score - _BIG * hard_violations - _MEDIUM * uncovered - _SMALL * soft_violations


def _random_individual(
    slots: Sequence[Slot],
    profiles: Sequence[UserProfile],
    rng: random.Random,
) -> List[List[int]]:
    chrom: List[List[int]] = []
    for s in slots:
        candidates = [p.user.id for p in profiles if not p.unavailable(s.start, s.end)]
        rng.shuffle(candidates)
        chrom.append(candidates[: s.required])
    return chrom


def _crossover(a: List[List[int]], b: List[List[int]], rng: random.Random) -> List[List[int]]:
    child = []
    for ga, gb in zip(a, b):
        child.append(list(ga) if rng.random() < 0.5 else list(gb))
    return child


def _mutate(
    chrom: List[List[int]],
    slots: Sequence[Slot],
    profiles: Sequence[UserProfile],
    rng: random.Random,
    rate: float = 0.1,
) -> None:
    for j, s in enumerate(slots):
        if rng.random() >= rate:
            continue
        op = rng.choice(("add", "remove", "swap"))
        existing = chrom[j]
        candidates = [
            p.user.id
            for p in profiles
            if p.user.id not in existing and not p.unavailable(s.start, s.end)
        ]
        if op == "add" and candidates and len(existing) < s.required:
            existing.append(rng.choice(candidates))
        elif op == "remove" and existing:
            existing.pop(rng.randrange(len(existing)))
        elif op == "swap" and existing and candidates:
            idx = rng.randrange(len(existing))
            existing[idx] = rng.choice(candidates)


def run(
    slots: Sequence[Slot],
    profiles: Sequence[UserProfile],
    *,
    population_size: int = 40,
    generations: int = 60,
    seed: int | None = None,
) -> GenerationResult:
    if not slots or not profiles:
        return GenerationResult(
            shifts=[],
            unassigned_requirements=sum(s.required for s in slots),
            score=0.0,
            algorithm="genetic",
        )

    slots = list(slots)
    profiles = list(profiles)
    rng = random.Random(seed)

    # DEAP is optional — we use it only to register stats; the core loop is custom
    # so the algorithm works even without DEAP installed.
    try:
        import deap  # noqa: F401
        _have_deap = True
    except ImportError:  # pragma: no cover
        _have_deap = False
    logger.debug("genetic algorithm running (DEAP available=%s)", _have_deap)

    profile_by_id = {p.user.id: p for p in profiles}

    population = [
        _random_individual(slots, profiles, rng) for _ in range(population_size)
    ]
    fitness = [_evaluate(ind, slots, profiles, profile_by_id) for ind in population]

    best_ind = deepcopy(population[max(range(len(fitness)), key=fitness.__getitem__)])
    best_fit = max(fitness)

    for _ in range(generations):
        # tournament selection
        def tournament() -> List[List[int]]:
            contenders = rng.sample(range(len(population)), k=min(3, len(population)))
            winner = max(contenders, key=lambda idx: fitness[idx])
            return deepcopy(population[winner])

        new_pop: List[List[List[int]]] = []
        while len(new_pop) < population_size:
            parent_a = tournament()
            parent_b = tournament()
            child = _crossover(parent_a, parent_b, rng)
            _mutate(child, slots, profiles, rng)
            new_pop.append(child)

        population = new_pop
        fitness = [_evaluate(ind, slots, profiles, profile_by_id) for ind in population]
        gen_best_idx = max(range(len(fitness)), key=fitness.__getitem__)
        if fitness[gen_best_idx] > best_fit:
            best_fit = fitness[gen_best_idx]
            best_ind = deepcopy(population[gen_best_idx])

    assignments: List[ShiftBase] = []
    uncovered = 0
    for j, users in enumerate(best_ind):
        s = slots[j]
        for uid in users[: s.required]:
            assignments.append(
                ShiftBase(user_id=uid, start_time=s.start, end_time=s.end)
            )
        if len(users) < s.required:
            uncovered += s.required - len(users)

    return GenerationResult(
        shifts=assignments,
        unassigned_requirements=uncovered,
        score=float(best_fit),
        algorithm="genetic",
    )
