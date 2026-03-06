"""Authorization decision service for vehicle identity checks."""

from datetime import date
from typing import Any, Dict

from sqlalchemy import select
from sqlalchemy.orm import Session, joinedload

from app.models.vehicle_model import Vehicle


def check_vehicle_authorization(vehicle_id: int, db: Session) -> Dict[str, Any]:
    """Evaluate whether a vehicle is authorized to interact with the platform."""
    vehicle = db.execute(
        select(Vehicle)
        .options(joinedload(Vehicle.owner), joinedload(Vehicle.insurance))
        .where(Vehicle.id == vehicle_id)
    ).scalar_one_or_none()

    if vehicle is None:
        return {
            "vehicle_id": vehicle_id,
            "authorization_status": "NOT_FOUND",
            "message": "Vehicle not found",
        }

    if vehicle.owner is None:
        return {
            "vehicle_id": vehicle_id,
            "authorization_status": "BLOCKED",
            "message": "Vehicle has no registered owner",
        }

    insurance = vehicle.insurance
    if insurance is None:
        return {
            "vehicle_id": vehicle_id,
            "authorization_status": "BLOCKED",
            "message": "No insurance policy found",
        }

    insurance_status = insurance.status.strip().upper()
    if insurance_status == "EXPIRED":
        return {
            "vehicle_id": vehicle_id,
            "authorization_status": "BLOCKED",
            "message": "Insurance policy expired",
        }

    if insurance_status != "ACTIVE":
        return {
            "vehicle_id": vehicle_id,
            "authorization_status": "BLOCKED",
            "message": "Insurance policy is not active",
        }

    if insurance.expiry_date < date.today():
        return {
            "vehicle_id": vehicle_id,
            "authorization_status": "BLOCKED",
            "message": "Insurance validity expired",
        }

    return {
        "vehicle_id": vehicle_id,
        "authorization_status": "AUTHORIZED",
        "message": "Vehicle identity verified and insurance valid",
    }
