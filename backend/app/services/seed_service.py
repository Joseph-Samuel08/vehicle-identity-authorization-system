"""Demo data seeding utilities."""

from datetime import date

from sqlalchemy import select

from app.database import SessionLocal
from app.models.insurance_model import Insurance
from app.models.owner_model import Owner
from app.models.vehicle_model import Vehicle


def seed_demo_data() -> None:
    """Insert idempotent demo records for local testing and demos."""
    db = SessionLocal()
    try:
        owner = db.execute(
            select(Owner).where(Owner.email == "john.doe@example.com")
        ).scalar_one_or_none()
        if owner is None:
            owner = Owner(
                name="John Doe",
                email="john.doe@example.com",
                phone_number="+91-9876543210",
            )
            db.add(owner)
            db.commit()
            db.refresh(owner)

        vehicle = db.execute(
            select(Vehicle).where(Vehicle.vehicle_number == "TN09AB1234")
        ).scalar_one_or_none()
        if vehicle is None:
            vehicle = Vehicle(
                vehicle_number="TN09AB1234",
                vehicle_type="Car",
                manufacturer="Hyundai",
                model_name="i20",
                manufacture_year=2023,
                owner_id=owner.id,
            )
            db.add(vehicle)
            db.commit()
            db.refresh(vehicle)

        insurance = db.execute(
            select(Insurance).where(Insurance.vehicle_id == vehicle.id)
        ).scalar_one_or_none()
        if insurance is None:
            insurance = db.execute(
                select(Insurance).where(Insurance.policy_number == "ICICI-2027-0001")
            ).scalar_one_or_none()
        if insurance is None:
            insurance = Insurance(
                vehicle_id=vehicle.id,
                provider_name="ICICI",
                policy_number="ICICI-2027-0001",
                expiry_date=date(2027, 12, 31),
                status="ACTIVE",
            )
            db.add(insurance)
            db.commit()
    finally:
        db.close()
