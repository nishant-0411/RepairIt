import stripe
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import os

from app.api import deps
from app.models.domain import Booking, User, TechnicianProfile, BookingStatus
from app.schemas.booking import BookingCreate, BookingUpdate, Booking as BookingSchema
from app.core.config import settings

router = APIRouter()

stripe.api_key = getattr(settings, "STRIPE_SECRET_KEY", os.getenv("STRIPE_SECRET_KEY", "sk_test_dummy"))

@router.post("/", response_model=dict)
def create_booking(
    booking_in: BookingCreate,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
):
    technician = db.query(TechnicianProfile).filter(TechnicianProfile.id == booking_in.technician_id).first()
    if not technician:
        raise HTTPException(status_code=404, detail="Technician not found")

    booking = Booking(
        customer_id=current_user.id,
        technician_id=booking_in.technician_id,
        scheduled_at=booking_in.scheduled_at,
        notes=booking_in.notes,
        status=BookingStatus.PENDING,
    )
    db.add(booking)
    db.commit()
    db.refresh(booking)

    amount = int((technician.hourly_rate or 50.0) * 100)

    try:
        intent = stripe.PaymentIntent.create(
            amount=amount,
            currency="usd",
            description=f"Booking for technician {technician.id} by user {current_user.id}",
            metadata={"booking_id": booking.id},
        )
        return {"booking": booking, "client_secret": intent.client_secret}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/", response_model=List[BookingSchema])
def read_bookings(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
):
    if current_user.is_technician:
        tech_profile = db.query(TechnicianProfile).filter(TechnicianProfile.user_id == current_user.id).first()
        if tech_profile:
            return db.query(Booking).filter(Booking.technician_id == tech_profile.id).all()
        return []
    return db.query(Booking).filter(Booking.customer_id == current_user.id).all()

@router.patch("/{booking_id}/status", response_model=BookingSchema)
def update_booking_status(
    booking_id: int,
    booking_update: BookingUpdate,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
):
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")

    if not current_user.is_technician and booking.customer_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not enough permissions")

    if current_user.is_technician:
        tech_profile = db.query(TechnicianProfile).filter(TechnicianProfile.user_id == current_user.id).first()
        if not tech_profile or booking.technician_id != tech_profile.id:
            raise HTTPException(status_code=403, detail="Not enough permissions")

    booking.status = booking_update.status
    db.commit()
    db.refresh(booking)
    return booking
