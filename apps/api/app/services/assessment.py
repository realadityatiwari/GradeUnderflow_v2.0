from typing import List
from uuid import UUID

from sqlalchemy.orm import Session
from fastapi import HTTPException

from app.models.assessment import Assessment, AssessmentResult
from app.models.enums import AssessmentType
from app.schemas.assessment import AssessmentCreate, AssessmentUpdate, AssessmentResultUpdate
from app.repositories.assessment import assessment_repo
from app.repositories.subject import subject_repo


class AssessmentService:
    def _verify_subject_ownership(self, db: Session, subject_id: UUID, user_id: UUID) -> None:
        # Traverse Subject -> Semester -> User
        subject = subject_repo.get_by_id(db, subject_id)
        if not subject or subject.semester.user_id != user_id:
            raise HTTPException(status_code=404, detail="Subject not found or does not belong to user.")

    def _verify_assessment_ownership(self, db: Session, assessment_id: UUID, user_id: UUID) -> Assessment:
        assessment = assessment_repo.get_by_id(db, assessment_id)
        if not assessment:
            raise HTTPException(status_code=404, detail="Assessment not found")
        self._verify_subject_ownership(db, assessment.subject_id, user_id) # type: ignore
        return assessment

    def _check_exam_singularity(self, db: Session, subject_id: UUID, assessment_type: AssessmentType) -> None:
        if assessment_type in (AssessmentType.PRE_END, AssessmentType.END_SEMESTER):
            if assessment_repo.exists_by_type(db, subject_id, assessment_type):
                raise HTTPException(
                    status_code=400, 
                    detail=f"Only one {assessment_type.value} is permitted per subject."
                )

    def create_assessment(self, db: Session, obj_in: AssessmentCreate, subject_id: UUID, user_id: UUID) -> Assessment:
        self._verify_subject_ownership(db, subject_id, user_id)
        self._check_exam_singularity(db, subject_id, obj_in.assessment_type)
        return assessment_repo.create(db, obj_in, subject_id)

    def get_assessment(self, db: Session, id: UUID, user_id: UUID) -> Assessment:
        return self._verify_assessment_ownership(db, id, user_id)

    def get_all_assessments(self, db: Session, subject_id: UUID, user_id: UUID) -> List[Assessment]:
        self._verify_subject_ownership(db, subject_id, user_id)
        return assessment_repo.get_all_by_subject(db, subject_id)

    def update_assessment(self, db: Session, id: UUID, obj_in: AssessmentUpdate, user_id: UUID) -> Assessment:
        assessment = self._verify_assessment_ownership(db, id, user_id)
        return assessment_repo.update(db, assessment, obj_in)

    def update_assessment_result(self, db: Session, id: UUID, obj_in: AssessmentResultUpdate, user_id: UUID) -> AssessmentResult:
        assessment = self._verify_assessment_ownership(db, id, user_id)
        
        # Marks validation
        if obj_in.obtained_marks is not None:
            if obj_in.obtained_marks > assessment.max_marks:
                raise HTTPException(
                    status_code=400,
                    detail=f"Obtained marks ({obj_in.obtained_marks}) cannot exceed maximum marks ({assessment.max_marks})."
                )
            if obj_in.obtained_marks < 0:
                raise HTTPException(
                    status_code=400,
                    detail="Obtained marks cannot be negative."
                )
                
        return assessment_repo.update_result(db, assessment.result, obj_in)

    def delete_assessment(self, db: Session, id: UUID, user_id: UUID) -> None:
        assessment = self._verify_assessment_ownership(db, id, user_id)
        assessment_repo.delete(db, assessment.id)


assessment_service = AssessmentService()
