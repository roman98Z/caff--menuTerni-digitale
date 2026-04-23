"""SQLAlchemy 2.x models for Time Tracking & Shifts."""

from __future__ import annotations

from datetime import datetime, time
from typing import List, Optional, Tuple

from asyncpg import Point as PGPoint
from sqlalchemy import (
    ARRAY,
    Boolean,
    CheckConstraint,
    DateTime,
    ForeignKey,
    Index,
    Integer,
    String,
    Text,
    Time,
    func,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.types import UserDefinedType

from .database import Base


class Point(UserDefinedType):
    """Map the PostgreSQL geometric POINT type to a ``(x, y)`` tuple of floats."""

    cache_ok = True

    def get_col_spec(self, **kw):  # pragma: no cover - trivial
        return "POINT"

    def bind_processor(self, dialect):
        def process(value):
            if value is None:
                return None
            if isinstance(value, PGPoint):
                return value
            if isinstance(value, (tuple, list)) and len(value) == 2:
                return PGPoint(float(value[0]), float(value[1]))
            if isinstance(value, dict) and "lat" in value and "lon" in value:
                return PGPoint(float(value["lat"]), float(value["lon"]))
            raise ValueError(f"Cannot convert {value!r} to POINT")

        return process

    def result_processor(self, dialect, coltype):
        def process(value):
            if value is None:
                return None
            if isinstance(value, PGPoint):
                return (float(value.x), float(value.y))
            if isinstance(value, (tuple, list)) and len(value) == 2:
                return (float(value[0]), float(value[1]))
            return value

        return process


class Service(Base):
    __tablename__ = "services"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(Text, nullable=False)
    passkey: Mapped[str] = mapped_column(Text, nullable=False)
    shifts_algorithm: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    users: Mapped[List["User"]] = relationship(
        back_populates="service", cascade="all, delete-orphan", passive_deletes=True
    )
    shift_templates: Mapped[List["ShiftTemplate"]] = relationship(
        back_populates="service", cascade="all, delete-orphan", passive_deletes=True
    )


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    firstname: Mapped[str] = mapped_column(Text, nullable=False)
    lastname: Mapped[str] = mapped_column(Text, nullable=False)
    telephone: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    email: Mapped[Optional[str]] = mapped_column(Text, unique=True, nullable=True)
    password_hash: Mapped[str] = mapped_column(Text, nullable=False)
    passkey: Mapped[str] = mapped_column(Text, nullable=False)
    service_id: Mapped[Optional[int]] = mapped_column(
        ForeignKey("services.id", ondelete="CASCADE"), nullable=True
    )
    allowed_geoloc: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)

    service: Mapped[Optional[Service]] = relationship(back_populates="users")
    entries: Mapped[List["Entry"]] = relationship(
        back_populates="user", cascade="all, delete-orphan", passive_deletes=True
    )
    shifts: Mapped[List["Shift"]] = relationship(
        back_populates="user", cascade="all, delete-orphan", passive_deletes=True
    )
    constraints: Mapped[List["UserConstraint"]] = relationship(
        back_populates="user", cascade="all, delete-orphan", passive_deletes=True
    )
    preferences: Mapped[List["UserPreference"]] = relationship(
        back_populates="user", cascade="all, delete-orphan", passive_deletes=True
    )

    __table_args__ = (
        Index("ix_users_service_id", "service_id"),
        Index("ix_users_active", "active"),
    )


class Entry(Base):
    __tablename__ = "entries"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    datetime: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )
    geoloc: Mapped[Optional[Tuple[float, float]]] = mapped_column(Point, nullable=True)
    type: Mapped[str] = mapped_column(String(8), nullable=False)

    user: Mapped[User] = relationship(back_populates="entries")

    __table_args__ = (
        CheckConstraint("type IN ('entry','exit')", name="ck_entries_type"),
        Index("ix_entries_user_id", "user_id"),
        Index("ix_entries_datetime", "datetime"),
    )


class Shift(Base):
    __tablename__ = "shifts"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    start_time: Mapped[datetime] = mapped_column(DateTime(timezone=False), nullable=False)
    end_time: Mapped[datetime] = mapped_column(DateTime(timezone=False), nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=False), server_default=func.now()
    )

    user: Mapped[User] = relationship(back_populates="shifts")

    __table_args__ = (
        Index("ix_shifts_user_id", "user_id"),
        Index("ix_shifts_start_time", "start_time"),
    )


class ShiftRequirement(Base):
    __tablename__ = "shift_requirements"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    start_time: Mapped[datetime] = mapped_column(DateTime(timezone=False), nullable=False)
    end_time: Mapped[datetime] = mapped_column(DateTime(timezone=False), nullable=False)
    required_count: Mapped[int] = mapped_column(Integer, nullable=False)
    # Not in original spec, but lets us scope requirements to a service. Documented in changes.txt.
    service_id: Mapped[Optional[int]] = mapped_column(
        ForeignKey("services.id", ondelete="CASCADE"), nullable=True
    )


class UserConstraint(Base):
    __tablename__ = "user_constraints"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    max_hours_per_week: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    max_hours_per_day: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    min_rest_hours: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    unavailable_start: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=False), nullable=True
    )
    unavailable_end: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=False), nullable=True
    )
    constraint_type: Mapped[Optional[str]] = mapped_column(String(4), nullable=True)

    user: Mapped[User] = relationship(back_populates="constraints")

    __table_args__ = (
        CheckConstraint(
            "constraint_type IS NULL OR constraint_type IN ('HARD','SOFT')",
            name="ck_user_constraints_type",
        ),
        Index("ix_user_constraints_user_id", "user_id"),
    )


class UserPreference(Base):
    __tablename__ = "user_preferences"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    preferred_start: Mapped[Optional[time]] = mapped_column(Time, nullable=True)
    preferred_end: Mapped[Optional[time]] = mapped_column(Time, nullable=True)
    preferred_days: Mapped[Optional[List[int]]] = mapped_column(
        ARRAY(Integer), nullable=True
    )
    weight: Mapped[int] = mapped_column(Integer, default=1, nullable=False)

    user: Mapped[User] = relationship(back_populates="preferences")

    __table_args__ = (Index("ix_user_preferences_user_id", "user_id"),)


class ShiftTemplate(Base):
    __tablename__ = "shift_templates"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    service_id: Mapped[int] = mapped_column(
        ForeignKey("services.id", ondelete="CASCADE"), nullable=False
    )
    name: Mapped[str] = mapped_column(Text, nullable=False)
    start_time: Mapped[time] = mapped_column(Time, nullable=False)
    end_time: Mapped[time] = mapped_column(Time, nullable=False)

    service: Mapped[Service] = relationship(back_populates="shift_templates")

    __table_args__ = (Index("ix_shift_templates_service_id", "service_id"),)
