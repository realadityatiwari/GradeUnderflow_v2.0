from sqlalchemy.orm import Session
from uuid import UUID

from app.models.semester import Semester
from app.models.enums import SemesterStatus
from app.services.evaluation.sgpa import calculate_sgpa
from app.schemas.sgpa import CGPACalculationResponse, SemesterCGPASummary

def calculate_cgpa(db: Session, user_id: UUID) -> CGPACalculationResponse:
    """
    Calculates the CGPA for a user based ONLY on completed semesters.
    Reuses SGPA calculation logic which in turn reuses Evaluation Engine.
    """
    # Only completed semesters contribute to CGPA
    completed_semesters = db.query(Semester).filter(
        Semester.user_id == user_id,
        Semester.status == SemesterStatus.COMPLETED
    ).order_by(Semester.start_date.asc()).all()
    
    total_credits = 0
    total_credit_points = 0.0
    
    semester_summaries = []
    
    for semester in completed_semesters:
        sgpa_response = calculate_sgpa(db, semester.id)
        
        sem_credits = sgpa_response.semester.total_credits
        sem_credit_points = sgpa_response.semester.earned_credit_points
        
        total_credits += sem_credits
        total_credit_points += sem_credit_points
        
        semester_summaries.append(
            SemesterCGPASummary(
                id=semester.id,
                name=semester.name,
                academic_year=semester.academic_year,
                sgpa=sgpa_response.semester.sgpa,
                total_credits=sem_credits,
                earned_credit_points=sem_credit_points
            )
        )
        
    cgpa = 0.0
    if total_credits > 0:
        cgpa = round(total_credit_points / total_credits, 2)
        
    return CGPACalculationResponse(
        cgpa=cgpa,
        total_credits=total_credits,
        total_credit_points=round(total_credit_points, 2),
        semesters=semester_summaries
    )
