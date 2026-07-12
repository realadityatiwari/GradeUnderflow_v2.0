from sqlalchemy.orm import Session
from uuid import UUID

from app.models.subject import Subject
from app.services.evaluation.engine import evaluate_subject
from app.schemas.sgpa import SGPACalculationResponse, SemesterSGPASummary, SubjectSGPASummary

def calculate_sgpa_from_evaluations(subjects: list[Subject], evaluations_map: dict[UUID, any]) -> SGPACalculationResponse:
    """
    Pure function to calculate SGPA from a list of subjects and their corresponding evaluations.
    evaluations_map is a dictionary mapping subject_id to EvaluationResultResponse.
    Does not perform any DB queries.
    """
    total_credits = 0
    total_earned_credit_points = 0.0
    
    subject_summaries = []
    
    for subject in subjects:
        if subject.id not in evaluations_map:
            continue
            
        eval_result = evaluations_map[subject.id]
        
        grade = eval_result.final.grade
        grade_point = eval_result.final.grade_point
        credits = subject.credits
        
        # Credit points = credits * grade point
        credit_points = float(credits * grade_point)
        
        total_credits += credits
        total_earned_credit_points += credit_points
        
        subject_summaries.append(
            SubjectSGPASummary(
                id=subject.id,
                code=subject.code,
                name=subject.name,
                credits=credits,
                grade=grade,
                grade_point=grade_point,
                credit_points=credit_points
            )
        )
    
    # Calculate SGPA
    sgpa = 0.0
    if total_credits > 0:
        sgpa = round(total_earned_credit_points / total_credits, 2)
        
    return SGPACalculationResponse(
        semester=SemesterSGPASummary(
            sgpa=sgpa,
            total_credits=total_credits,
            earned_credit_points=round(total_earned_credit_points, 2)
        ),
        subjects=subject_summaries
    )


def calculate_sgpa(db: Session, semester_id: UUID) -> SGPACalculationResponse:
    """
    Calculates the SGPA for a given semester using the Evaluation Engine.
    Does not recalculate raw marks. Relies on the Grade Point from evaluate_subject.
    """
    subjects = db.query(Subject).filter(
        Subject.semester_id == semester_id,
        Subject.is_active
    ).all()
    
    evaluations_map = {}
    for subject in subjects:
        evaluations_map[subject.id] = evaluate_subject(db, subject.id)
        
    return calculate_sgpa_from_evaluations(subjects, evaluations_map)
