from typing import List, Optional
from uuid import UUID
from sqlalchemy.orm import Session

from app.models.subject import Subject
from app.schemas.subject import SubjectCreate, SubjectUpdate

class SubjectRepository:
    def create(self, db: Session, obj_in: SubjectCreate, semester_id: UUID) -> Subject:
        db_obj = Subject(
            semester_id=semester_id,
            code=obj_in.code,
            name=obj_in.name,
            subject_type=obj_in.subject_type,
            credits=obj_in.credits,
            faculty_name=obj_in.faculty_name,
            color=obj_in.color,
            is_active=obj_in.is_active,
        )
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def get_by_id(self, db: Session, id: UUID) -> Optional[Subject]:
        return db.query(Subject).filter(Subject.id == id).first()

    def get_all_by_semester(self, db: Session, semester_id: UUID) -> List[Subject]:
        return db.query(Subject).filter(Subject.semester_id == semester_id).order_by(Subject.created_at.desc()).all()

    def exists_by_code(self, db: Session, semester_id: UUID, code: str, exclude_id: Optional[UUID] = None) -> bool:
        query = db.query(Subject).filter(Subject.semester_id == semester_id, Subject.code == code)
        if exclude_id:
            query = query.filter(Subject.id != exclude_id)
        return query.first() is not None

    def exists_by_name(self, db: Session, semester_id: UUID, name: str, exclude_id: Optional[UUID] = None) -> bool:
        query = db.query(Subject).filter(Subject.semester_id == semester_id, Subject.name == name)
        if exclude_id:
            query = query.filter(Subject.id != exclude_id)
        return query.first() is not None

    def update(self, db: Session, db_obj: Subject, obj_in: SubjectUpdate) -> Subject:
        update_data = obj_in.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_obj, field, value)
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def delete(self, db: Session, id: UUID) -> None:
        db_obj = db.query(Subject).filter(Subject.id == id).first()
        if db_obj:
            db.delete(db_obj)
            db.commit()

subject_repo = SubjectRepository()
