"""Reusable FastAPI dependencies for authentication and lookups."""

from typing import Annotated

from fastapi import Depends, Header, Query
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from .database import get_db
from .exceptions import AuthError, NotFoundError
from .models import Service, User
from .security import verify_hash


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------


async def _service_by_id(db: AsyncSession, service_id: int) -> Service:
    service = await db.get(Service, service_id)
    if not service:
        raise NotFoundError(f"Service {service_id} not found")
    return service


async def _user_by_id(db: AsyncSession, user_id: int) -> User:
    user = await db.get(User, user_id)
    if not user:
        raise NotFoundError(f"User {user_id} not found")
    return user


def _extract_passkey(
    header_value: str | None,
    query_value: str | None,
) -> str:
    """Accept passkey from either X-Passkey header or ?passkey query param."""
    passkey = header_value or query_value
    if not passkey:
        raise AuthError("Missing passkey (use X-Passkey header or ?passkey query)")
    return passkey


# ---------------------------------------------------------------------------
# Service-scoped auth (used by protected service/user endpoints)
# ---------------------------------------------------------------------------


async def require_service_passkey(
    service_id: int,
    x_passkey: Annotated[str | None, Header(alias="X-Passkey")] = None,
    passkey: Annotated[str | None, Query()] = None,
    db: AsyncSession = Depends(get_db),
) -> Service:
    """Verify the passkey matches ``service_id`` and return the Service row."""
    raw = _extract_passkey(x_passkey, passkey)
    service = await _service_by_id(db, service_id)
    if not verify_hash(raw, service.passkey):
        raise AuthError("Invalid service passkey")
    return service


async def service_from_user(
    user_id: int,
    x_passkey: Annotated[str | None, Header(alias="X-Passkey")] = None,
    passkey: Annotated[str | None, Query()] = None,
    db: AsyncSession = Depends(get_db),
) -> tuple[User, Service]:
    """
    Resolve a user and verify that the supplied passkey belongs to their service.
    Used by PATCH /users/{user_id} and similar routes that don't carry service_id.
    """
    raw = _extract_passkey(x_passkey, passkey)
    user = await _user_by_id(db, user_id)
    if user.service_id is None:
        raise AuthError("User is not assigned to a service")
    service = await _service_by_id(db, user.service_id)
    if not verify_hash(raw, service.passkey):
        raise AuthError("Invalid service passkey")
    return user, service


# ---------------------------------------------------------------------------
# User-scoped auth (checkin/checkout, read own shifts)
# ---------------------------------------------------------------------------


async def require_user_passkey(
    user_id: int,
    x_passkey: Annotated[str | None, Header(alias="X-Passkey")] = None,
    passkey: Annotated[str | None, Query()] = None,
    db: AsyncSession = Depends(get_db),
) -> User:
    """Verify the passkey belongs to ``user_id`` and the user is active."""
    raw = _extract_passkey(x_passkey, passkey)
    user = await _user_by_id(db, user_id)
    if not user.active:
        raise AuthError("User is not active")
    if not verify_hash(raw, user.passkey):
        raise AuthError("Invalid user passkey")
    return user


async def require_user_or_service_passkey(
    user_id: int,
    x_passkey: Annotated[str | None, Header(alias="X-Passkey")] = None,
    passkey: Annotated[str | None, Query()] = None,
    db: AsyncSession = Depends(get_db),
) -> User:
    """Accept either the user's own passkey or the service's passkey."""
    raw = _extract_passkey(x_passkey, passkey)
    user = await _user_by_id(db, user_id)
    if verify_hash(raw, user.passkey):
        return user
    if user.service_id is not None:
        service = await _service_by_id(db, user.service_id)
        if verify_hash(raw, service.passkey):
            return user
    raise AuthError("Invalid passkey (neither user nor service)")


# ---------------------------------------------------------------------------
# Convenience re-exports
# ---------------------------------------------------------------------------


async def get_service(
    service_id: int, db: AsyncSession = Depends(get_db)
) -> Service:
    return await _service_by_id(db, service_id)


async def get_user(user_id: int, db: AsyncSession = Depends(get_db)) -> User:
    return await _user_by_id(db, user_id)


async def users_in_service(db: AsyncSession, service_id: int) -> list[User]:
    stmt = select(User).where(User.service_id == service_id)
    return list((await db.execute(stmt)).scalars().all())
