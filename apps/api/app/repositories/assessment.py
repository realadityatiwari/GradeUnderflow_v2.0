from typing import List, Optional
from uuid import UUID
from sqlalchemy.orm import Session, selectinload

from app.models.assessment import Assessment, AssessmentResult
from app.schemas.assessment import AssessmentCreate, AssessmentUpdate, AssessmentResultUpdate
from app.models.enums import AssessmentType

class AssessmentRepository:
    def create(self, db: Session, obj_in: AssessmentCreate, subject_id: UUID) -> Assessment:
        db_obj = Assessment(
            subject_id=subject_id, # type: ignore
            assessment_type=obj_in.assessment_type, # type: ignore
            assessment_category=obj_in.assessment_category, # type: ignore
            title=obj_in.title, # type: ignore
            max_marks=obj_in.max_marks, # type: ignore
            weightage=obj_in.weightage, # type: ignore
            due_date=obj_in.due_date, # type: ignore
            conducted_on=obj_in.conducted_on, # type: ignore
            display_order=obj_in.display_order, # type: ignore
            is_required=obj_in.is_required, # type: ignore
        )
        db.add(db_obj)
        
        # Auto-create AssessmentResult
        result_obj = AssessmentResult(assessment=db_obj) # type: ignore
        db.add(result_obj)
        
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def get_by_id(self, db: Session, id: UUID) -> Optional[Assessment]:
        return db.query(Assessment).options(selectinload(Assessment.result)).filter(Assessment.id == id).first()

    def get_all_by_subject(self, db: Session, subject_id: UUID) -> List[Assessment]:
        return (
            db.query(Assessment)
            .options(selectinload(Assessment.result))
            .filter(Assessment.subject_id == subject_id)
            .order_by(Assessment.display_order.asc(), Assessment.created_at.desc())
            .all()
        )

    def exists_by_type(self, db: Session, subject_id: UUID, assessment_type: AssessmentType) -> bool:
        return db.query(Assessment).filter(
            Assessment.subject_id == subject_id, 
            Assessment.assessment_type == assessment_type
        ).first() is not None

    def update(self, db: Session, db_obj: Assessment, obj_in: AssessmentUpdate) -> Assessment:
        update_data = obj_in.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_obj, field, value)
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def update_result(self, db: Session, db_obj: AssessmentResult, obj_in: AssessmentResultUpdate) -> AssessmentResult:
        update_data = obj_in.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_obj, field, value)
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def delete(self, db: Session, id: UUID) -> None:
        db_obj = db.query(Assessment).filter(Assessment.id == id).first()
        if db_obj:
            db.delete(db_obj)
            db.commit()

assessment_repo = AssessmentRepository()
