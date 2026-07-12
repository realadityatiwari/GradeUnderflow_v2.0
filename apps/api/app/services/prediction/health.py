from sqlalchemy.orm import Session
from uuid import UUID

from app.models.subject import Subject
from app.models.assessment import Assessment
from app.models.enums import AssessmentType, AssessmentStatus
from app.services.prediction.prediction import get_subject_prediction
from app.services.evaluation.sgpa import calculate_sgpa
from app.schemas.prediction import AcademicHealthResponse, HealthStatus, HealthScoreBreakdown, ImprovementOpportunity

def get_academic_health(db: Session, semester_id: UUID) -> AcademicHealthResponse:
    subjects = db.query(Subject).filter(
        Subject.semester_id == semester_id,
        Subject.is_active
    ).all()
    
    if not subjects:
        return AcademicHealthResponse(
            semester_id=semester_id,
            health_score=0.0,
            health_status=HealthStatus.CRITICAL,
            breakdown=HealthScoreBreakdown(
                assessment_completion=0, assignment_completion=0, current_internal=0,
                predicted_sgpa=0, failed_subjects=0, missing_mandatory=0
            ),
            weakest_subject=None,
            strongest_subject=None,
            improvement_opportunities=[]
        )

    total_assessments = 0
    completed_assessments = 0
    total_assignments = 0
    completed_assignments = 0
    total_internal = 0.0
    max_internal = 0.0
    failed_subjects_count = 0
    missing_mandatory = 0
    
    subject_predictions = []
    
    for subject in subjects:
        pred = get_subject_prediction(db, subject.id)
        subject_predictions.append((subject, pred))
        
        # Check failed
        if not pred.predicted_eval.final.passed:
            failed_subjects_count += 1
            
        total_internal += pred.current_internal_marks
        max_internal += pred.max_internal_marks
        
        assessments = db.query(Assessment).filter(Assessment.subject_id == subject.id).all()
        for a in assessments:
            total_assessments += 1
            is_completed = a.result and a.result.status in [AssessmentStatus.SUBMITTED, AssessmentStatus.CHECKED]
            if is_completed:
                completed_assessments += 1
            elif a.is_required:
                missing_mandatory += 1
                
            if a.assessment_type == AssessmentType.ASSIGNMENT:
                total_assignments += 1
                if is_completed:
                    completed_assignments += 1

    sgpa_res = calculate_sgpa(db, semester_id)
    predicted_sgpa = sgpa_res.semester.sgpa # Assuming we use current SGPA. Ideally we use fully predicted SGPA.

    # 1. Assessment Completion (20)
    score_assess = 20.0 * (completed_assessments / total_assessments) if total_assessments > 0 else 20.0
    
    # 2. Assignment Completion (10)
    score_assign = 10.0 * (completed_assignments / total_assignments) if total_assignments > 0 else 10.0
    
    # 3. Current Internal Marks (20)
    score_internal = 20.0 * (total_internal / max_internal) if max_internal > 0 else 20.0
    
    # 4. Predicted SGPA (25) (10.0 scale)
    score_sgpa = 25.0 * (predicted_sgpa / 10.0)
    
    # 5. Failed Subjects (15) (lose 5 points per failed subject)
    score_failed = max(0.0, 15.0 - (failed_subjects_count * 5.0))
    
    # 6. Missing Mandatory (10) (lose 2 points per missing)
    score_missing = max(0.0, 10.0 - (missing_mandatory * 2.0))
    
    total_score = round(score_assess + score_assign + score_internal + score_sgpa + score_failed + score_missing, 1)
    
    # Status
    if total_score >= 85:
        status = HealthStatus.EXCELLENT
    elif total_score >= 70:
        status = HealthStatus.GOOD
    elif total_score >= 50:
        status = HealthStatus.AVERAGE
    elif total_score >= 35:
        status = HealthStatus.NEEDS_ATTENTION
    else:
        status = HealthStatus.CRITICAL
    
    # Weakest/Strongest
    sorted_subjects = sorted(subject_predictions, key=lambda x: x[1].predicted_eval.final.percentage)
    weakest = sorted_subjects[0][0].name if sorted_subjects else None
    strongest = sorted_subjects[-1][0].name if sorted_subjects else None
    
    # Improvement Opportunities (Simplified: where can we gain most points? Just list missing end_semesters or big internal gaps)
    opportunities = []
    for sub, pred in subject_predictions:
        for p_assess in pred.predicted_assessments:
            potential_gain = p_assess.max_marks - p_assess.predicted_marks
            if potential_gain > 5: # Threshold
                opportunities.append(ImprovementOpportunity(
                    subject_id=sub.id,
                    subject_code=sub.code,
                    subject_name=sub.name,
                    assessment_id=p_assess.assessment_id,
                    assessment_title=p_assess.title,
                    current_marks=0.0, # Since it's predicted missing
                    max_marks=p_assess.max_marks,
                    potential_gpa_gain=round(potential_gain, 2)
                ))
    
    # Sort by highest gain
    opportunities.sort(key=lambda x: x.potential_gpa_gain, reverse=True)
    
    return AcademicHealthResponse(
        semester_id=semester_id,
        health_score=total_score,
        health_status=status,
        breakdown=HealthScoreBreakdown(
            assessment_completion=round(score_assess, 1),
            assignment_completion=round(score_assign, 1),
            current_internal=round(score_internal, 1),
            predicted_sgpa=round(score_sgpa, 1),
            failed_subjects=round(score_failed, 1),
            missing_mandatory=round(score_missing, 1)
        ),
        weakest_subject=weakest,
        strongest_subject=strongest,
        improvement_opportunities=opportunities[:5] # Top 5
    )
