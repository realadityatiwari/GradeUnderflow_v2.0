from typing import List, Optional, Dict, Any
from pydantic import BaseModel
from enum import Enum

class PriorityEnum(str, Enum):
    CRITICAL = "CRITICAL"
    HIGH = "HIGH"
    MEDIUM = "MEDIUM"
    LOW = "LOW"

class InsightType(str, Enum):
    SUCCESS = "success"
    INFO = "info"
    WARNING = "warning"
    CRITICAL = "critical"

class DashboardHeader(BaseModel):
    greeting: str
    semester: str
    completion: int

class SGPAData(BaseModel):
    current: float
    target: float
    progress: float

class OverviewData(BaseModel):
    current_sgpa: float
    current_cgpa: float
    academic_health: int
    prediction_confidence: str
    internal_marks_earned: int
    total_internal_marks: int
    semester_credits: int

class PredictionData(BaseModel):
    sgpa: SGPAData

class HealthData(BaseModel):
    score: int
    status: str
    color: str
    progress: int

class SemesterProgressData(BaseModel):
    assessment_completion: int
    assignment_completion: int
    days_remaining: Optional[int]

class SubjectSummary(BaseModel):
    id: str
    code: str
    name: str
    predicted_grade: str
    predicted_percentage: float
    status: str

class ActionItem(BaseModel):
    title: str
    priority: PriorityEnum
    reason: str
    action: str
    link: Optional[str] = None

class StructuredInsight(BaseModel):
    type: InsightType
    subject: Optional[str]
    title: str
    message: str
    action: Optional[str] = None

class ChartsData(BaseModel):
    semester_progress: List[Dict[str, Any]]
    subject_performance: List[Dict[str, Any]]
    grade_distribution: List[Dict[str, Any]]
    assessment_completion: List[Dict[str, Any]]

class DashboardResponse(BaseModel):
    setup_required: bool = False
    next_step: Optional[str] = None
    
    header: Optional[DashboardHeader] = None
    overview: Optional[OverviewData] = None
    prediction: Optional[PredictionData] = None
    health: Optional[HealthData] = None
    semester: Optional[SemesterProgressData] = None
    subjects: Optional[List[SubjectSummary]] = None
    charts: Optional[ChartsData] = None
    action_center: Optional[List[ActionItem]] = None
    insights: Optional[List[StructuredInsight]] = None
