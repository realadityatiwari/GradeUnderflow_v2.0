from sqlalchemy.orm import Session
from uuid import UUID

from app.models.assessment import Assessment
from app.models.enums import AssessmentStatus, AssessmentType
from app.services.evaluation.engine import evaluate_subject_from_assessments
from app.schemas.prediction import SubjectPredictionResponse, PredictedAssessment
from app.services.prediction.scoring import get_prediction_for_assessment, calculate_prediction_confidence, clone_assessment

def get_subject_prediction(db: Session, subject_id: UUID) -> SubjectPredictionResponse:
    """
    Predicts the final grade/SGPA impact for a subject by forecasting missing assessments.
    """
    assessments = db.query(Assessment).filter(Assessment.subject_id == subject_id).all()
    
    total_assessments = len(assessments)
    completed_assessments = 0
    missing_assessments_count = 0
    
    current_internal_marks = 0.0
    max_internal_marks = 0.0
    
    predicted_assessment_list = []
    cloned_assessments = []
    
    for assessment in assessments:
        cloned = clone_assessment(assessment)
        cloned_assessments.append(cloned)
        
        is_completed = cloned.result and cloned.result.status in [AssessmentStatus.SUBMITTED, AssessmentStatus.CHECKED] and cloned.result.obtained_marks is not None
        
        if is_completed:
            completed_assessments += 1
            if cloned.assessment_type != AssessmentType.END_SEMESTER:
                current_internal_marks += cloned.result.obtained_marks
                max_internal_marks += cloned.max_marks
        else:
            missing_assessments_count += 1
            predicted_marks, source = get_prediction_for_assessment(db, cloned, assessments)
            
            # Predict the missing marks in-memory
            cloned.result.obtained_marks = predicted_marks
            cloned.result.status = AssessmentStatus.CHECKED
            
            predicted_assessment_list.append(PredictedAssessment(
                assessment_id=cloned.id,
                title=cloned.title,
                predicted_marks=predicted_marks,
                max_marks=cloned.max_marks,
                source=source
            ))

    # Calculate Confidence
    confidence_score, confidence = calculate_prediction_confidence(total_assessments, completed_assessments)
    
    # Run decoupled evaluation engine
    predicted_eval = evaluate_subject_from_assessments(cloned_assessments)
    
    completion_percentage = 0.0
    if total_assessments > 0:
        completion_percentage = round((completed_assessments / total_assessments) * 100, 2)
        
    return SubjectPredictionResponse(
        subject_id=subject_id,
        current_internal_marks=round(current_internal_marks, 2),
        max_internal_marks=max_internal_marks,
        predicted_eval=predicted_eval,
        predicted_assessments=predicted_assessment_list,
        confidence=confidence,
        confidence_score=confidence_score,
        completion_percentage=completion_percentage,
        missing_assessments=missing_assessments_count
    )
