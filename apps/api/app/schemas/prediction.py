# pyrefly: ignore [missing-import]
from pydantic import BaseModel
from typing import List, Optional
from uuid import UUID
from enum import Enum
from app.schemas.evaluation import EvaluationResultResponse
from app.schemas.sgpa import SGPACalculationResponse

class PredictionSource(str, Enum):
    SUBJECT_AVERAGE = "SUBJECT_AVERAGE"
    SEMESTER_AVERAGE = "SEMESTER_AVERAGE"
    DEFAULT = "DEFAULT"

class PredictionConfidence(str, Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"

class HealthStatus(str, Enum):
    EXCELLENT = "Excellent"
    GOOD = "Good"
    AVERAGE = "Average"
    NEEDS_ATTENTION = "Needs Attention"
    CRITICAL = "Critical"

class PredictedAssessment(BaseModel):
    assessment_id: UUID
    title: str
    predicted_marks: float
    max_marks: int
    source: PredictionSource

class SubjectPredictionResponse(BaseModel):
    subject_id: UUID
    current_internal_marks: float
    max_internal_marks: float
    predicted_eval: EvaluationResultResponse
    predicted_assessments: List[PredictedAssessment]
    confidence: PredictionConfidence
    confidence_score: float
    completion_percentage: float
    missing_assessments: int

class TargetGradeRequest(BaseModel):
    target_grade: str

class TargetGradeResponse(BaseModel):
    subject_id: UUID
    target_grade: str
    required_external_marks: Optional[float]
    max_external_marks: float
    is_possible: bool
    message: str

class TargetSGPARequest(BaseModel):
    target_sgpa: float

class TargetSGPAResponse(BaseModel):
    semester_id: UUID
    target_sgpa: float
    current_predicted_sgpa: float
    required_credit_points: float
    remaining_credits: int
    is_possible: bool
    message: str

class WhatIfOverride(BaseModel):
    assessment_id: UUID
    simulated_marks: float

class WhatIfRequest(BaseModel):
    overrides: List[WhatIfOverride]

class HealthScoreBreakdown(BaseModel):
    assessment_completion: float # out of 20
    assignment_completion: float # out of 10
    current_internal: float      # out of 20
    predicted_sgpa: float        # out of 25
    failed_subjects: float       # out of 15
    missing_mandatory: float     # out of 10

class ImprovementOpportunity(BaseModel):
    subject_id: UUID
    subject_code: str
    subject_name: str
    assessment_id: UUID
    assessment_title: str
    current_marks: float
    max_marks: float
    potential_gpa_gain: float

class AcademicHealthResponse(BaseModel):
    semester_id: UUID
    health_score: float
    health_status: HealthStatus
    breakdown: HealthScoreBreakdown
    weakest_subject: Optional[str]
    strongest_subject: Optional[str]
    improvement_opportunities: List[ImprovementOpportunity]
