from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.dependencies.auth import get_current_user
from app.models.user import User

from app.schemas.analytics import (
    AnalyticsOverviewResponse,
    SubjectAnalyticsResponse,
    SemesterAnalyticsResponse,
    TrendAnalyticsResponse,
    DistributionAnalyticsResponse,
    ComparisonAnalyticsResponse
)

from app.services.analytics import analytics as facade

router = APIRouter()

@router.get("/overview", response_model=AnalyticsOverviewResponse)
def get_analytics_overview(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    return facade.get_analytics_overview(db, user.id)

@router.get("/subjects", response_model=SubjectAnalyticsResponse)
def get_analytics_subjects(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    return facade.get_analytics_subjects(db, user.id)

@router.get("/semester", response_model=SemesterAnalyticsResponse)
def get_analytics_semester(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    return facade.get_analytics_semester(db, user.id)

@router.get("/trends", response_model=TrendAnalyticsResponse)
def get_analytics_trends(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    return facade.get_analytics_trends(db, user.id)

@router.get("/distribution", response_model=DistributionAnalyticsResponse)
def get_analytics_distribution(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    return facade.get_analytics_distribution(db, user.id)

@router.get("/comparison", response_model=ComparisonAnalyticsResponse)
def get_analytics_comparison(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    return facade.get_analytics_comparison(db, user.id)
