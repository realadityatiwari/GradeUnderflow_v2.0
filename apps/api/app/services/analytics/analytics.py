from sqlalchemy.orm import Session
from uuid import UUID
from datetime import datetime, timezone

from app.models.semester import Semester
from app.models.subject import Subject
from app.models.assessment import Assessment
from app.models.enums import SemesterStatus
from app.schemas.analytics import (
    AnalyticsMetadata,
    AnalyticsOverviewResponse,
    AnalyticsOverviewData,
    SubjectAnalyticsResponse,
    SemesterAnalyticsResponse,
    TrendAnalyticsResponse,
    DistributionAnalyticsResponse,
    ComparisonAnalyticsResponse,
    ImprovementAnalysisItem
)

from app.services.prediction.prediction import get_subject_prediction
from app.services.prediction.health import get_academic_health

from app.services.analytics.subjects import get_subject_analytics
from app.services.analytics.semester import get_semester_analytics
from app.services.analytics.trends import get_trend_analytics
from app.services.analytics.distribution import get_distribution_analytics
from app.services.analytics.comparison import get_comparison_analytics

def get_base_context(db: Session, user_id: UUID):
    """Helper to fetch the current active context for analytics."""
    current_semester = db.query(Semester).filter(
        Semester.user_id == user_id,
        Semester.status == SemesterStatus.CURRENT
    ).first()
    
    if not current_semester:
        current_semester = db.query(Semester).filter(Semester.user_id == user_id).order_by(Semester.created_at.desc()).first()
        
    if not current_semester:
        return None, [], []
        
    subjects = db.query(Subject).filter(Subject.semester_id == current_semester.id).all()
    if not subjects:
        return current_semester, [], []
        
    predictions = []
    for sub in subjects:
        pred = get_subject_prediction(db, sub.id)
        predictions.append((sub, pred))
        
    return current_semester, subjects, predictions
    
def _generate_metadata(db: Session, user_id: UUID, semester_id: UUID = None) -> AnalyticsMetadata:
    if not semester_id:
        return AnalyticsMetadata(
            generated_at=datetime.now(timezone.utc),
            semester_id=None,
            total_subjects=0,
            total_assessments=0
        )
    subjects_count = db.query(Subject).filter(Subject.semester_id == semester_id).count()
    assessments_count = db.query(Assessment).join(Subject).filter(Subject.semester_id == semester_id).count()
    return AnalyticsMetadata(
        generated_at=datetime.now(timezone.utc),
        semester_id=str(semester_id),
        total_subjects=subjects_count,
        total_assessments=assessments_count
    )

def get_analytics_overview(db: Session, user_id: UUID) -> AnalyticsOverviewResponse:
    sem, subjects, predictions = get_base_context(db, user_id)
    if not sem or not subjects:
        meta = _generate_metadata(db, user_id, sem.id if sem else None)
        return AnalyticsOverviewResponse(
            has_data=False,
            message="Create your first semester and add subjects to unlock analytics.",
            metadata=meta,
            overview=AnalyticsOverviewData(improvements=[])
        )
        
    meta = _generate_metadata(db, user_id, sem.id)
    subject_data = get_subject_analytics(db, sem.id, subjects)
    semester_data = get_semester_analytics(db, user_id, sem.id, predictions)
    
    # Improvements
    health = get_academic_health(db, sem.id)
    improvements = []
    for opp in health.improvement_opportunities:
        improvements.append(ImprovementAnalysisItem(
            subject=opp.subject_code,
            current_percentage=80.0, # Target placeholder
            target_percentage=80.0 + opp.potential_gpa_gain * 10,
            gap=opp.potential_gpa_gain * 10,
            priority="HIGH" if opp.potential_gpa_gain > 0.5 else "MEDIUM",
            severity="CRITICAL" if opp.potential_gpa_gain > 1.0 else "WARNING"
        ))
    # Sort descending by gap
    improvements.sort(key=lambda x: x.gap, reverse=True)
    
    return AnalyticsOverviewResponse(
        metadata=meta,
        overview=AnalyticsOverviewData(
            subject=subject_data,
            semester=semester_data,
        ),
        improvements=improvements
    )

def get_analytics_subjects(db: Session, user_id: UUID) -> SubjectAnalyticsResponse:
    sem, subjects, _ = get_base_context(db, user_id)
    meta = _generate_metadata(db, user_id, sem.id if sem else None)
    if not sem or not subjects:
        return SubjectAnalyticsResponse(has_data=False, metadata=meta, message="No subjects found.")
    
    data = get_subject_analytics(db, sem.id, subjects)
    return SubjectAnalyticsResponse(metadata=meta, data=data)

def get_analytics_semester(db: Session, user_id: UUID) -> SemesterAnalyticsResponse:
    sem, subjects, predictions = get_base_context(db, user_id)
    meta = _generate_metadata(db, user_id, sem.id if sem else None)
    if not sem or not subjects:
        return SemesterAnalyticsResponse(has_data=False, metadata=meta, message="No semester data found.")
        
    data = get_semester_analytics(db, user_id, sem.id, predictions)
    return SemesterAnalyticsResponse(metadata=meta, data=data)

def get_analytics_trends(db: Session, user_id: UUID) -> TrendAnalyticsResponse:
    sem, subjects, predictions = get_base_context(db, user_id)
    meta = _generate_metadata(db, user_id, sem.id if sem else None)
    if not sem or not subjects:
        return TrendAnalyticsResponse(has_data=False, metadata=meta, message="No data for trends.")
        
    data = get_trend_analytics(db, predictions)
    return TrendAnalyticsResponse(metadata=meta, data=data)

def get_analytics_distribution(db: Session, user_id: UUID) -> DistributionAnalyticsResponse:
    sem, subjects, predictions = get_base_context(db, user_id)
    meta = _generate_metadata(db, user_id, sem.id if sem else None)
    if not sem or not subjects:
        return DistributionAnalyticsResponse(has_data=False, metadata=meta, message="No data for distribution.")
        
    data = get_distribution_analytics(db, predictions)
    return DistributionAnalyticsResponse(metadata=meta, data=data)

def get_analytics_comparison(db: Session, user_id: UUID) -> ComparisonAnalyticsResponse:
    sem, subjects, predictions = get_base_context(db, user_id)
    meta = _generate_metadata(db, user_id, sem.id if sem else None)
    if not sem or not subjects:
        return ComparisonAnalyticsResponse(has_data=False, metadata=meta, message="No data for comparison.")
        
    data = get_comparison_analytics(db, user_id, predictions)
    return ComparisonAnalyticsResponse(metadata=meta, data=data)
