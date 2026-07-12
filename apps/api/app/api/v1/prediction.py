from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from uuid import UUID

from app.db.session import get_db
from app.dependencies.auth import get_current_user
from app.models.user import User
from app.schemas.prediction import (
    SubjectPredictionResponse,
    TargetGradeRequest,
    TargetGradeResponse,
    TargetSGPARequest,
    TargetSGPAResponse,
    WhatIfRequest,
    AcademicHealthResponse
)
from app.schemas.sgpa import SGPACalculationResponse
from app.services.prediction.prediction import get_subject_prediction
from app.services.prediction.target import calculate_required_external, calculate_target_sgpa
from app.services.prediction.simulation import simulate_what_if
from app.services.prediction.health import get_academic_health

router = APIRouter()

@router.get("/subjects/{subject_id}/prediction", response_model=SubjectPredictionResponse)
def get_prediction(
    subject_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """ Get predicted grade and missing assessment forecasts for a subject. """
    return get_subject_prediction(db, subject_id)

@router.post("/subjects/{subject_id}/target", response_model=TargetGradeResponse)
def calculate_target_grade(
    subject_id: UUID,
    request: TargetGradeRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """ Calculate external marks required to hit a specific target grade. """
    return calculate_required_external(db, subject_id, request.target_grade)


@router.post("/semesters/{semester_id}/target-sgpa", response_model=TargetSGPAResponse)
def calculate_target_sgpa_endpoint(
    semester_id: UUID,
    request: TargetSGPARequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """ Calculate required metrics to hit a target SGPA. """
    return calculate_target_sgpa(db, semester_id, request.target_sgpa)


@router.post("/semesters/{semester_id}/simulate", response_model=SGPACalculationResponse)
def simulate_sgpa(
    semester_id: UUID,
    request: WhatIfRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """ Simulates SGPA based on hypothetical overridden marks without touching DB. """
    return simulate_what_if(db, semester_id, request)


@router.get("/semesters/{semester_id}/academic-health", response_model=AcademicHealthResponse)
def get_health(
    semester_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """ Generates Academic Health composite score and improvement opportunities. """
    return get_academic_health(db, semester_id)
