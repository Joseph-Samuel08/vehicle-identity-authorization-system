"""Owner API routes."""

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.common_schema import ErrorResponse, SuccessResponse
from app.schemas.owner_schema import OwnerCreate, OwnerResponse
from app.services.identity_service import create_owner_record, list_owner_records


router = APIRouter(prefix="/owners", tags=["Owners"])


@router.post(
    "",
    response_model=SuccessResponse[OwnerResponse],
    status_code=status.HTTP_201_CREATED,
    summary="Register owner",
    description="Create a new owner identity record for the authorization system.",
    responses={
        status.HTTP_400_BAD_REQUEST: {
            "model": ErrorResponse,
            "description": "Owner with the same email already exists.",
        }
    },
)
def create_owner(owner_data: OwnerCreate, db: Session = Depends(get_db)) -> dict:
    """Register a new owner."""
    owner = create_owner_record(owner_data, db)
    return {"success": True, "data": owner}


@router.get(
    "",
    response_model=SuccessResponse[list[OwnerResponse]],
    status_code=status.HTTP_200_OK,
    summary="List owners",
    description="Retrieve all registered owners for demo and debugging purposes.",
)
def list_owners(db: Session = Depends(get_db)) -> dict:
    """Return all registered owners."""
    owners = list_owner_records(db)
    return {"success": True, "data": owners}
