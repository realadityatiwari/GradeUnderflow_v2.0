from app.api.v1 import health, auth, users, semesters, subjects, assessments, evaluation, sgpa, prediction, dashboard, analytics
from fastapi import APIRouter

api_router = APIRouter()
api_router.include_router(health.router, tags=["health"])
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(semesters.router, prefix="/semesters", tags=["semesters"])
api_router.include_router(subjects.router, tags=["subjects"])
api_router.include_router(assessments.router, tags=["assessments"])
api_router.include_router(evaluation.router, tags=["evaluation"])
api_router.include_router(sgpa.router, tags=["sgpa"])
api_router.include_router(prediction.router, tags=["prediction"])
api_router.include_router(dashboard.router, prefix="/dashboard", tags=["dashboard"])
api_router.include_router(analytics.router, prefix="/analytics", tags=["analytics"])
