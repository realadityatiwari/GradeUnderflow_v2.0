import uuid
from sqlalchemy import Column, String, Date, ForeignKey, Enum as SQLEnum, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func

from app.db.base_class import Base
from app.models.enums import SemesterType, SemesterStatus

class Semester(Base):
    __tablename__ = "semester"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("user.id", ondelete="CASCADE"), nullable=False, index=True)
    
    name = Column(String(50), nullable=False)
    academic_year = Column(String(20), nullable=False)
    
    semester_type = Column(SQLEnum(SemesterType), nullable=False)
    status = Column(SQLEnum(SemesterStatus), nullable=False, default=SemesterStatus.CURRENT)
    
    start_date = Column(Date, nullable=True)
    end_date = Column(Date, nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    # Relationships
    user = relationship("User", back_populates="semesters")
    subjects = relationship("Subject", back_populates="semester", cascade="all, delete-orphan")
