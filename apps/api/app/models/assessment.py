import uuid
from sqlalchemy import Column, String, Integer, Boolean, ForeignKey, Enum as SQLEnum, DateTime, Date
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func

from app.db.base_class import Base
from app.models.enums import AssessmentType, AssessmentCategory, AssessmentStatus

class Assessment(Base):
    __tablename__ = "assessment"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    subject_id = Column(UUID(as_uuid=True), ForeignKey("subject.id", ondelete="CASCADE"), nullable=False, index=True)
    
    assessment_type = Column(SQLEnum(AssessmentType), nullable=False)
    assessment_category = Column(SQLEnum(AssessmentCategory), nullable=False)
    
    title = Column(String(100), nullable=False)
    max_marks = Column(Integer, nullable=False)
    weightage = Column(Integer, nullable=True)
    
    due_date = Column(Date, nullable=True)
    conducted_on = Column(Date, nullable=True)
    display_order = Column(Integer, default=0, nullable=False)
    is_required = Column(Boolean, default=True, nullable=False)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    # Relationships
    subject = relationship("Subject", back_populates="assessments")
    result = relationship("AssessmentResult", back_populates="assessment", uselist=False, cascade="all, delete-orphan")


class AssessmentResult(Base):
    __tablename__ = "assessment_result"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    assessment_id = Column(UUID(as_uuid=True), ForeignKey("assessment.id", ondelete="CASCADE"), unique=True, nullable=False, index=True)
    
    status = Column(SQLEnum(AssessmentStatus), default=AssessmentStatus.NOT_STARTED, nullable=False)
    obtained_marks = Column(Integer, nullable=True)
    submission_date = Column(Date, nullable=True)
    remarks = Column(String(255), nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    # Relationships
    assessment = relationship("Assessment", back_populates="result")
