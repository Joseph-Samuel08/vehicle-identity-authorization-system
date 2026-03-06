"""Pydantic schemas for owner data."""

from typing import Annotated

from pydantic import BaseModel, ConfigDict, EmailStr, Field, StringConstraints


NonEmptyString = Annotated[str, StringConstraints(strip_whitespace=True, min_length=1)]
PhoneNumberString = Annotated[
    str,
    StringConstraints(strip_whitespace=True, min_length=10),
]


class OwnerBase(BaseModel):
    """Shared owner fields."""

    name: NonEmptyString = Field(..., examples=["Alex Johnson"])
    email: EmailStr = Field(..., examples=["alex.johnson@example.com"])
    phone_number: PhoneNumberString = Field(..., examples=["+1-555-0100"])


class OwnerCreate(OwnerBase):
    """Schema for creating an owner."""


class OwnerResponse(OwnerBase):
    """Schema returned for owner records."""

    id: int

    model_config = ConfigDict(from_attributes=True)
