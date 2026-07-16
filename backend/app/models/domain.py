import enum
from datetime import datetime
from pgvector.sqlalchemy import Vector
from sqlalchemy import (
    Column,
    Integer,
    String,
    Boolean,
    Float,
    Text,
    DateTime,
    ForeignKey,
    Enum,
)
from sqlalchemy.orm import relationship
from app.db.base_class import Base 

class BookingStatus(str, enum.Enum):
    PENDING = "pending"
    CONFIRMED = "confirmed"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    CANCELLED = "cancelled"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(120), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    is_technician = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    technician_profile = relationship(
        "TechnicianProfile", back_populates="user", uselist=False, cascade="all, delete-orphan"
    )
    guides = relationship("Guide", back_populates="author", cascade="all, delete-orphan")
    bookings = relationship(
        "Booking", back_populates="customer", foreign_keys="Booking.customer_id", cascade="all, delete-orphan"
    )

class TechnicianProfile(Base):
    __tablename__ = "technician_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    bio = Column(Text, nullable=True)
    years_experience = Column(Integer, default=0, nullable=False)
    hourly_rate = Column(Float, nullable=True)
    is_verified = Column(Boolean, default=False, nullable=False)
    rating = Column(Float, default=0.0, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    user = relationship("User", back_populates="technician_profile")
    bookings = relationship("Booking", back_populates="technician", foreign_keys="Booking.technician_id")

class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, nullable=False)
    description = Column(Text, nullable=True)

    tools = relationship("Tool", back_populates="category", cascade="all, delete-orphan")
    guides = relationship("Guide", back_populates="category", cascade="all, delete-orphan")


class Tool(Base):
    __tablename__ = "tools"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(150), nullable=False)
    description = Column(Text, nullable=True)
    category_id = Column(Integer, ForeignKey("categories.id"), nullable=False)

    category = relationship("Category", back_populates="tools")

class Guide(Base):
    __tablename__ = "guides"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    summary = Column(Text, nullable=True)
    author_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    category_id = Column(Integer, ForeignKey("categories.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    author = relationship("User", back_populates="guides")
    category = relationship("Category", back_populates="guides")
    steps = relationship(
        "GuideStep", back_populates="guide", cascade="all, delete-orphan", order_by="GuideStep.step_number"
    )

class GuideStep(Base):
    __tablename__ = "guide_steps"

    id = Column(Integer, primary_key=True, index=True)
    guide_id = Column(Integer, ForeignKey("guides.id"), nullable=False)
    step_number = Column(Integer, nullable=False)
    instruction = Column(Text, nullable=False)
    image_url = Column(String(500), nullable=True)
    embedding = Column(Vector(1536), nullable=True)

    guide = relationship("Guide", back_populates="steps")

class Booking(Base):
    __tablename__ = "bookings"

    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    technician_id = Column(Integer, ForeignKey("technician_profiles.id"), nullable=False)
    scheduled_at = Column(DateTime, nullable=False)
    status = Column(Enum(BookingStatus), default=BookingStatus.PENDING, nullable=False)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    customer = relationship("User", back_populates="bookings", foreign_keys=[customer_id])
    technician = relationship("TechnicianProfile", back_populates="bookings", foreign_keys=[technician_id])