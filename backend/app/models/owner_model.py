"""Owner ORM model."""

from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship

from app.database import Base


class Owner(Base):
    """Represents a vehicle owner."""

    __tablename__ = "owners"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    phone_number = Column(String, nullable=False)

    vehicles = relationship("Vehicle", back_populates="owner")
