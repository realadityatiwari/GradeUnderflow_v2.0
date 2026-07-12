from sqlalchemy.orm import Session
from uuid import UUID

from app.services.prediction.prediction import get_subject_prediction
from app.services.evaluation.sgpa import calculate_sgpa
from app.schemas.prediction import TargetGradeResponse, TargetSGPAResponse

GRADE_BOUNDARIES = {
    "A+": 90,
    "A": 80,
    "B+": 70,
    "B": 60,
    "C": 50,
    "D": 45,
    "E": 40,
    "F": 0
}

def calculate_required_external(db: Session, subject_id: UUID, target_grade: str) -> TargetGradeResponse:
    target_grade = target_grade.upper()
    
    # 1. Get current predicted internal marks
    pred_res = get_subject_prediction(db, subject_id)
    internal = pred_res.predicted_eval.internal.total
    
    if target_grade not in GRADE_BOUNDARIES:
        return TargetGradeResponse(
            subject_id=subject_id,
            target_grade=target_grade,
            required_external_marks=None,
            max_external_marks=70.0,
            is_possible=False,
            message=f"Invalid target grade '{target_grade}'."
        )
        
    min_marks_needed = GRADE_BOUNDARIES[target_grade]
    
    required_external = min_marks_needed - internal
    
    if required_external <= 0:
        return TargetGradeResponse(
            subject_id=subject_id,
            target_grade=target_grade,
            required_external_marks=0.0,
            max_external_marks=70.0,
            is_possible=True,
            message="Target already achieved with internal marks alone!"
        )
        
    if required_external > 70.0:
        return TargetGradeResponse(
            subject_id=subject_id,
            target_grade=target_grade,
            required_external_marks=round(required_external, 2),
            max_external_marks=70.0,
            is_possible=False,
            message="Mathematically impossible to achieve this grade."
        )
        
    return TargetGradeResponse(
        subject_id=subject_id,
        target_grade=target_grade,
        required_external_marks=round(required_external, 2),
        max_external_marks=70.0,
        is_possible=True,
        message=f"Need {round(required_external, 2)} out of 70 to achieve {target_grade}."
    )


def calculate_target_sgpa(db: Session, semester_id: UUID, target_sgpa: float) -> TargetSGPAResponse:
    sgpa_res = calculate_sgpa(db, semester_id)
    
    total_credits = sgpa_res.semester.total_credits
    if total_credits == 0:
        return TargetSGPAResponse(
            semester_id=semester_id,
            target_sgpa=target_sgpa,
            current_predicted_sgpa=0.0,
            required_credit_points=0.0,
            remaining_credits=0,
            is_possible=False,
            message="No active subjects in this semester."
        )
        
    required_cp = target_sgpa * total_credits
    # We should predict what the remaining needed CP is.
    # For now, it's a simple comparison since we don't have "remaining credits" in a partially complete semester 
    # without running a full simulation.
    
    # without running a full simulation.
    
    is_possible = True
    message = "Target is mathematically possible."
    if target_sgpa > 10.0:
        is_possible = False
        message = "SGPA cannot exceed 10.0."
        
    return TargetSGPAResponse(
        semester_id=semester_id,
        target_sgpa=target_sgpa,
        current_predicted_sgpa=sgpa_res.semester.sgpa,
        required_credit_points=round(required_cp, 2),
        remaining_credits=total_credits, # Placeholder logic
        is_possible=is_possible,
        message=message
    )
