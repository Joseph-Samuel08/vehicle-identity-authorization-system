"""Pydantic schemas for insurance data."""

from datetime import date
from enum import Enum
from typing import Annotated

from pydantic import BaseModel, ConfigDict, Field, StringConstraints


NonEmptyString = Annotated[str, StringConstraints(strip_whitespace=True, min_length=1)]


class InsuranceStatus(str, Enum):
    """Allowed insurance status values."""

    ACTIVE = "ACTIVE"
    EXPIRED = "EXPIRED"


class InsuranceBase(BaseModel):
    """Shared insurance fields."""

    vehicle_id: int = Field(..., gt=0, examples=[1])
    provider_name: NonEmptyString = Field(..., examples=["SecureDrive Insurance"])
    policy_number: NonEmptyString = Field(..., examples=["POLICY-2026-001"])
    expiry_date: date = Field(..., examples=["2027-12-31"])
    status: InsuranceStatus = Field(..., examples=["ACTIVE"])


class InsuranceCreate(InsuranceBase):
    """Schema for creating an insurance policy."""


class InsuranceResponse(InsuranceBase):
    """Schema returned for insurance records."""

    id: int

    model_config = ConfigDict(from_attributes=True)
