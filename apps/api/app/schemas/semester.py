from typing import Optional
from uuid import UUID
from datetime import date, datetime
from pydantic import BaseModel, Field

from app.models.enums import SemesterType, SemesterStatus

class SemesterBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=50)
    academic_year: str = Field(..., pattern=r"^\d{4}-\d{2}$", description="Format: YYYY-YY (e.g. 2026-27)")
    semester_type: SemesterType
    status: SemesterStatus = SemesterStatus.CURRENT
    start_date: Optional[date] = None
    end_date: Optional[date] = None

class SemesterCreate(SemesterBase):
    pass

class SemesterUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=2, max_length=50)
    academic_year: Optional[str] = Field(None, pattern=r"^\d{4}-\d{2}$")
    semester_type: Optional[SemesterType] = None
    status: Optional[SemesterStatus] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None

class SemesterResponse(SemesterBase):
    id: UUID
    user_id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
