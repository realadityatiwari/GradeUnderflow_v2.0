import uuid
from sqlalchemy import Column, String, Integer, Boolean, ForeignKey, Enum as SQLEnum, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func

from app.db.base_class import Base
from app.models.enums import SubjectType

class Subject(Base):
    __tablename__ = "subject"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    semester_id = Column(UUID(as_uuid=True), ForeignKey("semester.id", ondelete="CASCADE"), nullable=False, index=True)
    
    code = Column(String(20), nullable=False, index=True)
    name = Column(String(100), nullable=False)
    subject_type = Column(SQLEnum(SubjectType), nullable=False)
    credits = Column(Integer, nullable=False)
    faculty_name = Column(String(100), nullable=True)
    color = Column(String(7), nullable=True)
    
    is_active = Column(Boolean, default=True, nullable=False)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    # Relationships
    semester = relationship("Semester", back_populates="subjects")
    assessments = relationship("Assessment", back_populates="subject", cascade="all, delete-orphan")
