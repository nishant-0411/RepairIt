"""Base class for declarative models, and a single place where every model
gets imported so Alembic's autogenerate can "see" them."""

from app.db.base_class import Base 
from app.models.domain import (
    User,
    TechnicianProfile,
    Category,
    Tool,
    Guide,
    GuideStep,
    Booking,
) 