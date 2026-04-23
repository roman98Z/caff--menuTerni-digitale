"""Service-level endpoints."""

from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from ..database import get_db
from ..dependencies import require_service_passkey
from ..models import Service
from ..schemas import PasskeyUpdate, ServiceOut
from ..security import sha256_hash

router = APIRouter(prefix="/services", tags=["services"])


@router.delete(
    "/{service_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete a service (cascades users, entries, shifts, templates)",
)
async def delete_service(
    service: Service = Depends(require_service_passkey),
    db: AsyncSession = Depends(get_db),
):
    await db.delete(service)
    await db.commit()
    return None


@router.patch(
    "/{service_id}/passkey",
    response_model=ServiceOut,
    summary="Rotate the service passkey",
)
async def update_service_passkey(
    payload: PasskeyUpdate,
    service: Service = Depends(require_service_passkey),
    db: AsyncSession = Depends(get_db),
):
    service.passkey = sha256_hash(payload.new_passkey)
    await db.commit()
    await db.refresh(service)
    return service
