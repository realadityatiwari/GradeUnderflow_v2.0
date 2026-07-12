from sqlalchemy.orm import Session
from uuid import UUID

from app.schemas.analytics import SemesterAnalyticsData
from app.services.evaluation.sgpa import calculate_sgpa
from app.services.evaluation.cgpa import calculate_cgpa
from app.schemas.prediction import SubjectPredictionResponse
from app.models.subject import Subject
from typing import List, Tuple

def get_semester_analytics(
    db: Session, 
    user_id: UUID, 
    semester_id: UUID, 
    predictions: List[Tuple[Subject, SubjectPredictionResponse]]
) -> SemesterAnalyticsData:
    
    sgpa_data = calculate_sgpa(db, semester_id)
    cgpa_data = calculate_cgpa(db, user_id)
    
    passed_subjects = 0
    failed_subjects = 0
    credits_earned = 0.0
    total_credits = 0.0
    
    for sub, pred in predictions:
        total_credits += sub.credits
        if pred.predicted_eval.final.grade != "F":
            passed_subjects += 1
            credits_earned += sub.credits
        else:
            failed_subjects += 1
            
    # Assuming predictions contain SGPA implicitly if we recompute, but we just use sgpa_data for current.
    # We will use our standard 9.0 target or use prediction engine if available. 
    # For now, we use a simple projection based on predicted subject grades.
    pred_gp_sum = sum(p.predicted_eval.final.grade_point * s.credits for s, p in predictions)
    predicted_sgpa = pred_gp_sum / total_credits if total_credits > 0 else 0.0
    
    # Calculate Completion (Assessments completed / total assessments)
    int_earned = sum(p.current_internal_marks for _, p in predictions)
    int_total = sum(p.max_internal_marks for _, p in predictions)
    completion = (int_earned / int_total * 100) if int_total > 0 else 0.0
    
    return SemesterAnalyticsData(
        current_sgpa=sgpa_data.semester.sgpa,
        predicted_sgpa=predicted_sgpa,
        cgpa=cgpa_data.cgpa,
        credits_earned=credits_earned,
        credits_remaining=total_credits - credits_earned,
        completion_percentage=completion,
        passed_subjects=passed_subjects,
        failed_subjects=failed_subjects
    )
