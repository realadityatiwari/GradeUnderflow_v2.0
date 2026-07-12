from sqlalchemy.orm import Session
from uuid import UUID
from typing import List, Tuple

from app.models.subject import Subject
from app.schemas.analytics import SubjectAnalyticsData
from app.services.prediction.prediction import get_subject_prediction
from app.schemas.prediction import SubjectPredictionResponse

def get_subject_analytics(db: Session, semester_id: UUID, subjects: List[Subject]) -> SubjectAnalyticsData:
    if not subjects:
        return SubjectAnalyticsData(
            highest_performing_subject=None,
            lowest_performing_subject=None,
            average_percentage=0.0,
            average_grade="N/A",
            average_grade_point=0.0,
            internal_marks_earned=0.0,
            internal_marks_total=0.0,
            external_marks_earned=0.0,
            external_marks_total=0.0,
            completion_percentage=0.0,
            total_credits=0
        )
        
    predictions: List[Tuple[Subject, SubjectPredictionResponse]] = []
    for sub in subjects:
        pred = get_subject_prediction(db, sub.id)
        predictions.append((sub, pred))
        
    predictions.sort(key=lambda x: x[1].predicted_eval.final.percentage, reverse=True)
    
    highest = predictions[0][0].code if predictions else None
    lowest = predictions[-1][0].code if predictions else None
    
    total_percentage = sum(p.predicted_eval.final.percentage for _, p in predictions)
    total_gp = sum(p.predicted_eval.final.grade_point for _, p in predictions)
    
    int_earned = sum(p.current_internal_marks for _, p in predictions)
    int_total = sum(p.max_internal_marks for _, p in predictions)
    
    ext_earned = sum(p.predicted_eval.external.marks for _, p in predictions)
    ext_total = sum(50 for _, p in predictions)
    
    credits = sum(s.credits for s in subjects)
    
    # Calculate Completion (Assessments completed / total assessments)
    # Using prediction internals which has assessment results implicitly, but we can do a rough estimate based on marks earned / marks total if we don't scan assessments again.
    # To keep it performant, we'll approximate completion based on internal marks evaluated vs total.
    completion = (int_earned / int_total * 100) if int_total > 0 else 0.0
    
    count = len(predictions)
    avg_percentage = total_percentage / count if count > 0 else 0.0
    avg_gp = total_gp / count if count > 0 else 0.0
    
    # Very rough average grade mapping
    avg_grade = "N/A"
    if avg_gp >= 10:
        avg_grade = "O"
    elif avg_gp >= 9:
        avg_grade = "A+"
    elif avg_gp >= 8:
        avg_grade = "A"
    elif avg_gp >= 7:
        avg_grade = "B+"
    elif avg_gp >= 6:
        avg_grade = "B"
    elif avg_gp >= 5:
        avg_grade = "C"
    elif avg_gp >= 4:
        avg_grade = "P"
    else:
        avg_grade = "F"
    
    return SubjectAnalyticsData(
        highest_performing_subject=highest,
        lowest_performing_subject=lowest,
        average_percentage=avg_percentage,
        average_grade=avg_grade,
        average_grade_point=avg_gp,
        internal_marks_earned=int_earned,
        internal_marks_total=int_total,
        external_marks_earned=ext_earned,
        external_marks_total=ext_total,
        completion_percentage=completion,
        total_credits=credits
    )
