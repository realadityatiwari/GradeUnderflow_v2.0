from typing import List
from uuid import UUID

from sqlalchemy.orm import Session
from fastapi import HTTPException

from app.models.subject import Subject
from app.schemas.subject import SubjectCreate, SubjectUpdate
from app.repositories.subject import subject_repo
from app.repositories.semester import semester_repo


class SubjectService:
    def _verify_semester_ownership(self, db: Session, semester_id: UUID, user_id: UUID) -> None:
        semester = semester_repo.get_by_id(db, semester_id, user_id)
        if not semester:
            raise HTTPException(status_code=404, detail="Semester not found or does not belong to user.")

    def _check_duplicates(self, db: Session, semester_id: UUID, code: str, name: str, exclude_id: UUID = None) -> None:
        if subject_repo.exists_by_code(db, semester_id, code, exclude_id):
            raise HTTPException(status_code=400, detail="A subject with this code already exists in this semester.")
        if subject_repo.exists_by_name(db, semester_id, name, exclude_id):
            raise HTTPException(status_code=400, detail="A subject with this name already exists in this semester.")

    def create_subject(self, db: Session, obj_in: SubjectCreate, semester_id: UUID, user_id: UUID) -> Subject:
        self._verify_semester_ownership(db, semester_id, user_id)
        self._check_duplicates(db, semester_id, obj_in.code, obj_in.name)
        return subject_repo.create(db, obj_in, semester_id)

    def get_subject(self, db: Session, id: UUID, user_id: UUID) -> Subject:
        subject = subject_repo.get_by_id(db, id)
        if not subject:
            raise HTTPException(status_code=404, detail="Subject not found")
        # Verify ownership via semester
        self._verify_semester_ownership(db, subject.semester_id, user_id)
        return subject

    def get_all_subjects(self, db: Session, semester_id: UUID, user_id: UUID) -> List[Subject]:
        self._verify_semester_ownership(db, semester_id, user_id)
        return subject_repo.get_all_by_semester(db, semester_id)

    def update_subject(self, db: Session, id: UUID, obj_in: SubjectUpdate, user_id: UUID) -> Subject:
        db_obj = self.get_subject(db, id, user_id)
        
        check_code = obj_in.code if obj_in.code is not None else db_obj.code
        check_name = obj_in.name if obj_in.name is not None else db_obj.name
        
        if obj_in.code is not None or obj_in.name is not None:
            self._check_duplicates(db, db_obj.semester_id, check_code, check_name, exclude_id=id)

        return subject_repo.update(db, db_obj, obj_in)

    def delete_subject(self, db: Session, id: UUID, user_id: UUID) -> None:
        subject = self.get_subject(db, id, user_id)
        subject_repo.delete(db, subject.id)


subject_service = SubjectService()
