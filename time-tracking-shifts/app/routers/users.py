"""User management endpoints."""

from typing import List

from fastapi import APIRouter, Depends, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from ..database import get_db
from ..dependencies import (
    get_user,
    require_service_passkey,
    service_from_user,
)
from ..exceptions import NotFoundError, ValidationError
from ..models import Service, User
from ..schemas import (
    PasskeyUpdate,
    UserCreate,
    UserCreateResponse,
    UserOut,
    UserUpdate,
)
from ..security import generate_passkey, generate_password, sha256_hash

router = APIRouter(tags=["users"])


@router.post(
    "/services/{service_id}/users",
    response_model=UserCreateResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a user (auto-generated password, returned in clear in the response)",
)
async def create_user(
    payload: UserCreate,
    service: Service = Depends(require_service_passkey),
    db: AsyncSession = Depends(get_db),
):
    password = generate_password()
    passkey = generate_passkey()

    user = User(
        firstname=payload.firstname,
        lastname=payload.lastname,
        telephone=payload.telephone,
        email=payload.email,
        allowed_geoloc=payload.allowed_geoloc,
        password_hash=sha256_hash(password),
        passkey=sha256_hash(passkey),
        service_id=service.id,
        active=True,
    )
    db.add(user)
    await db.commit()
    await db.refresh(user)

    return UserCreateResponse(
        **UserOut.model_validate(user).model_dump(),
        password=password,
        passkey=passkey,
    )


@router.delete(
    "/services/{service_id}/users/{user_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete a user (cascades entries and shifts)",
)
async def delete_user(
    user_id: int,
    service: Service = Depends(require_service_passkey),
    db: AsyncSession = Depends(get_db),
):
    user = await db.get(User, user_id)
    if not user or user.service_id != service.id:
        raise NotFoundError(f"User {user_id} not found in service {service.id}")
    await db.delete(user)
    await db.commit()
    return None


@router.patch(
    "/users/{user_id}",
    response_model=UserOut,
    summary="Update all fields of a user except id (service-passkey protected)",
)
async def update_user(
    payload: UserUpdate,
    ctx: tuple = Depends(service_from_user),
    db: AsyncSession = Depends(get_db),
):
    user, _service = ctx
    data = payload.model_dump(exclude_unset=True)
    if "password" in data and data["password"] is not None:
        user.password_hash = sha256_hash(data.pop("password"))
    else:
        data.pop("password", None)

    for field, value in data.items():
        setattr(user, field, value)

    await db.commit()
    await db.refresh(user)
    return user


@router.patch(
    "/users/{user_id}/passkey",
    response_model=UserOut,
    summary="Rotate the user passkey (service-passkey protected)",
)
async def update_user_passkey(
    payload: PasskeyUpdate,
    ctx: tuple = Depends(service_from_user),
    db: AsyncSession = Depends(get_db),
):
    user, _service = ctx
    if not payload.new_passkey:
        raise ValidationError("new_passkey cannot be empty")
    user.passkey = sha256_hash(payload.new_passkey)
    await db.commit()
    await db.refresh(user)
    return user


@router.post(
    "/users/{user_id}/activate",
    response_model=UserOut,
    summary="Activate a user (service-passkey protected)",
)
async def activate_user(
    ctx: tuple = Depends(service_from_user),
    db: AsyncSession = Depends(get_db),
):
    user, _service = ctx
    user.active = True
    await db.commit()
    await db.refresh(user)
    return user


@router.post(
    "/users/{user_id}/deactivate",
    response_model=UserOut,
    summary="Deactivate a user (service-passkey protected)",
)
async def deactivate_user(
    ctx: tuple = Depends(service_from_user),
    db: AsyncSession = Depends(get_db),
):
    user, _service = ctx
    user.active = False
    await db.commit()
    await db.refresh(user)
    return user


@router.get(
    "/services/{service_id}/users",
    response_model=List[UserOut],
    summary="List all users of a service (service-passkey protected)",
)
async def list_service_users(
    service: Service = Depends(require_service_passkey),
    db: AsyncSession = Depends(get_db),
):
    stmt = select(User).where(User.service_id == service.id).order_by(User.id)
    return list((await db.execute(stmt)).scalars().all())
