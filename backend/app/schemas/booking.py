from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import Optional
from app.models.domain import BookingStatus

class BookingBase(BaseModel):
    technician_id: int
    scheduled_at: datetime
    notes: Optional[str] = None

class BookingCreate(BookingBase):
    pass

class BookingUpdate(BaseModel):
    status: BookingStatus

class BookingInDBBase(BookingBase):
    id: int
    customer_id: int
    status: BookingStatus
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

class Booking(BookingInDBBase):
    pass
