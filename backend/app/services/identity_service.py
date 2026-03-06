"""Identity management service functions."""

from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session, joinedload

from app.models.insurance_model import Insurance
from app.models.owner_model import Owner
from app.models.vehicle_model import Vehicle
from app.schemas.insurance_schema import InsuranceCreate
from app.schemas.owner_schema import OwnerCreate
from app.schemas.vehicle_schema import VehicleCreate
from app.services.service_exceptions import ServiceError


def _commit_and_refresh(db: Session, entity: object) -> object:
    """Persist an ORM entity and refresh it from the database."""
    try:
        db.add(entity)
        db.commit()
        db.refresh(entity)
        return entity
    except IntegrityError as exc:
        db.rollback()
        raise ServiceError("Database constraint violation.", 400) from exc
    except Exception:
        db.rollback()
        raise


def create_owner_record(owner_data: OwnerCreate, db: Session) -> Owner:
    """Create a new owner record."""
    existing_owner = db.execute(
        select(Owner).where(Owner.email == owner_data.email)
    ).scalar_one_or_none()
    if existing_owner is not None:
        raise ServiceError("Owner with this email already exists.", 400)

    owner = Owner(**owner_data.model_dump())
    return _commit_and_refresh(db, owner)


def list_owner_records(db: Session) -> list[Owner]:
    """Return all owner records."""
    return db.execute(select(Owner).order_by(Owner.id)).scalars().all()


def create_vehicle_record(vehicle_data: VehicleCreate, db: Session) -> Vehicle:
    """Create a new vehicle record for an existing owner."""
    owner = db.execute(
        select(Owner).where(Owner.id == vehicle_data.owner_id)
    ).scalar_one_or_none()
    if owner is None:
        raise ServiceError("Owner not found.", 404)

    existing_vehicle = db.execute(
        select(Vehicle).where(Vehicle.vehicle_number == vehicle_data.vehicle_number)
    ).scalar_one_or_none()
    if existing_vehicle is not None:
        raise ServiceError("Vehicle with this registration number already exists.", 400)

    vehicle = Vehicle(**vehicle_data.model_dump())
    return _commit_and_refresh(db, vehicle)


def list_vehicle_records(db: Session) -> list[Vehicle]:
    """Return all vehicle records."""
    return db.execute(select(Vehicle).order_by(Vehicle.id)).scalars().all()


def get_vehicle_detail_record(vehicle_id: int, db: Session) -> Vehicle:
    """Return one vehicle together with its owner and insurance data."""
    vehicle = db.execute(
        select(Vehicle)
        .options(joinedload(Vehicle.owner), joinedload(Vehicle.insurance))
        .where(Vehicle.id == vehicle_id)
    ).scalar_one_or_none()
    if vehicle is None:
        raise ServiceError("Vehicle not found", 404)
    return vehicle


def create_insurance_record(insurance_data: InsuranceCreate, db: Session) -> Insurance:
    """Create an insurance policy for an existing vehicle."""
    vehicle = db.execute(
        select(Vehicle).where(Vehicle.id == insurance_data.vehicle_id)
    ).scalar_one_or_none()
    if vehicle is None:
        raise ServiceError("Vehicle not found.", 404)

    existing_policy = db.execute(
        select(Insurance).where(Insurance.policy_number == insurance_data.policy_number)
    ).scalar_one_or_none()
    if existing_policy is not None:
        raise ServiceError("Insurance policy with this number already exists.", 400)

    existing_vehicle_policy = db.execute(
        select(Insurance).where(Insurance.vehicle_id == insurance_data.vehicle_id)
    ).scalar_one_or_none()
    if existing_vehicle_policy is not None:
        raise ServiceError("Vehicle already has an insurance policy.", 400)

    insurance = Insurance(**insurance_data.model_dump())
    return _commit_and_refresh(db, insurance)


def list_insurance_records(db: Session) -> list[Insurance]:
    """Return all insurance policy records."""
    return db.execute(select(Insurance).order_by(Insurance.id)).scalars().all()
