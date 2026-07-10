from typing import List
from uuid import UUID

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.dependencies.auth import get_current_user
from app.models.user import User
from app.schemas.semester import SemesterCreate, SemesterUpdate, SemesterResponse
from app.services.semester import semester_service

router = APIRouter()

@router.get("/", response_model=List[SemesterResponse])
def get_semesters(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Retrieve all semesters for the currently authenticated user.
    """
    return semester_service.get_all_semesters(db, current_user.id)


@router.post("/", response_model=SemesterResponse, status_code=status.HTTP_201_CREATED)
def create_semester(
    semester_in: SemesterCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Create a new semester.
    """
    return semester_service.create_semester(db, semester_in, current_user.id)


@router.get("/{id}", response_model=SemesterResponse)
def get_semester(
    id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get a specific semester by id.
    """
    return semester_service.get_semester(db, id, current_user.id)


@router.put("/{id}", response_model=SemesterResponse)
def update_semester(
    id: UUID,
    semester_in: SemesterUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Update a semester.
    """
    return semester_service.update_semester(db, id, semester_in, current_user.id)


@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_semester(
    id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Delete a semester.
    """
    semester_service.delete_semester(db, id, current_user.id)
    return None
