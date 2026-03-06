"""Insurance ORM model."""

from sqlalchemy import Column, Date, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from app.database import Base


class Insurance(Base):
    """Represents an insurance policy assigned to a vehicle."""

    __tablename__ = "insurance_policies"

    id = Column(Integer, primary_key=True, index=True)
    vehicle_id = Column(Integer, ForeignKey("vehicles.id"), unique=True, nullable=False)
    provider_name = Column(String, nullable=False)
    policy_number = Column(String, unique=True, index=True, nullable=False)
    expiry_date = Column(Date, nullable=False)
    status = Column(String, nullable=False)

    vehicle = relationship("Vehicle", back_populates="insurance")
