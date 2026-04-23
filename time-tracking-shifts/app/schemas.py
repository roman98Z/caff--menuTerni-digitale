"""Pydantic v2 schemas for request/response validation."""

from __future__ import annotations

from datetime import datetime, time
from typing import List, Literal, Optional, Tuple

from pydantic import BaseModel, ConfigDict, EmailStr, Field


# ---------------------------------------------------------------------------
# Services
# ---------------------------------------------------------------------------


class ServiceBase(BaseModel):
    name: str
    shifts_algorithm: Optional[Literal["greedy", "ilp", "genetic"]] = None


class ServiceCreate(ServiceBase):
    pass


class ServiceOut(ServiceBase):
    id: int
    model_config = ConfigDict(from_attributes=True)


class PasskeyUpdate(BaseModel):
    new_passkey: str = Field(..., min_length=1)


# ---------------------------------------------------------------------------
# Users
# ---------------------------------------------------------------------------


class UserBase(BaseModel):
    firstname: str
    lastname: str
    telephone: Optional[str] = None
    email: Optional[EmailStr] = None
    allowed_geoloc: bool = False


class UserCreate(UserBase):
    """New user — service provides no password (auto-generated & returned in clear)."""


class UserOut(BaseModel):
    id: int
    firstname: str
    lastname: str
    telephone: Optional[str] = None
    email: Optional[EmailStr] = None
    service_id: Optional[int] = None
    allowed_geoloc: bool
    active: bool
    model_config = ConfigDict(from_attributes=True)


class UserCreateResponse(UserOut):
    """Response returned on user creation, including the clear-text password."""

    password: str
    passkey: str


class UserUpdate(BaseModel):
    firstname: Optional[str] = None
    lastname: Optional[str] = None
    telephone: Optional[str] = None
    email: Optional[EmailStr] = None
    allowed_geoloc: Optional[bool] = None
    active: Optional[bool] = None
    service_id: Optional[int] = None
    password: Optional[str] = Field(
        default=None,
        description="If provided, it will be hashed and stored as password_hash.",
    )


# ---------------------------------------------------------------------------
# Entries
# ---------------------------------------------------------------------------


class EntryOut(BaseModel):
    id: int
    user_id: int
    datetime: datetime
    type: Literal["entry", "exit"]
    geoloc: Optional[Tuple[float, float]] = None
    late: bool = False
    early: bool = False
    related_shift_id: Optional[int] = None
    delta_minutes: Optional[int] = Field(
        default=None,
        description=(
            "Minutes of delay vs. the planned shift (positive = late/early exit)."
        ),
    )

    model_config = ConfigDict(from_attributes=True)


# ---------------------------------------------------------------------------
# Shifts
# ---------------------------------------------------------------------------


class ShiftBase(BaseModel):
    user_id: int
    start_time: datetime
    end_time: datetime


class ShiftCreate(ShiftBase):
    pass


class ShiftUpdate(BaseModel):
    user_id: Optional[int] = None
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None


class ShiftOut(ShiftBase):
    id: int
    created_at: Optional[datetime] = None
    model_config = ConfigDict(from_attributes=True)


class ShiftGenerateRequest(BaseModel):
    start: datetime = Field(..., description="Start of the scheduling horizon.")
    end: datetime = Field(..., description="End of the scheduling horizon.")
    commit: bool = Field(
        default=False,
        description="If true, persist the generated shifts; if false, return preview only.",
    )
    algorithm: Optional[Literal["greedy", "ilp", "genetic"]] = Field(
        default=None,
        description="Override the algorithm configured on the service.",
    )


class ShiftGenerateResponse(BaseModel):
    algorithm: str
    generated: int
    committed: bool
    shifts: List[ShiftBase]
    unassigned_requirements: int = 0
    score: Optional[float] = None


# ---------------------------------------------------------------------------
# User constraints
# ---------------------------------------------------------------------------


class UserConstraintBase(BaseModel):
    max_hours_per_week: Optional[int] = None
    max_hours_per_day: Optional[int] = None
    min_rest_hours: Optional[int] = None
    unavailable_start: Optional[datetime] = None
    unavailable_end: Optional[datetime] = None
    constraint_type: Optional[Literal["HARD", "SOFT"]] = None


class UserConstraintCreate(UserConstraintBase):
    pass


class UserConstraintUpdate(UserConstraintBase):
    pass


class UserConstraintOut(UserConstraintBase):
    id: int
    user_id: int
    model_config = ConfigDict(from_attributes=True)


# ---------------------------------------------------------------------------
# User preferences
# ---------------------------------------------------------------------------


class UserPreferenceBase(BaseModel):
    preferred_start: Optional[time] = None
    preferred_end: Optional[time] = None
    preferred_days: Optional[List[int]] = None
    weight: int = 1


class UserPreferenceCreate(UserPreferenceBase):
    pass


class UserPreferenceUpdate(UserPreferenceBase):
    pass


class UserPreferenceOut(UserPreferenceBase):
    id: int
    user_id: int
    model_config = ConfigDict(from_attributes=True)


# ---------------------------------------------------------------------------
# Shift templates
# ---------------------------------------------------------------------------


class ShiftTemplateBase(BaseModel):
    name: str
    start_time: time
    end_time: time


class ShiftTemplateCreate(ShiftTemplateBase):
    pass


class ShiftTemplateUpdate(BaseModel):
    name: Optional[str] = None
    start_time: Optional[time] = None
    end_time: Optional[time] = None


class ShiftTemplateOut(ShiftTemplateBase):
    id: int
    service_id: int
    model_config = ConfigDict(from_attributes=True)


# ---------------------------------------------------------------------------
# Shift requirements
# ---------------------------------------------------------------------------


class ShiftRequirementBase(BaseModel):
    start_time: datetime
    end_time: datetime
    required_count: int = Field(..., ge=1)


class ShiftRequirementCreate(ShiftRequirementBase):
    pass


class ShiftRequirementUpdate(BaseModel):
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None
    required_count: Optional[int] = Field(default=None, ge=1)


class ShiftRequirementOut(ShiftRequirementBase):
    id: int
    service_id: Optional[int] = None
    model_config = ConfigDict(from_attributes=True)
