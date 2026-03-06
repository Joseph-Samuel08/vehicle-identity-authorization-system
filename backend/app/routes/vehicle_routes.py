"""Vehicle API routes."""

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.common_schema import ErrorResponse, SuccessResponse
from app.schemas.vehicle_schema import (
    VehicleAuthorizationResponse,
    VehicleCreate,
    VehicleDetailResponse,
    VehicleResponse,
)
from app.services.authorization_service import check_vehicle_authorization
from app.services.identity_service import (
    create_vehicle_record,
    get_vehicle_detail_record,
    list_vehicle_records,
)
from app.services.service_exceptions import ServiceError


vehicle_router = APIRouter(prefix="/vehicles", tags=["Vehicles"])
authorization_router = APIRouter(prefix="/vehicles", tags=["Authorization"])


@vehicle_router.post(
    "",
    response_model=SuccessResponse[VehicleResponse],
    status_code=status.HTTP_201_CREATED,
    summary="Register vehicle",
    description="Create a new vehicle record and link it to an existing owner.",
    responses={
        status.HTTP_404_NOT_FOUND: {
            "model": ErrorResponse,
            "description": "Owner was not found.",
        },
        status.HTTP_400_BAD_REQUEST: {
            "model": ErrorResponse,
            "description": "A vehicle with the same registration number already exists.",
        },
    },
)
def create_vehicle(vehicle_data: VehicleCreate, db: Session = Depends(get_db)) -> dict:
    """Register a vehicle for an existing owner."""
    vehicle = create_vehicle_record(vehicle_data, db)
    return {"success": True, "data": vehicle}


@vehicle_router.get(
    "",
    response_model=SuccessResponse[list[VehicleResponse]],
    status_code=status.HTTP_200_OK,
    summary="List vehicles",
    description="Retrieve all registered vehicles from the identity registry.",
)
def list_vehicles(db: Session = Depends(get_db)) -> dict:
    """Return all registered vehicles."""
    vehicles = list_vehicle_records(db)
    return {"success": True, "data": vehicles}


@vehicle_router.get(
    "/{vehicle_id}",
    response_model=SuccessResponse[VehicleDetailResponse],
    status_code=status.HTTP_200_OK,
    summary="Get vehicle details",
    description="Retrieve a vehicle together with its linked owner and insurance information.",
    responses={
        status.HTTP_404_NOT_FOUND: {
            "model": ErrorResponse,
            "description": "Vehicle was not found.",
        }
    },
)
def get_vehicle(vehicle_id: int, db: Session = Depends(get_db)) -> dict:
    """Return a single vehicle with owner and insurance details."""
    vehicle = get_vehicle_detail_record(vehicle_id, db)
    return {"success": True, "data": vehicle}


@authorization_router.get(
    "/{vehicle_id}/authorization",
    response_model=SuccessResponse[VehicleAuthorizationResponse],
    status_code=status.HTTP_200_OK,
    summary="Check vehicle authorization",
    description="Evaluate whether a vehicle is authorized based on ownership and insurance compliance.",
    responses={
        status.HTTP_404_NOT_FOUND: {
            "model": ErrorResponse,
            "description": "Vehicle was not found.",
        }
    },
)
def get_vehicle_authorization(
    vehicle_id: int,
    db: Session = Depends(get_db),
) -> dict:
    """Return the current authorization decision for a vehicle."""
    authorization_result = check_vehicle_authorization(vehicle_id=vehicle_id, db=db)
    if authorization_result["authorization_status"] == "NOT_FOUND":
        raise ServiceError(authorization_result["message"], status.HTTP_404_NOT_FOUND)

    return {"success": True, "data": authorization_result}
