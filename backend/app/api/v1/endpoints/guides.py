from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from app import schemas, models
from app.api import deps

router = APIRouter()

def trigger_guide_embeddings(guide_id: int, db: Session):
    pass

@router.post("/", response_model=schemas.Guide)
def create_guide(
    *,
    db: Session = Depends(deps.get_db),
    guide_in: schemas.GuideCreate,
    current_user: models.User = Depends(deps.get_current_user),
    background_tasks: BackgroundTasks,
) -> Any:
    guide = models.Guide(
        title=guide_in.title,
        summary=guide_in.summary,
        category_id=guide_in.category_id,
        author_id=current_user.id,
    )
    db.add(guide)
    db.commit()
    db.refresh(guide)

    if guide_in.steps:
        for step in guide_in.steps:
            guide_step = models.GuideStep(
                guide_id=guide.id,
                step_number=step.step_number,
                instruction=step.instruction,
                image_url=step.image_url,
            )
            db.add(guide_step)
        db.commit()
        db.refresh(guide)

    background_tasks.add_task(trigger_guide_embeddings, guide.id, db)
    return guide

@router.get("/", response_model=List[schemas.Guide])
def read_guides(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
) -> Any:
    guides = db.query(models.Guide).offset(skip).limit(limit).all()
    return guides

@router.get("/{guide_id}", response_model=schemas.Guide)
def read_guide(
    *,
    db: Session = Depends(deps.get_db),
    guide_id: int,
) -> Any:
    guide = db.query(models.Guide).filter(models.Guide.id == guide_id).first()
    if not guide:
        raise HTTPException(status_code=404, detail="Guide not found")
    return guide

@router.put("/{guide_id}", response_model=schemas.Guide)
def update_guide(
    *,
    db: Session = Depends(deps.get_db),
    guide_id: int,
    guide_in: schemas.GuideUpdate,
    current_user: models.User = Depends(deps.get_current_user),
) -> Any:
    guide = db.query(models.Guide).filter(models.Guide.id == guide_id).first()
    if not guide:
        raise HTTPException(status_code=404, detail="Guide not found")
    if guide.author_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    update_data = guide_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(guide, field, value)
    
    db.add(guide)
    db.commit()
    db.refresh(guide)
    return guide

@router.delete("/{guide_id}", response_model=schemas.Guide)
def delete_guide(
    *,
    db: Session = Depends(deps.get_db),
    guide_id: int,
    current_user: models.User = Depends(deps.get_current_user),
) -> Any:
    guide = db.query(models.Guide).filter(models.Guide.id == guide_id).first()
    if not guide:
        raise HTTPException(status_code=404, detail="Guide not found")
    if guide.author_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    db.delete(guide)
    db.commit()
    return guide
