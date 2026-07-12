from sqlalchemy.orm import Session
from uuid import UUID

from app.models.semester import Semester
from app.models.subject import Subject
from app.models.assessment import Assessment, AssessmentResult
from app.models.enums import SemesterStatus, AssessmentStatus, AssessmentType
from app.schemas.dashboard import (
    DashboardResponse,
    DashboardHeader,
    OverviewData,
    PredictionData,
    SGPAData,
    HealthData,
    SemesterProgressData,
    SubjectSummary,
    ActionItem,
    StructuredInsight,
    ChartsData,
    PriorityEnum,
    InsightType
)
from app.services.evaluation.sgpa import calculate_sgpa
from app.services.evaluation.cgpa import calculate_cgpa
from app.services.prediction.health import get_academic_health
from app.services.prediction.prediction import get_subject_prediction

def get_dashboard_summary(db: Session, user_id: UUID) -> DashboardResponse:
    # 1. Get Current Semester
    current_semester = db.query(Semester).filter(
        Semester.user_id == user_id,
        Semester.status == SemesterStatus.CURRENT
    ).first()
    
    # If no current semester, try to find ANY semester just to show something
    if not current_semester:
        current_semester = db.query(Semester).filter(Semester.user_id == user_id).order_by(Semester.created_at.desc()).first()
        
    if not current_semester:
        return DashboardResponse(
            setup_required=True,
            next_step="Create your first semester."
        )
        
    # Check subjects
    subjects = db.query(Subject).filter(Subject.semester_id == current_semester.id).all()
    if not subjects:
        return DashboardResponse(
            setup_required=True,
            next_step="Add subjects to your semester to see intelligence data."
        )

    # 2. Compute Core Metrics
    cgpa_data = calculate_cgpa(db, user_id)
    sgpa_data = calculate_sgpa(db, current_semester.id)
    health_data_api = get_academic_health(db, current_semester.id)
    
    # 3. Gather Subject Predictions
    subject_predictions = []
    for sub in subjects:
        pred = get_subject_prediction(db, sub.id)
        subject_predictions.append((sub, pred))
        
    # 4. Action Center (Tasks)
    assessments = db.query(Assessment).join(Subject).filter(Subject.semester_id == current_semester.id).all()
    
    action_center = []
    total_assignments = 0
    completed_assignments = 0
    total_assessments = len(assessments)
    completed_assessments = 0
    
    for assessment in assessments:
        result = db.query(AssessmentResult).filter(AssessmentResult.assessment_id == assessment.id).first()
        status = result.status if result else AssessmentStatus.NOT_STARTED
        
        if assessment.assessment_type == AssessmentType.ASSIGNMENT:
            total_assignments += 1
            if status == AssessmentStatus.CHECKED or status == AssessmentStatus.SUBMITTED:
                completed_assignments += 1
                
        if status == AssessmentStatus.CHECKED or status == AssessmentStatus.SUBMITTED:
            completed_assessments += 1
        elif status == AssessmentStatus.NOT_STARTED or status == AssessmentStatus.IN_PROGRESS:
            # Create Action Item
            if assessment.assessment_type == AssessmentType.END_SEMESTER:
                priority = PriorityEnum.CRITICAL
                reason = "Mandatory for course completion"
            elif assessment.assessment_type == AssessmentType.PRE_END:
                priority = PriorityEnum.HIGH
                reason = "High weightage assessment"
            elif assessment.assessment_type == AssessmentType.ASSIGNMENT:
                priority = PriorityEnum.MEDIUM
                reason = "Consistent internal marks"
            else:
                priority = PriorityEnum.LOW
                reason = "Regular assessment"
                
            action_center.append(ActionItem(
                title=f"Complete {assessment.title}",
                priority=priority,
                reason=reason,
                action="Enter Marks" if result else "Add Result",
                link=f"/subjects/{assessment.subject_id}/assessments"
            ))
            
    # Sort Action Center
    priority_map = {PriorityEnum.CRITICAL: 0, PriorityEnum.HIGH: 1, PriorityEnum.MEDIUM: 2, PriorityEnum.LOW: 3}
    action_center.sort(key=lambda x: priority_map[x.priority])

    # 5. Build Sub-Responses
    header = DashboardHeader(
        greeting="Welcome Back",
        semester=str(current_semester.name),
        completion=int((completed_assessments / total_assessments * 100) if total_assessments > 0 else 0)
    )
    
    # Internal marks aggregate
    internal_earned = sum(p.current_internal_marks for _, p in subject_predictions)
    internal_max = sum(p.max_internal_marks for _, p in subject_predictions)
    
    overview = OverviewData(
        current_sgpa=sgpa_data.semester.sgpa,
        current_cgpa=cgpa_data.cgpa,
        academic_health=round(health_data_api.health_score),
        prediction_confidence="MEDIUM",
        internal_marks_earned=internal_earned,
        total_internal_marks=internal_max,
        semester_credits=current_semester.total_credits if hasattr(current_semester, "total_credits") else sum(s.credits for s in subjects) # type: ignore
    )
    
    prediction = PredictionData(
        sgpa=SGPAData(
            current=sgpa_data.semester.sgpa,
            target=9.0, # Target default to 9.0 for now, could be user configurable
            progress=min(100.0, (sgpa_data.semester.sgpa / 9.0) * 100)
        )
    )
    
    health_ui = HealthData(
        score=round(health_data_api.health_score),
        status=health_data_api.health_status,
        color="#10B981" if health_data_api.health_status == "Excellent" else "#F59E0B" if health_data_api.health_status == "Good" else "#EF4444",
        progress=round(health_data_api.health_score)
    )
    
    semester_prog = SemesterProgressData(
        assessment_completion=int((completed_assessments / total_assessments * 100) if total_assessments > 0 else 0),
        assignment_completion=int((completed_assignments / total_assignments * 100) if total_assignments > 0 else 0),
        days_remaining=None
    )
    
    sub_summaries = []
    for sub, pred in subject_predictions:
        sub_summaries.append(SubjectSummary(
            id=str(sub.id),
            code=sub.code,
            name=sub.name,
            predicted_grade=pred.predicted_eval.final.grade,
            predicted_percentage=pred.predicted_eval.final.percentage,
            status="Safe" if pred.predicted_eval.final.percentage >= 60 else "At Risk"
        ))
        
    insights = []
    if health_data_api.weakest_subject:
        insights.append(StructuredInsight(
            type=InsightType.WARNING,
            subject=health_data_api.weakest_subject,
            title="Weak Subject Detected",
            message=f"{health_data_api.weakest_subject} is lowering your predicted SGPA.",
            action="Focus on upcoming assessments"
        ))
        
    if health_data_api.strongest_subject:
        insights.append(StructuredInsight(
            type=InsightType.SUCCESS,
            subject=health_data_api.strongest_subject,
            title="Strong Subject",
            message=f"You are performing exceptionally well in {health_data_api.strongest_subject}.",
        ))
        
    for opp in health_data_api.improvement_opportunities[:2]:
        insights.append(StructuredInsight(
            type=InsightType.INFO,
            subject=opp.subject_code,
            title="Opportunity to Improve",
            message=f"Score well in {opp.assessment_title} to gain {opp.potential_gpa_gain} GPA points.",
            action="Start Studying"
        ))
        
    # Charts Data
    subject_performance = [
        {"name": sub.code, "predicted": pred.predicted_eval.final.percentage, "current": pred.current_internal_marks} 
        for sub, pred in subject_predictions
    ]
    
    grade_distribution = []
    grade_counts = {}
    for sub, pred in subject_predictions:
        g = pred.predicted_eval.final.grade
        grade_counts[g] = grade_counts.get(g, 0) + 1
    for g, count in grade_counts.items():
        grade_distribution.append({"name": g, "value": count})
        
    charts = ChartsData(
        semester_progress=[
            {"name": "Completed", "value": completed_assessments},
            {"name": "Pending", "value": total_assessments - completed_assessments}
        ],
        subject_performance=subject_performance,
        grade_distribution=grade_distribution,
        assessment_completion=[
            {"name": "Assignments", "value": int((completed_assignments / total_assignments * 100) if total_assignments > 0 else 0)},
            {"name": "Overall", "value": int((completed_assessments / total_assessments * 100) if total_assessments > 0 else 0)}
        ]
    )

    return DashboardResponse(
        header=header,
        overview=overview,
        prediction=prediction,
        health=health_ui,
        semester=semester_prog,
        subjects=sub_summaries,
        charts=charts,
        action_center=action_center,
        insights=insights
    )
