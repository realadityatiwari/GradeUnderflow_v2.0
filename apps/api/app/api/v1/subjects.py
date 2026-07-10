from typing import List
from uuid import UUID

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.dependencies.auth import get_current_user
from app.models.user import User
from app.schemas.subject import SubjectCreate, SubjectUpdate, SubjectResponse
from app.services.subject import subject_service

router = APIRouter()

@router.get("/semesters/{semester_id}/subjects", response_model=List[SubjectResponse])
def get_subjects_for_semester(
    semester_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Retrieve all subjects for a given semester.
    """
    return subject_service.get_all_subjects(db, semester_id, current_user.id)


@router.post("/semesters/{semester_id}/subjects", response_model=SubjectResponse, status_code=status.HTTP_201_CREATED)
def create_subject(
    semester_id: UUID,
    subject_in: SubjectCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Create a new subject for a semester.
    """
    return subject_service.create_subject(db, subject_in, semester_id, current_user.id)


@router.get("/subjects/{id}", response_model=SubjectResponse)
def get_subject(
    id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get a specific subject by id.
    """
    return subject_service.get_subject(db, id, current_user.id)


@router.put("/subjects/{id}", response_model=SubjectResponse)
def update_subject(
    id: UUID,
    subject_in: SubjectUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Update a subject.
    """
    return subject_service.update_subject(db, id, subject_in, current_user.id)


@router.delete("/subjects/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_subject(
    id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Delete a subject.
    """
    subject_service.delete_subject(db, id, current_user.id)
    return None
