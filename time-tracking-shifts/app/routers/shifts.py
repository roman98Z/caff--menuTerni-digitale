"""Shifts CRUD + automatic generation endpoint."""

from typing import List

from fastapi import APIRouter, Depends, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from ..algorithms import run_algorithm
from ..database import get_db
from ..dependencies import (
    require_service_passkey,
    require_user_or_service_passkey,
)
from ..exceptions import NotFoundError, ValidationError
from ..models import Service, Shift, User
from ..schemas import (
    ShiftCreate,
    ShiftGenerateRequest,
    ShiftGenerateResponse,
    ShiftOut,
    ShiftUpdate,
)

router = APIRouter(tags=["shifts"])


@router.post(
    "/shifts",
    response_model=ShiftOut,
    status_code=status.HTTP_201_CREATED,
    summary="Create a shift manually (service-passkey protected via ?service_id=)",
)
async def create_shift(
    payload: ShiftCreate,
    service_id: int,  # query or path? we use query for consistency
    service: Service = Depends(require_service_passkey),
    db: AsyncSession = Depends(get_db),
):
    user = await db.get(User, payload.user_id)
    if not user or user.service_id != service.id:
        raise NotFoundError("User not found in this service")
    if payload.end_time <= payload.start_time:
        raise ValidationError("end_time must be after start_time")
    shift = Shift(**payload.model_dump())
    db.add(shift)
    await db.commit()
    await db.refresh(shift)
    return shift


@router.put(
    "/shifts/{shift_id}",
    response_model=ShiftOut,
    summary="Update a shift (service-passkey protected via ?service_id=)",
)
async def update_shift(
    shift_id: int,
    payload: ShiftUpdate,
    service_id: int,
    service: Service = Depends(require_service_passkey),
    db: AsyncSession = Depends(get_db),
):
    shift = await db.get(Shift, shift_id)
    if not shift:
        raise NotFoundError(f"Shift {shift_id} not found")
    user = await db.get(User, shift.user_id)
    if not user or user.service_id != service.id:
        raise NotFoundError("Shift does not belong to this service")

    data = payload.model_dump(exclude_unset=True)
    if "user_id" in data:
        new_user = await db.get(User, data["user_id"])
        if not new_user or new_user.service_id != service.id:
            raise ValidationError("Target user not in this service")
    for field, value in data.items():
        setattr(shift, field, value)

    if shift.end_time <= shift.start_time:
        raise ValidationError("end_time must be after start_time")

    await db.commit()
    await db.refresh(shift)
    return shift


@router.delete(
    "/shifts/{shift_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete a shift (service-passkey protected via ?service_id=)",
)
async def delete_shift(
    shift_id: int,
    service_id: int,
    service: Service = Depends(require_service_passkey),
    db: AsyncSession = Depends(get_db),
):
    shift = await db.get(Shift, shift_id)
    if not shift:
        raise NotFoundError(f"Shift {shift_id} not found")
    user = await db.get(User, shift.user_id)
    if not user or user.service_id != service.id:
        raise NotFoundError("Shift does not belong to this service")
    await db.delete(shift)
    await db.commit()
    return None


@router.get(
    "/services/{service_id}/shifts",
    response_model=List[ShiftOut],
    summary="All shifts of the service (service-passkey protected)",
)
async def list_service_shifts(
    service: Service = Depends(require_service_passkey),
    db: AsyncSession = Depends(get_db),
):
    stmt = (
        select(Shift)
        .join(User, Shift.user_id == User.id)
        .where(User.service_id == service.id)
        .order_by(Shift.start_time)
    )
    return list((await db.execute(stmt)).scalars().all())


@router.get(
    "/users/{user_id}/shifts",
    response_model=List[ShiftOut],
    summary="Shifts of a user (accepts user or service passkey)",
)
async def list_user_shifts(
    user: User = Depends(require_user_or_service_passkey),
    db: AsyncSession = Depends(get_db),
):
    stmt = select(Shift).where(Shift.user_id == user.id).order_by(Shift.start_time)
    return list((await db.execute(stmt)).scalars().all())


@router.post(
    "/services/{service_id}/shifts/generate",
    response_model=ShiftGenerateResponse,
    summary=(
        "Generate shifts automatically using the algorithm configured on the "
        "service (``shifts_algorithm``). Returns a preview unless ``commit=true``."
    ),
)
async def generate_shifts(
    payload: ShiftGenerateRequest,
    service: Service = Depends(require_service_passkey),
    db: AsyncSession = Depends(get_db),
):
    algo_name = payload.algorithm or service.shifts_algorithm or "greedy"
    if algo_name not in {"greedy", "ilp", "genetic"}:
        raise ValidationError(f"Unknown algorithm: {algo_name}")

    result = await run_algorithm(
        db=db,
        service=service,
        algorithm=algo_name,
        horizon_start=payload.start,
        horizon_end=payload.end,
    )

    committed = False
    if payload.commit and result.shifts:
        for s in result.shifts:
            db.add(Shift(
                user_id=s.user_id,
                start_time=s.start_time,
                end_time=s.end_time,
            ))
        await db.commit()
        committed = True

    return ShiftGenerateResponse(
        algorithm=algo_name,
        generated=len(result.shifts),
        committed=committed,
        shifts=result.shifts,
        unassigned_requirements=result.unassigned_requirements,
        score=result.score,
    )
