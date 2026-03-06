"""Insurance API routes."""

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.common_schema import ErrorResponse, SuccessResponse
from app.schemas.insurance_schema import InsuranceCreate, InsuranceResponse
from app.services.identity_service import (
    create_insurance_record,
    list_insurance_records,
)


router = APIRouter(prefix="/insurance", tags=["Insurance"])


@router.post(
    "",
    response_model=SuccessResponse[InsuranceResponse],
    status_code=status.HTTP_201_CREATED,
    summary="Register insurance policy",
    description="Create an insurance policy record linked to an existing vehicle.",
    responses={
        status.HTTP_404_NOT_FOUND: {
            "model": ErrorResponse,
            "description": "Vehicle was not found.",
        },
        status.HTTP_400_BAD_REQUEST: {
            "model": ErrorResponse,
            "description": "The policy number already exists or the vehicle is already insured.",
        },
    },
)
def create_insurance(
    insurance_data: InsuranceCreate,
    db: Session = Depends(get_db),
) -> dict:
    """Register an insurance policy for an existing vehicle."""
    insurance = create_insurance_record(insurance_data, db)
    return {"success": True, "data": insurance}


@router.get(
    "",
    response_model=SuccessResponse[list[InsuranceResponse]],
    status_code=status.HTTP_200_OK,
    summary="List insurance policies",
    description="Retrieve all insurance policies stored in the system.",
)
def list_insurance_policies(db: Session = Depends(get_db)) -> dict:
    """Return all insurance policy records."""
    policies = list_insurance_records(db)
    return {"success": True, "data": policies}
