"""Shift requirements CRUD (service-passkey protected)."""

from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from ..database import get_db
from ..dependencies import require_service_passkey
from ..exceptions import NotFoundError, ValidationError
from ..models import Service, ShiftRequirement
from ..schemas import (
    ShiftRequirementCreate,
    ShiftRequirementOut,
    ShiftRequirementUpdate,
)

router = APIRouter(
    prefix="/services/{service_id}/shift-requirements",
    tags=["shift-requirements"],
)


@router.post(
    "",
    response_model=ShiftRequirementOut,
    status_code=status.HTTP_201_CREATED,
)
async def create_requirement(
    payload: ShiftRequirementCreate,
    service: Service = Depends(require_service_passkey),
    db: AsyncSession = Depends(get_db),
):
    if payload.end_time <= payload.start_time:
        raise ValidationError("end_time must be after start_time")
    row = ShiftRequirement(service_id=service.id, **payload.model_dump())
    db.add(row)
    await db.commit()
    await db.refresh(row)
    return row


@router.put(
    "/{requirement_id}",
    response_model=ShiftRequirementOut,
)
async def update_requirement(
    requirement_id: int,
    payload: ShiftRequirementUpdate,
    service: Service = Depends(require_service_passkey),
    db: AsyncSession = Depends(get_db),
):
    row = await db.get(ShiftRequirement, requirement_id)
    if not row or row.service_id != service.id:
        raise NotFoundError(
            f"Requirement {requirement_id} not found for service {service.id}"
        )
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(row, field, value)
    if row.end_time <= row.start_time:
        raise ValidationError("end_time must be after start_time")
    await db.commit()
    await db.refresh(row)
    return row


@router.delete(
    "/{requirement_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
async def delete_requirement(
    requirement_id: int,
    service: Service = Depends(require_service_passkey),
    db: AsyncSession = Depends(get_db),
):
    row = await db.get(ShiftRequirement, requirement_id)
    if not row or row.service_id != service.id:
        raise NotFoundError(
            f"Requirement {requirement_id} not found for service {service.id}"
        )
    await db.delete(row)
    await db.commit()
    return None
