from pydantic import BaseModel
from typing import List
from uuid import UUID

class SubjectSGPASummary(BaseModel):
    id: UUID
    code: str
    name: str
    credits: int
    grade: str
    grade_point: int
    credit_points: float

class SemesterSGPASummary(BaseModel):
    sgpa: float
    total_credits: int
    earned_credit_points: float

class SGPACalculationResponse(BaseModel):
    semester: SemesterSGPASummary
    subjects: List[SubjectSGPASummary]

class SemesterCGPASummary(BaseModel):
    id: UUID
    name: str
    academic_year: str
    sgpa: float
    total_credits: int
    earned_credit_points: float

class CGPACalculationResponse(BaseModel):
    cgpa: float
    total_credits: int
    total_credit_points: float
    semesters: List[SemesterCGPASummary]
