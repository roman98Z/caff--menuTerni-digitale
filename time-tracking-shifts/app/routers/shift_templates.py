"""Shift templates CRUD (service-passkey protected)."""

from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from ..database import get_db
from ..dependencies import require_service_passkey
from ..exceptions import NotFoundError
from ..models import Service, ShiftTemplate
from ..schemas import (
    ShiftTemplateCreate,
    ShiftTemplateOut,
    ShiftTemplateUpdate,
)

router = APIRouter(
    prefix="/services/{service_id}/shift-templates",
    tags=["shift-templates"],
)


@router.post(
    "",
    response_model=ShiftTemplateOut,
    status_code=status.HTTP_201_CREATED,
)
async def create_template(
    payload: ShiftTemplateCreate,
    service: Service = Depends(require_service_passkey),
    db: AsyncSession = Depends(get_db),
):
    row = ShiftTemplate(service_id=service.id, **payload.model_dump())
    db.add(row)
    await db.commit()
    await db.refresh(row)
    return row


@router.put(
    "/{template_id}",
    response_model=ShiftTemplateOut,
)
async def update_template(
    template_id: int,
    payload: ShiftTemplateUpdate,
    service: Service = Depends(require_service_passkey),
    db: AsyncSession = Depends(get_db),
):
    row = await db.get(ShiftTemplate, template_id)
    if not row or row.service_id != service.id:
        raise NotFoundError(
            f"Template {template_id} not found for service {service.id}"
        )
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(row, field, value)
    await db.commit()
    await db.refresh(row)
    return row


@router.delete(
    "/{template_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
async def delete_template(
    template_id: int,
    service: Service = Depends(require_service_passkey),
    db: AsyncSession = Depends(get_db),
):
    row = await db.get(ShiftTemplate, template_id)
    if not row or row.service_id != service.id:
        raise NotFoundError(
            f"Template {template_id} not found for service {service.id}"
        )
    await db.delete(row)
    await db.commit()
    return None
