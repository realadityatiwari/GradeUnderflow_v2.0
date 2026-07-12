from sqlalchemy.orm import Session
from app.db.session import SessionLocal
from app.models.user import User
from app.models.semester import Semester
from app.models.subject import Subject
from app.models.assessment import Assessment, AssessmentResult
from app.models.enums import SemesterStatus, SubjectType, SemesterType, AssessmentType, AssessmentCategory, AssessmentStatus
from app.core.security import get_password_hash

def seed_db():
    print("Starting Demo Seeder...")
    # Base.metadata.create_all(bind=engine)
    
    db: Session = SessionLocal()
    
    try:
        # Create or Get Demo User
        email = "demo@gradeunderflow.com"
        password = "GradeUnderflow@2026"
        
        user = db.query(User).filter(User.email == email).first()
        if not user:
            print(f"Creating Demo User: {email}")
            user = User(
                email=email,
                password_hash=get_password_hash(password),
                full_name="Demo Student"
            )
            db.add(user)
            db.commit()
            db.refresh(user)
        else:
            print(f"Demo User already exists: {email}. Refreshing data...")
            # Delete existing semesters for this user to ensure idempotency and fresh demo data
            semesters = db.query(Semester).filter(Semester.user_id == user.id).all()
            for sem in semesters:
                db.delete(sem)
            db.commit()

        print("Creating Semester III (Completed)...")
        sem3 = Semester(
            user_id=user.id,
            name="Semester III",
            academic_year="2025-26",
            semester_type=SemesterType.ODD,
            status=SemesterStatus.COMPLETED
        )
        db.add(sem3)
        db.commit()
        db.refresh(sem3)
        
        print("Creating Semester IV (Current)...")
        sem4 = Semester(
            user_id=user.id,
            name="Semester IV",
            academic_year="2025-26",
            semester_type=SemesterType.EVEN,
            status=SemesterStatus.CURRENT
        )
        db.add(sem4)
        db.commit()
        db.refresh(sem4)
        
        # Populate Semester III
        sub3_1 = Subject(semester_id=sem3.id, code="CS201", name="Data Structures", credits=4, subject_type=SubjectType.THEORY)
        sub3_2 = Subject(semester_id=sem3.id, code="CS202", name="Digital Logic", credits=3, subject_type=SubjectType.THEORY)
        sub3_3 = Subject(semester_id=sem3.id, code="MA201", name="Mathematics III", credits=4, subject_type=SubjectType.THEORY)
        sub3_4 = Subject(semester_id=sem3.id, code="CS201L", name="Data Structures Lab", credits=1, subject_type=SubjectType.LABORATORY)
        sub3_5 = Subject(semester_id=sem3.id, code="CS202L", name="Digital Logic Lab", credits=1, subject_type=SubjectType.LABORATORY)
        
        db.add_all([sub3_1, sub3_2, sub3_3, sub3_4, sub3_5])
        db.commit()
        
        def create_assessment(subject, title, a_type, a_cat, max_marks, obtained_marks, weightage):
            assessment = Assessment(
                subject_id=subject.id,
                title=title,
                assessment_type=a_type,
                assessment_category=a_cat,
                max_marks=max_marks,
                weightage=weightage
            )
            db.add(assessment)
            db.commit()
            db.refresh(assessment)
            
            result = AssessmentResult(
                assessment_id=assessment.id,
                status=AssessmentStatus.CHECKED if obtained_marks is not None else AssessmentStatus.NOT_STARTED,
                obtained_marks=obtained_marks
            )
            db.add(result)
            db.commit()

        # Populate assessments for Semester III
        # CS201
        create_assessment(sub3_1, "Midterm", AssessmentType.PRE_END, AssessmentCategory.THEORY, 20, 18, 20)
        create_assessment(sub3_1, "Assignment 1", AssessmentType.ASSIGNMENT, AssessmentCategory.THEORY, 10, 9, 10)
        create_assessment(sub3_1, "Final", AssessmentType.END_SEMESTER, AssessmentCategory.THEORY, 50, 42, 50)
        
        # CS202
        create_assessment(sub3_2, "Midterm", AssessmentType.PRE_END, AssessmentCategory.THEORY, 20, 14, 20)
        create_assessment(sub3_2, "Assignment 1", AssessmentType.ASSIGNMENT, AssessmentCategory.THEORY, 10, 7, 10)
        create_assessment(sub3_2, "Final", AssessmentType.END_SEMESTER, AssessmentCategory.THEORY, 50, 35, 50)
        
        # MA201
        create_assessment(sub3_3, "Midterm", AssessmentType.PRE_END, AssessmentCategory.THEORY, 20, 19, 20)
        create_assessment(sub3_3, "Final", AssessmentType.END_SEMESTER, AssessmentCategory.THEORY, 50, 48, 50)
        
        # Labs
        create_assessment(sub3_4, "Lab Final", AssessmentType.END_SEMESTER, AssessmentCategory.LABORATORY, 50, 45, 100)
        create_assessment(sub3_5, "Lab Final", AssessmentType.END_SEMESTER, AssessmentCategory.LABORATORY, 50, 40, 100)
        
        # Populate Semester IV
        sub4_1 = Subject(semester_id=sem4.id, code="CS203", name="Design & Analysis of Algorithms", credits=4, subject_type=SubjectType.THEORY)
        sub4_2 = Subject(semester_id=sem4.id, code="CS204", name="Computer Architecture", credits=3, subject_type=SubjectType.THEORY)
        sub4_3 = Subject(semester_id=sem4.id, code="CS205", name="Operating Systems", credits=4, subject_type=SubjectType.THEORY)
        sub4_4 = Subject(semester_id=sem4.id, code="CS206", name="Database Management", credits=3, subject_type=SubjectType.THEORY)
        sub4_5 = Subject(semester_id=sem4.id, code="CS203L", name="DAA Lab", credits=1, subject_type=SubjectType.LABORATORY)
        sub4_6 = Subject(semester_id=sem4.id, code="CS205L", name="OS Lab", credits=1, subject_type=SubjectType.LABORATORY)
        
        db.add_all([sub4_1, sub4_2, sub4_3, sub4_4, sub4_5, sub4_6])
        db.commit()
        
        # Populate assessments for Semester IV (Current - partial)
        # Excellent Subject
        create_assessment(sub4_1, "Midterm 1", AssessmentType.PRE_END, AssessmentCategory.THEORY, 20, 19, 20)
        create_assessment(sub4_1, "Assignment 1", AssessmentType.ASSIGNMENT, AssessmentCategory.THEORY, 10, 9, 10)
        
        # Average Subject
        create_assessment(sub4_2, "Midterm 1", AssessmentType.PRE_END, AssessmentCategory.THEORY, 20, 14, 20)
        create_assessment(sub4_2, "Surprise Test", AssessmentType.SURPRISE_TEST, AssessmentCategory.THEORY, 5, 3, 5)
        
        # Weak Subject
        create_assessment(sub4_3, "Midterm 1", AssessmentType.PRE_END, AssessmentCategory.THEORY, 20, 9, 20)
        create_assessment(sub4_3, "Quiz 1", AssessmentType.QUIZ, AssessmentCategory.THEORY, 10, 4, 10)
        
        # Excellent Subject
        create_assessment(sub4_4, "Midterm 1", AssessmentType.PRE_END, AssessmentCategory.THEORY, 20, 17, 20)
        create_assessment(sub4_4, "Assignment 1", AssessmentType.ASSIGNMENT, AssessmentCategory.THEORY, 10, 8, 10)
        
        # Labs
        create_assessment(sub4_5, "Experiment 1", AssessmentType.ASSIGNMENT, AssessmentCategory.LABORATORY, 10, 9, 20)
        create_assessment(sub4_6, "Experiment 1", AssessmentType.ASSIGNMENT, AssessmentCategory.LABORATORY, 10, 7, 20)
        
        db.commit()
        print("Demo Database Seeded Successfully.")
        
    except Exception as e:
        print(f"Error seeding database: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_db()
