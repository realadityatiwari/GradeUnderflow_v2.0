from typing import Optional
from uuid import UUID
from datetime import date, datetime
from pydantic import BaseModel, Field

from app.models.enums import AssessmentType, AssessmentCategory, AssessmentStatus

# --- AssessmentResult Schemas ---

class AssessmentResultBase(BaseModel):
    status: AssessmentStatus = AssessmentStatus.NOT_STARTED
    obtained_marks: Optional[int] = Field(None, ge=0)
    submission_date: Optional[date] = None
    remarks: Optional[str] = Field(None, max_length=255)

class AssessmentResultUpdate(BaseModel):
    status: Optional[AssessmentStatus] = None
    obtained_marks: Optional[int] = Field(None, ge=0)
    submission_date: Optional[date] = None
    remarks: Optional[str] = Field(None, max_length=255)

class AssessmentResultResponse(AssessmentResultBase):
    id: UUID
    assessment_id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# --- Assessment Schemas ---

class AssessmentBase(BaseModel):
    assessment_type: AssessmentType
    assessment_category: AssessmentCategory
    title: str = Field(..., min_length=2, max_length=100)
    max_marks: int = Field(..., gt=0)
    weightage: Optional[int] = Field(None, ge=0, le=100)
    due_date: Optional[date] = None
    conducted_on: Optional[date] = None
    display_order: int = 0
    is_required: bool = True

class AssessmentCreate(AssessmentBase):
    pass

class AssessmentUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=2, max_length=100)
    max_marks: Optional[int] = Field(None, gt=0)
    weightage: Optional[int] = Field(None, ge=0, le=100)
    due_date: Optional[date] = None
    conducted_on: Optional[date] = None
    display_order: Optional[int] = None
    is_required: Optional[bool] = None

class AssessmentResponse(AssessmentBase):
    id: UUID
    subject_id: UUID
    created_at: datetime
    updated_at: datetime
    
    result: Optional[AssessmentResultResponse] = None

    class Config:
        from_attributes = True
