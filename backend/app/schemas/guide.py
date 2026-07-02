from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel, ConfigDict

class GuideStepBase(BaseModel):
    step_number: int
    instruction: str
    image_url: Optional[str] = None

class GuideStepCreate(GuideStepBase):
    pass

class GuideStepUpdate(BaseModel):
    step_number: Optional[int] = None
    instruction: Optional[str] = None
    image_url: Optional[str] = None

class GuideStep(GuideStepBase):
    id: int
    guide_id: int

    model_config = ConfigDict(from_attributes=True)

class GuideBase(BaseModel):
    title: str
    summary: Optional[str] = None
    category_id: int

class GuideCreate(GuideBase):
    steps: Optional[List[GuideStepCreate]] = None

class GuideUpdate(BaseModel):
    title: Optional[str] = None
    summary: Optional[str] = None
    category_id: Optional[int] = None

class Guide(GuideBase):
    id: int
    author_id: int
    created_at: datetime
    updated_at: datetime
    steps: List[GuideStep] = []

    model_config = ConfigDict(from_attributes=True)
