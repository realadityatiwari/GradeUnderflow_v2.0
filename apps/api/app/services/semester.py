from typing import List, Optional
from uuid import UUID

from sqlalchemy.orm import Session
from fastapi import HTTPException

from app.models.semester import Semester
from app.models.enums import SemesterStatus
from app.schemas.semester import SemesterCreate, SemesterUpdate
from app.repositories.semester import semester_repo


class SemesterService:
    def _handle_current_status(self, db: Session, user_id: UUID, new_status: SemesterStatus, exclude_id: Optional[UUID] = None) -> None:
        """
        Ensures only one CURRENT semester exists. 
        If a new semester is set to CURRENT, find the existing CURRENT semester and set it to COMPLETED.
        """
        if new_status == SemesterStatus.CURRENT:
            current_semester = semester_repo.get_current_for_user(db, user_id)
            if current_semester and current_semester.id != exclude_id:
                # Downgrade previous CURRENT to COMPLETED
                update_data = SemesterUpdate(status=SemesterStatus.COMPLETED)
                semester_repo.update(db, current_semester, update_data)

    def _check_duplicate(self, db: Session, user_id: UUID, name: str, academic_year: str, exclude_id: Optional[UUID] = None) -> None:
        """
        Prevents duplicated names within the exact same academic year for a user.
        """
        existing = db.query(Semester).filter(
            Semester.user_id == user_id,
            Semester.name == name,
            Semester.academic_year == academic_year
        ).first()

        if existing and existing.id != exclude_id:
            raise HTTPException(status_code=400, detail="A semester with this name and academic year already exists.")

    def create_semester(self, db: Session, obj_in: SemesterCreate, user_id: UUID) -> Semester:
        self._check_duplicate(db, user_id, obj_in.name, obj_in.academic_year)
        self._handle_current_status(db, user_id, obj_in.status)
        return semester_repo.create(db, obj_in, user_id)

    def get_semester(self, db: Session, id: UUID, user_id: UUID) -> Semester:
        semester = semester_repo.get_by_id(db, id, user_id)
        if not semester:
            raise HTTPException(status_code=404, detail="Semester not found")
        return semester

    def get_all_semesters(self, db: Session, user_id: UUID) -> List[Semester]:
        return semester_repo.get_all_by_user(db, user_id)

    def update_semester(self, db: Session, id: UUID, obj_in: SemesterUpdate, user_id: UUID) -> Semester:
        db_obj = self.get_semester(db, id, user_id)
        
        check_name = obj_in.name if obj_in.name is not None else db_obj.name
        check_year = obj_in.academic_year if obj_in.academic_year is not None else db_obj.academic_year
        
        if obj_in.name is not None or obj_in.academic_year is not None:
            self._check_duplicate(db, user_id, check_name, check_year, exclude_id=id)

        if obj_in.status is not None:
            self._handle_current_status(db, user_id, obj_in.status, exclude_id=id)

        return semester_repo.update(db, db_obj, obj_in)

    def delete_semester(self, db: Session, id: UUID, user_id: UUID) -> None:
        semester = self.get_semester(db, id, user_id)
        semester_repo.delete(db, semester.id)


semester_service = SemesterService()
