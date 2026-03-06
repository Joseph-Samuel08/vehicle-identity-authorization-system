"""Vehicle ORM model."""

from sqlalchemy import Column, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from app.database import Base


class Vehicle(Base):
    """Represents a registered vehicle."""

    __tablename__ = "vehicles"

    id = Column(Integer, primary_key=True, index=True)
    vehicle_number = Column(String, unique=True, index=True, nullable=False)
    vehicle_type = Column(String, nullable=False)
    manufacturer = Column(String, nullable=False)
    model_name = Column(String, nullable=False)
    manufacture_year = Column(Integer, nullable=False)
    owner_id = Column(Integer, ForeignKey("owners.id"), index=True, nullable=False)

    owner = relationship("Owner", back_populates="vehicles")
    insurance = relationship("Insurance", back_populates="vehicle", uselist=False)
