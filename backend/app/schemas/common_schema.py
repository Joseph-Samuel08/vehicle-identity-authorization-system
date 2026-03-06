"""Common API response schemas."""

from typing import Generic, TypeVar

from pydantic import BaseModel, Field


T = TypeVar("T")


class SuccessResponse(BaseModel, Generic[T]):
    """Standard success response envelope."""

    success: bool = Field(default=True, examples=[True])
    data: T


class ErrorResponse(BaseModel):
    """Standard error response envelope."""

    success: bool = Field(default=False, examples=[False])
    message: str = Field(..., examples=["Vehicle not found."])


class HealthStatusResponse(BaseModel):
    """Health check payload."""

    status: str = Field(..., examples=["system operational"])
    service: str = Field(
        ...,
        examples=["Vehicle Identity Authorization System"],
    )
