from typing import Any, List, Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import and_

from app.db.base import get_db
from app.models.domain import TechnicianProfile, User
from app.schemas.technician import TechnicianProfile as TechnicianProfileSchema

router = APIRouter()

@router.get("/search", response_model=List[TechnicianProfileSchema])
def search_technicians(
    min_lat: float = Query(..., description="Minimum latitude of bounding box"),
    max_lat: float = Query(..., description="Maximum latitude of bounding box"),
    min_lon: float = Query(..., description="Minimum longitude of bounding box"),
    max_lon: float = Query(..., description="Maximum longitude of bounding box"),
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
) -> Any:
    """
    Search for technicians within a spatial bounding box.
    """
    technicians = (
        db.query(TechnicianProfile)
        .filter(
            and_(
                TechnicianProfile.latitude >= min_lat,
                TechnicianProfile.latitude <= max_lat,
                TechnicianProfile.longitude >= min_lon,
                TechnicianProfile.longitude <= max_lon,
            )
        )
        .offset(skip)
        .limit(limit)
        .all()
    )
    return technicians
