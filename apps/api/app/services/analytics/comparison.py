from sqlalchemy.orm import Session
from uuid import UUID
from typing import List, Tuple

from app.models.subject import Subject
from app.models.semester import Semester
from app.schemas.analytics import ComparisonDatasets, ChartDataItem
from app.schemas.prediction import SubjectPredictionResponse
from app.services.evaluation.sgpa import calculate_sgpa

def get_comparison_analytics(db: Session, user_id: UUID, predictions: List[Tuple[Subject, SubjectPredictionResponse]]) -> ComparisonDatasets:
    
    # Subject vs Subject (using overall percentage for comparison)
    subject_vs_subject = []
    for sub, pred in predictions:
        subject_vs_subject.append(ChartDataItem(label=sub.code, value=pred.predicted_eval.final.percentage))
        
    # Internal vs External
    internal_vs_external = []
    for sub, pred in predictions:
        internal_vs_external.append(ChartDataItem(
            label=sub.code, 
            value=pred.current_internal_marks, 
            secondary_value=pred.predicted_eval.external.marks
        ))
        
    # Predicted vs Actual
    predicted_vs_actual = []
    for sub, pred in predictions:
        # Since we are predicting, the 'actual' might just be the current evaluation percentage before predictions.
        # But we'll map predicted percentage to value and actual (current internal scaled) to secondary_value
        actual_scaled = (pred.current_internal_marks / pred.max_internal_marks * 100) if pred.max_internal_marks > 0 else 0
        predicted_vs_actual.append(ChartDataItem(
            label=sub.code,
            value=pred.predicted_eval.final.percentage,
            secondary_value=actual_scaled
        ))
        
    # Highest vs Lowest
    if predictions:
        sorted_preds = sorted(predictions, key=lambda x: x[1].predicted_eval.final.percentage)
        lowest = sorted_preds[0]
        highest = sorted_preds[-1]
        highest_vs_lowest = [
            ChartDataItem(label=highest[0].code, value=highest[1].predicted_eval.final.percentage),
            ChartDataItem(label=lowest[0].code, value=lowest[1].predicted_eval.final.percentage)
        ]
    else:
        highest_vs_lowest = []
        
    # Semester vs Semester
    # Fetch all semesters for the user to compare historical SGPAs
    all_semesters = db.query(Semester).filter(Semester.user_id == user_id).order_by(Semester.created_at).all()
    semester_vs_semester = []
    for sem in all_semesters:
        try:
            sgpa_data = calculate_sgpa(db, sem.id)
            semester_vs_semester.append(ChartDataItem(label=sem.name, value=sgpa_data.semester.sgpa))
        except Exception:
            pass # Skip if no subjects/data
            
    return ComparisonDatasets(
        semester_vs_semester=semester_vs_semester,
        subject_vs_subject=subject_vs_subject,
        internal_vs_external=internal_vs_external,
        predicted_vs_actual=predicted_vs_actual,
        highest_vs_lowest=highest_vs_lowest
    )
