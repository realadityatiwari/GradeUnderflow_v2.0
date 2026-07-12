from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from uuid import UUID

from app.db.session import get_db
from app.dependencies.auth import get_current_user
from app.models.user import User
from app.schemas.evaluation import EvaluationResultResponse
from app.services.evaluation.engine import evaluate_subject

router = APIRouter()

@router.get("/subjects/{subject_id}/evaluation", response_model=EvaluationResultResponse)
def get_subject_evaluation(
    subject_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get the complete academic evaluation for a subject.
    """
    # Note: In a real app we might verify that the subject belongs to the current user
    # or that the user has access to it. For this scope, we evaluate directly.
    return evaluate_subject(db, subject_id)
