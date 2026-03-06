"""Pydantic schemas for vehicle data."""

from typing import Annotated, Optional

from pydantic import BaseModel, ConfigDict, Field, StringConstraints

from app.schemas.insurance_schema import InsuranceResponse
from app.schemas.owner_schema import OwnerResponse


NonEmptyString = Annotated[str, StringConstraints(strip_whitespace=True, min_length=1)]


class VehicleBase(BaseModel):
    """Shared vehicle fields."""

    vehicle_number: NonEmptyString = Field(..., examples=["KA01AB1234"])
    vehicle_type: NonEmptyString = Field(..., examples=["Car"])
    manufacturer: NonEmptyString = Field(..., examples=["Toyota"])
    model_name: NonEmptyString = Field(..., examples=["Corolla"])
    manufacture_year: int = Field(..., ge=1990, examples=[2022])
    owner_id: int = Field(..., gt=0, examples=[1])


class VehicleCreate(VehicleBase):
    """Schema for creating a vehicle."""


class VehicleResponse(VehicleBase):
    """Schema returned for vehicle records."""

    id: int

    model_config = ConfigDict(from_attributes=True)


class VehicleAuthorizationResponse(BaseModel):
    """Schema returned for vehicle authorization checks."""

    vehicle_id: int = Field(..., examples=[5])
    authorization_status: str = Field(..., examples=["AUTHORIZED"])
    message: str = Field(
        ...,
        examples=["Vehicle identity verified and insurance valid"],
    )


class VehicleDetailResponse(VehicleResponse):
    """Schema returned for detailed vehicle records."""

    owner: Optional[OwnerResponse] = None
    insurance: Optional[InsuranceResponse] = None

    model_config = ConfigDict(from_attributes=True)
