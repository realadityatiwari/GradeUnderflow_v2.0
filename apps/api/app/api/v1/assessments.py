from typing import List
from uuid import UUID

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.dependencies.auth import get_current_user
from app.models.user import User
from app.schemas.assessment import (
    AssessmentCreate, 
    AssessmentUpdate, 
    AssessmentResponse,
    AssessmentResultUpdate,
    AssessmentResultResponse
)
from app.services.assessment import assessment_service

router = APIRouter()

@router.get("/subjects/{subject_id}/assessments", response_model=List[AssessmentResponse])
def get_assessments_for_subject(
    subject_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Retrieve all assessments for a given subject.
    """
    return assessment_service.get_all_assessments(db, subject_id, current_user.id)


@router.post("/subjects/{subject_id}/assessments", response_model=AssessmentResponse, status_code=status.HTTP_201_CREATED)
def create_assessment(
    subject_id: UUID,
    assessment_in: AssessmentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Create a new assessment for a subject.
    """
    return assessment_service.create_assessment(db, assessment_in, subject_id, current_user.id)


@router.get("/assessments/{id}", response_model=AssessmentResponse)
def get_assessment(
    id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get a specific assessment by id.
    """
    return assessment_service.get_assessment(db, id, current_user.id)


@router.put("/assessments/{id}", response_model=AssessmentResponse)
def update_assessment(
    id: UUID,
    assessment_in: AssessmentUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Update an assessment definition.
    """
    return assessment_service.update_assessment(db, id, assessment_in, current_user.id)


@router.put("/assessments/{id}/result", response_model=AssessmentResultResponse)
def update_assessment_result(
    id: UUID,
    result_in: AssessmentResultUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Update an assessment result.
    """
    return assessment_service.update_assessment_result(db, id, result_in, current_user.id)


@router.delete("/assessments/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_assessment(
    id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Delete an assessment and its result.
    """
    assessment_service.delete_assessment(db, id, current_user.id)
    return None
