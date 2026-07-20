from typing import Optional
from datetime import datetime
from pydantic import BaseModel, ConfigDict

class TechnicianProfileBase(BaseModel):
    bio: Optional[str] = None
    years_experience: Optional[int] = 0
    hourly_rate: Optional[float] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None

class TechnicianProfileCreate(TechnicianProfileBase):
    user_id: int

class TechnicianProfileUpdate(TechnicianProfileBase):
    pass

class TechnicianProfileInDBBase(TechnicianProfileBase):
    id: Optional[int] = None
    user_id: int
    is_verified: bool = False
    rating: float = 0.0
    created_at: Optional[datetime] = None
    
    model_config = ConfigDict(from_attributes=True)

class TechnicianProfile(TechnicianProfileInDBBase):
    pass
