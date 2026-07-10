from typing import Optional
from uuid import UUID
from datetime import datetime
from pydantic import BaseModel, Field

from app.models.enums import SubjectType

class SubjectBase(BaseModel):
    code: str = Field(..., min_length=2, max_length=20)
    name: str = Field(..., min_length=2, max_length=100)
    subject_type: SubjectType
    credits: int = Field(..., gt=0, description="Credits must be greater than 0")
    faculty_name: Optional[str] = Field(None, max_length=100)
    color: Optional[str] = Field(None, max_length=7)
    is_active: bool = True

class SubjectCreate(SubjectBase):
    pass

class SubjectUpdate(BaseModel):
    code: Optional[str] = Field(None, min_length=2, max_length=20)
    name: Optional[str] = Field(None, min_length=2, max_length=100)
    subject_type: Optional[SubjectType] = None
    credits: Optional[int] = Field(None, gt=0)
    faculty_name: Optional[str] = Field(None, max_length=100)
    color: Optional[str] = Field(None, max_length=7)
    is_active: Optional[bool] = None

class SubjectResponse(SubjectBase):
    id: UUID
    semester_id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
