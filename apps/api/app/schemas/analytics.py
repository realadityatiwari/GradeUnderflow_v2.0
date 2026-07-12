from pydantic import BaseModel
from typing import List, Optional, Any
from datetime import datetime

class AnalyticsMetadata(BaseModel):
    generated_at: datetime
    semester_id: Optional[str] = None
    total_subjects: int
    total_assessments: int

class AnalyticsBase(BaseModel):
    has_data: bool = True
    message: Optional[str] = None
    metadata: AnalyticsMetadata

# Subject Analytics
class SubjectAnalyticsData(BaseModel):
    highest_performing_subject: Optional[str]
    lowest_performing_subject: Optional[str]
    average_percentage: float
    average_grade: str
    average_grade_point: float
    internal_marks_earned: float
    internal_marks_total: float
    external_marks_earned: float
    external_marks_total: float
    completion_percentage: float
    total_credits: int

class SubjectAnalyticsResponse(AnalyticsBase):
    data: Optional[SubjectAnalyticsData] = None

# Semester Analytics
class SemesterAnalyticsData(BaseModel):
    current_sgpa: float
    predicted_sgpa: float
    cgpa: float
    credits_earned: float
    credits_remaining: float
    completion_percentage: float
    passed_subjects: int
    failed_subjects: int

class SemesterAnalyticsResponse(AnalyticsBase):
    data: Optional[SemesterAnalyticsData] = None

# Trends
class ChartDataItem(BaseModel):
    label: str
    value: Any
    secondary_value: Optional[Any] = None

class TrendDatasets(BaseModel):
    assignments: List[ChartDataItem]
    quizzes: List[ChartDataItem]
    surprise_tests: List[ChartDataItem]
    pre_end: List[ChartDataItem]
    end_semester: List[ChartDataItem]
    internal_marks: List[ChartDataItem]
    external_marks: List[ChartDataItem]
    overall_percentage: List[ChartDataItem]
    prediction_accuracy: List[ChartDataItem]

class TrendAnalyticsResponse(AnalyticsBase):
    data: Optional[TrendDatasets] = None

# Distributions
class DistributionDatasets(BaseModel):
    grade_distribution: List[ChartDataItem]
    grade_point_distribution: List[ChartDataItem]
    credit_distribution: List[ChartDataItem]
    theory_vs_lab: List[ChartDataItem]
    assessment_type: List[ChartDataItem]

class DistributionAnalyticsResponse(AnalyticsBase):
    data: Optional[DistributionDatasets] = None

# Comparisons
class ComparisonDatasets(BaseModel):
    semester_vs_semester: List[ChartDataItem]
    subject_vs_subject: List[ChartDataItem]
    internal_vs_external: List[ChartDataItem]
    predicted_vs_actual: List[ChartDataItem]
    highest_vs_lowest: List[ChartDataItem]

class ComparisonAnalyticsResponse(AnalyticsBase):
    data: Optional[ComparisonDatasets] = None

# Improvements
class ImprovementAnalysisItem(BaseModel):
    subject: str
    current_percentage: float
    target_percentage: float
    gap: float
    priority: str
    severity: str

class AnalyticsOverviewData(BaseModel):
    subject: Optional[SubjectAnalyticsData] = None
    semester: Optional[SemesterAnalyticsData] = None
    improvements: List[ImprovementAnalysisItem] = []

class AnalyticsOverviewResponse(AnalyticsBase):
    overview: Optional[AnalyticsOverviewData] = None
    improvements: List[ImprovementAnalysisItem] = []
