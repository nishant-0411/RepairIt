from fastapi import APIRouter
from app.api.v1.endpoints import chat, guides, auth, technicians, bookings

api_router = APIRouter()
api_router.include_router(chat.router, prefix="/chat", tags=["chat"])
api_router.include_router(guides.router, prefix="/guides", tags=["guides"])
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(technicians.router, prefix="/technicians", tags=["technicians"])
api_router.include_router(bookings.router, prefix="/bookings", tags=["bookings"])