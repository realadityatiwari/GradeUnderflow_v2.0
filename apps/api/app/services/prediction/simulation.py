from sqlalchemy.orm import Session
from uuid import UUID

from app.models.subject import Subject
from app.models.assessment import Assessment
from app.models.enums import AssessmentStatus
from app.schemas.prediction import WhatIfRequest
from app.schemas.sgpa import SGPACalculationResponse
from app.services.evaluation.engine import evaluate_subject_from_assessments
from app.services.evaluation.sgpa import calculate_sgpa_from_evaluations
from app.services.prediction.scoring import clone_assessment

def simulate_what_if(db: Session, semester_id: UUID, request: WhatIfRequest) -> SGPACalculationResponse:
    """
    Simulates a semester SGPA without modifying the database.
    Replaces assessment marks in memory based on overrides.
    """
    override_map = {o.assessment_id: o.simulated_marks for o in request.overrides}
    
    subjects = db.query(Subject).filter(
        Subject.semester_id == semester_id,
        Subject.is_active
    ).all()
    
    evaluations_map = {}
    
    for subject in subjects:
        assessments = db.query(Assessment).filter(Assessment.subject_id == subject.id).all()
        cloned_assessments = []
        
        for assessment in assessments:
            cloned = clone_assessment(assessment)
            
            if cloned.id in override_map:
                cloned.result.obtained_marks = override_map[cloned.id]
                cloned.result.status = AssessmentStatus.CHECKED
                
            cloned_assessments.append(cloned)
            
        # Run decoupled evaluation
        evaluations_map[subject.id] = evaluate_subject_from_assessments(cloned_assessments)
        
    # Run decoupled SGPA
    return calculate_sgpa_from_evaluations(subjects, evaluations_map)
