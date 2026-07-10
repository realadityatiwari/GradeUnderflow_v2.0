from typing import List, Optional
from uuid import UUID

from sqlalchemy.orm import Session

from app.models.semester import Semester
from app.models.enums import SemesterStatus
from app.schemas.semester import SemesterCreate, SemesterUpdate

class SemesterRepository:
    def create(self, db: Session, obj_in: SemesterCreate, user_id: UUID) -> Semester:
        db_obj = Semester(
            user_id=user_id,
            name=obj_in.name,
            academic_year=obj_in.academic_year,
            semester_type=obj_in.semester_type,
            status=obj_in.status,
            start_date=obj_in.start_date,
            end_date=obj_in.end_date,
        )
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def get_by_id(self, db: Session, id: UUID, user_id: UUID) -> Optional[Semester]:
        return db.query(Semester).filter(Semester.id == id, Semester.user_id == user_id).first()

    def get_all_by_user(self, db: Session, user_id: UUID) -> List[Semester]:
        return db.query(Semester).filter(Semester.user_id == user_id).order_by(Semester.created_at.desc()).all()

    def get_current_for_user(self, db: Session, user_id: UUID) -> Optional[Semester]:
        return db.query(Semester).filter(
            Semester.user_id == user_id, 
            Semester.status == SemesterStatus.CURRENT
        ).first()

    def update(self, db: Session, db_obj: Semester, obj_in: SemesterUpdate) -> Semester:
        update_data = obj_in.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_obj, field, value)
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def delete(self, db: Session, id: UUID) -> None:
        db_obj = db.query(Semester).filter(Semester.id == id).first()
        if db_obj:
            db.delete(db_obj)
            db.commit()

semester_repo = SemesterRepository()
