from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from uuid import UUID

from app.db.session import get_db
from app.dependencies.auth import get_current_user
from app.models.user import User
from app.schemas.sgpa import SGPACalculationResponse, CGPACalculationResponse
from app.services.evaluation.sgpa import calculate_sgpa
from app.services.evaluation.cgpa import calculate_cgpa
from fastapi import HTTPException
from app.repositories.semester import semester_repo

router = APIRouter()

def _verify_semester_ownership(db: Session, semester_id: UUID, user_id: UUID):
    semester = semester_repo.get_by_id(db, semester_id, user_id)
    if not semester:
        raise HTTPException(status_code=404, detail="Semester not found or does not belong to user.")

@router.get("/semesters/{semester_id}/sgpa", response_model=SGPACalculationResponse)
def get_semester_sgpa(
    semester_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get the complete SGPA calculation and subject breakdown for a semester.
    """
    _verify_semester_ownership(db, semester_id, current_user.id)
    return calculate_sgpa(db, semester_id)

@router.get("/users/me/cgpa", response_model=CGPACalculationResponse)
def get_user_cgpa(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get the overall CGPA based on all completed semesters for the current user.
    """
    return calculate_cgpa(db, current_user.id)
