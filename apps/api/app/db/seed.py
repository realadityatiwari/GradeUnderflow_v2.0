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
    
    db: Session = SessionLocal()
    
    try:
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
        
        # Populate Semester III (Completed) - 6 theory, 3 lab
        sub3_1 = Subject(semester_id=sem3.id, code="CS201", name="Data Structures", credits=4, subject_type=SubjectType.THEORY)
        sub3_2 = Subject(semester_id=sem3.id, code="CS202", name="Digital Logic", credits=3, subject_type=SubjectType.THEORY)
        sub3_3 = Subject(semester_id=sem3.id, code="MA201", name="Mathematics III", credits=4, subject_type=SubjectType.THEORY)
        sub3_4 = Subject(semester_id=sem3.id, code="EE201", name="Basic Electronics", credits=3, subject_type=SubjectType.THEORY)
        sub3_5 = Subject(semester_id=sem3.id, code="HS201", name="Economics", credits=2, subject_type=SubjectType.THEORY)
        sub3_6 = Subject(semester_id=sem3.id, code="CS207", name="IT Workshop", credits=2, subject_type=SubjectType.THEORY)
        sub3_7 = Subject(semester_id=sem3.id, code="CS201L", name="Data Structures Lab", credits=1, subject_type=SubjectType.LABORATORY)
        sub3_8 = Subject(semester_id=sem3.id, code="CS202L", name="Digital Logic Lab", credits=1, subject_type=SubjectType.LABORATORY)
        sub3_9 = Subject(semester_id=sem3.id, code="EE201L", name="Electronics Lab", credits=1, subject_type=SubjectType.LABORATORY)
        
        db.add_all([sub3_1, sub3_2, sub3_3, sub3_4, sub3_5, sub3_6, sub3_7, sub3_8, sub3_9])
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
        # Excellent
        create_assessment(sub3_1, "Midterm", AssessmentType.PRE_END, AssessmentCategory.THEORY, 20, 18, 20)
        create_assessment(sub3_1, "Final", AssessmentType.END_SEMESTER, AssessmentCategory.THEORY, 50, 45, 50)
        # Average
        create_assessment(sub3_2, "Midterm", AssessmentType.PRE_END, AssessmentCategory.THEORY, 20, 14, 20)
        create_assessment(sub3_2, "Final", AssessmentType.END_SEMESTER, AssessmentCategory.THEORY, 50, 35, 50)
        # Good
        create_assessment(sub3_3, "Midterm", AssessmentType.PRE_END, AssessmentCategory.THEORY, 20, 16, 20)
        create_assessment(sub3_3, "Final", AssessmentType.END_SEMESTER, AssessmentCategory.THEORY, 50, 42, 50)
        # Average
        create_assessment(sub3_4, "Midterm", AssessmentType.PRE_END, AssessmentCategory.THEORY, 20, 12, 20)
        create_assessment(sub3_4, "Final", AssessmentType.END_SEMESTER, AssessmentCategory.THEORY, 50, 31, 50)
        # Excellent
        create_assessment(sub3_5, "Midterm", AssessmentType.PRE_END, AssessmentCategory.THEORY, 20, 19, 20)
        create_assessment(sub3_5, "Final", AssessmentType.END_SEMESTER, AssessmentCategory.THEORY, 50, 48, 50)
        # Weak
        create_assessment(sub3_6, "Midterm", AssessmentType.PRE_END, AssessmentCategory.THEORY, 20, 10, 20)
        create_assessment(sub3_6, "Final", AssessmentType.END_SEMESTER, AssessmentCategory.THEORY, 50, 25, 50)
        # Labs
        create_assessment(sub3_7, "Lab Final", AssessmentType.END_SEMESTER, AssessmentCategory.LABORATORY, 50, 45, 100)
        create_assessment(sub3_8, "Lab Final", AssessmentType.END_SEMESTER, AssessmentCategory.LABORATORY, 50, 40, 100)
        create_assessment(sub3_9, "Lab Final", AssessmentType.END_SEMESTER, AssessmentCategory.LABORATORY, 50, 38, 100)
        
        # Populate Semester IV (Current) - 6 theory, 3 lab
        sub4_1 = Subject(semester_id=sem4.id, code="CS203", name="Design & Analysis of Algorithms", credits=4, subject_type=SubjectType.THEORY)
        sub4_2 = Subject(semester_id=sem4.id, code="CS204", name="Computer Architecture", credits=3, subject_type=SubjectType.THEORY)
        sub4_3 = Subject(semester_id=sem4.id, code="CS205", name="Operating Systems", credits=4, subject_type=SubjectType.THEORY)
        sub4_4 = Subject(semester_id=sem4.id, code="CS206", name="Database Management", credits=3, subject_type=SubjectType.THEORY)
        sub4_5 = Subject(semester_id=sem4.id, code="HS202", name="Professional Ethics", credits=2, subject_type=SubjectType.THEORY)
        sub4_6 = Subject(semester_id=sem4.id, code="MA202", name="Discrete Mathematics", credits=3, subject_type=SubjectType.THEORY)
        sub4_7 = Subject(semester_id=sem4.id, code="CS203L", name="DAA Lab", credits=1, subject_type=SubjectType.LABORATORY)
        sub4_8 = Subject(semester_id=sem4.id, code="CS205L", name="OS Lab", credits=1, subject_type=SubjectType.LABORATORY)
        sub4_9 = Subject(semester_id=sem4.id, code="CS206L", name="DBMS Lab", credits=1, subject_type=SubjectType.LABORATORY)
        
        db.add_all([sub4_1, sub4_2, sub4_3, sub4_4, sub4_5, sub4_6, sub4_7, sub4_8, sub4_9])
        db.commit()
        
        # Excellent Subject (CS203)
        create_assessment(sub4_1, "Midterm 1", AssessmentType.PRE_END, AssessmentCategory.THEORY, 20, 19, 20)
        create_assessment(sub4_1, "Assignment 1", AssessmentType.ASSIGNMENT, AssessmentCategory.THEORY, 10, 9, 10)
        create_assessment(sub4_1, "Final Exam", AssessmentType.END_SEMESTER, AssessmentCategory.THEORY, 50, None, 50) # Pending
        
        # Average Subject (CS204)
        create_assessment(sub4_2, "Midterm 1", AssessmentType.PRE_END, AssessmentCategory.THEORY, 20, 13, 20)
        create_assessment(sub4_2, "Surprise Test", AssessmentType.SURPRISE_TEST, AssessmentCategory.THEORY, 5, 3, 5)
        create_assessment(sub4_2, "Final Exam", AssessmentType.END_SEMESTER, AssessmentCategory.THEORY, 50, None, 50)
        
        # Weak Subject (CS205) - Failed Midterm
        create_assessment(sub4_3, "Midterm 1", AssessmentType.PRE_END, AssessmentCategory.THEORY, 20, 4, 20)
        create_assessment(sub4_3, "Quiz 1", AssessmentType.QUIZ, AssessmentCategory.THEORY, 10, 3, 10)
        create_assessment(sub4_3, "Final Exam", AssessmentType.END_SEMESTER, AssessmentCategory.THEORY, 50, None, 50)
        
        # Excellent Subject (CS206)
        create_assessment(sub4_4, "Midterm 1", AssessmentType.PRE_END, AssessmentCategory.THEORY, 20, 18, 20)
        create_assessment(sub4_4, "Assignment 1", AssessmentType.ASSIGNMENT, AssessmentCategory.THEORY, 10, 8, 10)
        create_assessment(sub4_4, "Final Exam", AssessmentType.END_SEMESTER, AssessmentCategory.THEORY, 50, None, 50)
        
        # Average Subject (HS202)
        create_assessment(sub4_5, "Midterm 1", AssessmentType.PRE_END, AssessmentCategory.THEORY, 20, 14, 20)
        create_assessment(sub4_5, "Final Exam", AssessmentType.END_SEMESTER, AssessmentCategory.THEORY, 50, None, 50)
        
        # Good Subject (MA202)
        create_assessment(sub4_6, "Midterm 1", AssessmentType.PRE_END, AssessmentCategory.THEORY, 20, 16, 20)
        create_assessment(sub4_6, "Final Exam", AssessmentType.END_SEMESTER, AssessmentCategory.THEORY, 50, None, 50)
        
        # Labs (Some pending, some completed)
        create_assessment(sub4_7, "Experiment 1", AssessmentType.ASSIGNMENT, AssessmentCategory.LABORATORY, 10, 9, 20)
        create_assessment(sub4_7, "Lab Final", AssessmentType.END_SEMESTER, AssessmentCategory.LABORATORY, 50, None, 80)
        
        create_assessment(sub4_8, "Experiment 1", AssessmentType.ASSIGNMENT, AssessmentCategory.LABORATORY, 10, 7, 20)
        create_assessment(sub4_8, "Lab Final", AssessmentType.END_SEMESTER, AssessmentCategory.LABORATORY, 50, None, 80)
        
        create_assessment(sub4_9, "Experiment 1", AssessmentType.ASSIGNMENT, AssessmentCategory.LABORATORY, 10, 8, 20)
        create_assessment(sub4_9, "Lab Final", AssessmentType.END_SEMESTER, AssessmentCategory.LABORATORY, 50, None, 80)
        
        db.commit()
        print("Demo Database Seeded Successfully.")
        
    except Exception as e:
        print(f"Error seeding database: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_db()
