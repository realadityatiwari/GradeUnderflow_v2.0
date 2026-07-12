from sqlalchemy.orm import Session
from uuid import UUID

from app.models.assessment import Assessment
from app.models.enums import AssessmentType
from app.schemas.evaluation import EvaluationResultResponse, ExternalEvaluation, FinalEvaluation
from app.services.evaluation.internal import evaluate_internal, calculate_category
from app.services.evaluation.grading import determine_grade

def evaluate_subject_from_assessments(assessments: list[Assessment]) -> EvaluationResultResponse:
    """
    Pure function to evaluate a subject from a list of assessments.
    Does not depend on database queries, suitable for simulation and prediction.
    """
    # 1. Internal Marks
    internal_eval = evaluate_internal(assessments)
    
    # 2. External Marks (End Semester)
    end_sem = calculate_category(assessments, AssessmentType.END_SEMESTER, max_contribution=70.0)
    external_eval = ExternalEvaluation(
        percentage=end_sem.percentage,
        marks=end_sem.contribution
    )
    
    # 3. Final Calculation
    final_marks = internal_eval.total + external_eval.marks
    # Since total max is 100, final_marks is equivalent to percentage
    final_percentage = round(final_marks, 2)
    
    grade, grade_point, passed = determine_grade(final_marks)
    
    final_eval = FinalEvaluation(
        marks=round(final_marks, 2),
        percentage=final_percentage,
        grade=grade,
        grade_point=grade_point,
        passed=passed
    )
    
    return EvaluationResultResponse(
        internal=internal_eval,
        external=external_eval,
        final=final_eval
    )


def evaluate_subject(db: Session, subject_id: UUID) -> EvaluationResultResponse:
    """
    Main evaluation orchestrator for a subject.
    Fetches all assessments and builds the EvaluationResultResponse.
    """
    assessments = db.query(Assessment).filter(Assessment.subject_id == subject_id).all()
    return evaluate_subject_from_assessments(assessments)
