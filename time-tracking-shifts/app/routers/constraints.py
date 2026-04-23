"""User constraints CRUD (service-passkey protected)."""

from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from ..database import get_db
from ..dependencies import service_from_user
from ..exceptions import NotFoundError
from ..models import UserConstraint
from ..schemas import (
    UserConstraintCreate,
    UserConstraintOut,
    UserConstraintUpdate,
)

router = APIRouter(prefix="/users/{user_id}/constraints", tags=["constraints"])


@router.post(
    "",
    response_model=UserConstraintOut,
    status_code=status.HTTP_201_CREATED,
)
async def create_constraint(
    payload: UserConstraintCreate,
    ctx: tuple = Depends(service_from_user),
    db: AsyncSession = Depends(get_db),
):
    user, _service = ctx
    row = UserConstraint(user_id=user.id, **payload.model_dump(exclude_unset=True))
    db.add(row)
    await db.commit()
    await db.refresh(row)
    return row


@router.put(
    "/{constraint_id}",
    response_model=UserConstraintOut,
)
async def update_constraint(
    constraint_id: int,
    payload: UserConstraintUpdate,
    ctx: tuple = Depends(service_from_user),
    db: AsyncSession = Depends(get_db),
):
    user, _service = ctx
    row = await db.get(UserConstraint, constraint_id)
    if not row or row.user_id != user.id:
        raise NotFoundError(f"Constraint {constraint_id} not found for user {user.id}")
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(row, field, value)
    await db.commit()
    await db.refresh(row)
    return row


@router.delete(
    "/{constraint_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
async def delete_constraint(
    constraint_id: int,
    ctx: tuple = Depends(service_from_user),
    db: AsyncSession = Depends(get_db),
):
    user, _service = ctx
    row = await db.get(UserConstraint, constraint_id)
    if not row or row.user_id != user.id:
        raise NotFoundError(f"Constraint {constraint_id} not found for user {user.id}")
    await db.delete(row)
    await db.commit()
    return None
