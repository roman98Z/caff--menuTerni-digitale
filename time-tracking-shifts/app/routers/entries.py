"""Check-in / check-out and entries reporting endpoints."""

from datetime import datetime, timezone
from typing import List, Optional

from fastapi import APIRouter, Depends, Query, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from ..database import get_db
from ..dependencies import require_service_passkey, require_user_passkey
from ..exceptions import NotFoundError, ValidationError
from ..models import Entry, Service, Shift, User
from ..schemas import EntryOut
from ..utils import match_entries_to_shifts, parse_day_or_range

router = APIRouter(tags=["entries"])


# ---------------------------------------------------------------------------
# Check-in / check-out
# ---------------------------------------------------------------------------


async def _create_entry(
    db: AsyncSession,
    user: User,
    entry_type: str,
    lat: Optional[float],
    lon: Optional[float],
) -> Entry:
    geoloc = None
    if user.allowed_geoloc:
        if lat is None or lon is None:
            raise ValidationError(
                "lat/lon are required because the user has given geolocation consent"
            )
        geoloc = (float(lat), float(lon))
    # If consent is False we silently ignore any provided coordinates.

    entry = Entry(
        user_id=user.id,
        type=entry_type,
        datetime=datetime.now(timezone.utc),
        geoloc=geoloc,
    )
    db.add(entry)
    await db.commit()
    await db.refresh(entry)
    return entry


async def _enrich_one(db: AsyncSession, entry: Entry) -> EntryOut:
    """Compute late/early for a single entry against its user's shifts on the same day."""
    day_start, day_end = parse_day_or_range(
        entry.datetime.date().isoformat(), None, None
    )
    stmt = select(Shift).where(
        Shift.user_id == entry.user_id,
        Shift.start_time < day_end,
        Shift.end_time > day_start,
    )
    shifts = list((await db.execute(stmt)).scalars().all())
    mapping = match_entries_to_shifts([entry], shifts)
    shift_id, delta, late, early = mapping[entry.id]
    return EntryOut(
        id=entry.id,
        user_id=entry.user_id,
        datetime=entry.datetime,
        type=entry.type,  # type: ignore[arg-type]
        geoloc=entry.geoloc,
        late=late,
        early=early,
        related_shift_id=shift_id,
        delta_minutes=delta,
    )


@router.get(
    "/entries/checkin",
    response_model=EntryOut,
    status_code=status.HTTP_201_CREATED,
    summary="User check-in",
)
async def checkin(
    lat: Optional[float] = Query(None),
    lon: Optional[float] = Query(None),
    user: User = Depends(require_user_passkey),
    db: AsyncSession = Depends(get_db),
):
    entry = await _create_entry(db, user, "entry", lat, lon)
    return await _enrich_one(db, entry)


@router.get(
    "/entries/checkout",
    response_model=EntryOut,
    status_code=status.HTTP_201_CREATED,
    summary="User check-out",
)
async def checkout(
    lat: Optional[float] = Query(None),
    lon: Optional[float] = Query(None),
    user: User = Depends(require_user_passkey),
    db: AsyncSession = Depends(get_db),
):
    entry = await _create_entry(db, user, "exit", lat, lon)
    return await _enrich_one(db, entry)


# ---------------------------------------------------------------------------
# Deletion + reporting
# ---------------------------------------------------------------------------


@router.delete(
    "/entries/{entry_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete a single entry (service-passkey protected)",
)
async def delete_entry(
    entry_id: int,
    service: Service = Depends(require_service_passkey),
    db: AsyncSession = Depends(get_db),
):
    entry = await db.get(Entry, entry_id)
    if not entry:
        raise NotFoundError(f"Entry {entry_id} not found")
    owner = await db.get(User, entry.user_id)
    if not owner or owner.service_id != service.id:
        raise NotFoundError("Entry does not belong to this service")
    await db.delete(entry)
    await db.commit()
    return None


async def _entries_for_users(
    db: AsyncSession,
    user_ids: List[int],
    day: Optional[str],
    start: Optional[str],
    end: Optional[str],
) -> List[EntryOut]:
    range_start, range_end = parse_day_or_range(day, start, end)
    stmt = (
        select(Entry)
        .where(
            Entry.user_id.in_(user_ids),
            Entry.datetime >= range_start,
            Entry.datetime < range_end,
        )
        .order_by(Entry.datetime)
    )
    entries = list((await db.execute(stmt)).scalars().all())

    shift_stmt = select(Shift).where(
        Shift.user_id.in_(user_ids),
        Shift.start_time < range_end,
        Shift.end_time > range_start,
    )
    shifts = list((await db.execute(shift_stmt)).scalars().all())
    mapping = match_entries_to_shifts(entries, shifts)

    out: List[EntryOut] = []
    for e in entries:
        shift_id, delta, late, early = mapping.get(e.id, (None, None, False, False))
        out.append(
            EntryOut(
                id=e.id,
                user_id=e.user_id,
                datetime=e.datetime,
                type=e.type,  # type: ignore[arg-type]
                geoloc=e.geoloc,
                late=late,
                early=early,
                related_shift_id=shift_id,
                delta_minutes=delta,
            )
        )
    return out


@router.get(
    "/entries/user/{user_id}",
    response_model=List[EntryOut],
    summary="Entries for a single user (accepts ?day= or ?start=&end=)",
)
async def entries_for_user(
    user_id: int,
    day: Optional[str] = Query(None, description="YYYY-MM-DD"),
    start: Optional[str] = Query(None),
    end: Optional[str] = Query(None),
    user: User = Depends(require_user_passkey),  # user passkey OR service via header
    db: AsyncSession = Depends(get_db),
):
    # require_user_passkey already validated passkey for ``user_id``
    return await _entries_for_users(db, [user.id], day, start, end)


@router.get(
    "/entries/users",
    response_model=List[EntryOut],
    summary="Entries for a group of users (service-passkey protected)",
)
async def entries_for_group(
    user_ids: List[int] = Query(..., alias="user_id"),
    service_id: int = Query(..., description="Service scope for the passkey check"),
    day: Optional[str] = Query(None),
    start: Optional[str] = Query(None),
    end: Optional[str] = Query(None),
    service: Service = Depends(require_service_passkey),
    db: AsyncSession = Depends(get_db),
):
    # Only return entries for users that belong to this service
    stmt = select(User.id).where(
        User.service_id == service.id, User.id.in_(user_ids)
    )
    allowed = [row[0] for row in (await db.execute(stmt)).all()]
    if not allowed:
        return []
    return await _entries_for_users(db, allowed, day, start, end)


@router.get(
    "/services/{service_id}/entries",
    response_model=List[EntryOut],
    summary="All entries of a service (service-passkey protected)",
)
async def entries_for_service(
    day: Optional[str] = Query(None),
    start: Optional[str] = Query(None),
    end: Optional[str] = Query(None),
    service: Service = Depends(require_service_passkey),
    db: AsyncSession = Depends(get_db),
):
    stmt = select(User.id).where(User.service_id == service.id)
    user_ids = [row[0] for row in (await db.execute(stmt)).all()]
    if not user_ids:
        return []
    return await _entries_for_users(db, user_ids, day, start, end)
