from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.dependencies.auth import get_current_user
from app.models.user import User
from app.schemas.dashboard import DashboardResponse
from app.services.dashboard.dashboard import get_dashboard_summary

router = APIRouter()

@router.get("", response_model=DashboardResponse, summary="Get Academic Intelligence Dashboard")
def get_dashboard(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> DashboardResponse:
    """
    Returns the aggregated academic intelligence dashboard payload.
    """
    return get_dashboard_summary(db, current_user.id)
