from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from uuid import UUID

from app.db.session import get_db
from app.dependencies.auth import get_current_user
from app.models.user import User
from app.models.subject import Subject
from app.schemas.evaluation import EvaluationResultResponse
from app.services.evaluation.engine import evaluate_subject
from fastapi import HTTPException
from app.repositories.subject import subject_repo
from app.repositories.semester import semester_repo

router = APIRouter()

def _verify_subject_ownership(db: Session, subject_id: UUID, user_id: UUID) -> Subject:
    subject = subject_repo.get_by_id(db, subject_id)
    if not subject:
        raise HTTPException(status_code=404, detail="Subject not found")
    semester = semester_repo.get_by_id(db, subject.semester_id, user_id)
    if not semester:
        raise HTTPException(status_code=404, detail="Subject not found or does not belong to user.")
    return subject

@router.get("/subjects/{subject_id}/evaluation", response_model=EvaluationResultResponse)
def get_subject_evaluation(
    subject_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get the complete academic evaluation for a subject.
    """
    _verify_subject_ownership(db, subject_id, current_user.id)
    return evaluate_subject(db, subject_id)
