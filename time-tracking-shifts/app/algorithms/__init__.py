"""Shift generation algorithms (greedy / ilp / genetic)."""

from __future__ import annotations

from datetime import datetime
from typing import Literal

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from ..models import (
    Service,
    ShiftRequirement,
    ShiftTemplate,
    User,
    UserConstraint,
    UserPreference,
)
from . import genetic, greedy, ilp
from .base import (
    GenerationResult,
    build_profiles,
    expand_requirements,
    templates_to_slots,
)

AlgorithmName = Literal["greedy", "ilp", "genetic"]


async def run_algorithm(
    *,
    db: AsyncSession,
    service: Service,
    algorithm: AlgorithmName,
    horizon_start: datetime,
    horizon_end: datetime,
) -> GenerationResult:
    """Load everything we need from the DB and dispatch to the chosen algorithm."""
    users = list(
        (
            await db.execute(
                select(User).where(User.service_id == service.id, User.active.is_(True))
            )
        ).scalars().all()
    )
    user_ids = [u.id for u in users]

    constraints = list(
        (
            await db.execute(
                select(UserConstraint).where(UserConstraint.user_id.in_(user_ids))
            )
        ).scalars().all()
    ) if user_ids else []

    preferences = list(
        (
            await db.execute(
                select(UserPreference).where(UserPreference.user_id.in_(user_ids))
            )
        ).scalars().all()
    ) if user_ids else []

    requirements = list(
        (
            await db.execute(
                select(ShiftRequirement).where(
                    (ShiftRequirement.service_id == service.id)
                    | (ShiftRequirement.service_id.is_(None))
                )
            )
        ).scalars().all()
    )

    templates = list(
        (
            await db.execute(
                select(ShiftTemplate).where(ShiftTemplate.service_id == service.id)
            )
        ).scalars().all()
    )

    slots = expand_requirements(requirements, horizon_start, horizon_end)
    if not slots and templates:
        slots = templates_to_slots(templates, horizon_start, horizon_end)

    profiles = build_profiles(users, constraints, preferences)

    if algorithm == "greedy":
        result = greedy.run(slots, profiles)
    elif algorithm == "ilp":
        result = ilp.run(slots, profiles)
    elif algorithm == "genetic":
        result = genetic.run(slots, profiles)
    else:  # defensive
        result = greedy.run(slots, profiles)

    result.algorithm = algorithm
    return result


__all__ = ["run_algorithm", "GenerationResult", "AlgorithmName"]
