from sqlalchemy.orm import Session
from app.models.assessment import Assessment, AssessmentResult
from app.models.enums import AssessmentStatus
from app.schemas.prediction import PredictionSource, PredictionConfidence

DEFAULT_PREDICTION_PERCENTAGE = 0.70

def get_prediction_for_assessment(db: Session, assessment: Assessment, subject_assessments: list[Assessment]) -> tuple[float, PredictionSource]:
    """
    Returns the predicted marks for a missing assessment.
    Hierarchy:
    1. Subject Average
    2. Semester Average (Simplified to default if missing for now, as semester avg requires querying across subjects)
    3. Default (70%)
    """
    # 1. Subject Average
    completed_assessments = [a for a in subject_assessments if a.result and a.result.status in [AssessmentStatus.SUBMITTED, AssessmentStatus.CHECKED] and a.result.obtained_marks is not None]
    
    if completed_assessments:
        total_obtained = sum(a.result.obtained_marks for a in completed_assessments)
        total_max = sum(a.max_marks for a in completed_assessments)
        if total_max > 0:
            subject_avg_percentage = total_obtained / total_max
            return round(subject_avg_percentage * assessment.max_marks, 2), PredictionSource.SUBJECT_AVERAGE # type: ignore
            
    # Fallback to default
    return round(DEFAULT_PREDICTION_PERCENTAGE * assessment.max_marks, 2), PredictionSource.DEFAULT # type: ignore


def calculate_prediction_confidence(total_assessments: int, completed_assessments: int) -> tuple[float, PredictionConfidence]:
    """
    Returns confidence score 0.0 - 1.0 and Confidence Enum based on completion ratio.
    """
    if total_assessments == 0:
        return 0.0, PredictionConfidence.LOW
        
    ratio = completed_assessments / total_assessments
    
    if ratio < 0.33:
        confidence = PredictionConfidence.LOW
    elif ratio < 0.66:
        confidence = PredictionConfidence.MEDIUM
    else:
        confidence = PredictionConfidence.HIGH
        
    return round(ratio, 2), confidence

def clone_assessment(assessment: Assessment) -> Assessment:
    """ Creates an in-memory clone of an assessment to prevent DB modification during simulation. """
    cloned = Assessment(
        id=assessment.id, # type: ignore
        subject_id=assessment.subject_id, # type: ignore
        assessment_type=assessment.assessment_type, # type: ignore
        assessment_category=assessment.assessment_category, # type: ignore
        title=assessment.title, # type: ignore
        max_marks=assessment.max_marks, # type: ignore
        weightage=assessment.weightage, # type: ignore
        is_required=assessment.is_required # type: ignore
    )
    
    if assessment.result:
        cloned.result = AssessmentResult(
            assessment_id=cloned.id, # type: ignore
            status=assessment.result.status, # type: ignore
            obtained_marks=assessment.result.obtained_marks # type: ignore
        )
    else:
        cloned.result = AssessmentResult(
            assessment_id=cloned.id, # type: ignore
            status=AssessmentStatus.NOT_STARTED, # type: ignore
            obtained_marks=None # type: ignore
        )
        
    return cloned
