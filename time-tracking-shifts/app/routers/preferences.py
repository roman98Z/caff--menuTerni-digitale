"""User preferences CRUD (service-passkey protected)."""

from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from ..database import get_db
from ..dependencies import service_from_user
from ..exceptions import NotFoundError
from ..models import UserPreference
from ..schemas import (
    UserPreferenceCreate,
    UserPreferenceOut,
    UserPreferenceUpdate,
)

router = APIRouter(prefix="/users/{user_id}/preferences", tags=["preferences"])


@router.post(
    "",
    response_model=UserPreferenceOut,
    status_code=status.HTTP_201_CREATED,
)
async def create_preference(
    payload: UserPreferenceCreate,
    ctx: tuple = Depends(service_from_user),
    db: AsyncSession = Depends(get_db),
):
    user, _service = ctx
    row = UserPreference(user_id=user.id, **payload.model_dump(exclude_unset=True))
    db.add(row)
    await db.commit()
    await db.refresh(row)
    return row


@router.put(
    "/{preference_id}",
    response_model=UserPreferenceOut,
)
async def update_preference(
    preference_id: int,
    payload: UserPreferenceUpdate,
    ctx: tuple = Depends(service_from_user),
    db: AsyncSession = Depends(get_db),
):
    user, _service = ctx
    row = await db.get(UserPreference, preference_id)
    if not row or row.user_id != user.id:
        raise NotFoundError(
            f"Preference {preference_id} not found for user {user.id}"
        )
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(row, field, value)
    await db.commit()
    await db.refresh(row)
    return row


@router.delete(
    "/{preference_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
async def delete_preference(
    preference_id: int,
    ctx: tuple = Depends(service_from_user),
    db: AsyncSession = Depends(get_db),
):
    user, _service = ctx
    row = await db.get(UserPreference, preference_id)
    if not row or row.user_id != user.id:
        raise NotFoundError(
            f"Preference {preference_id} not found for user {user.id}"
        )
    await db.delete(row)
    await db.commit()
    return None
