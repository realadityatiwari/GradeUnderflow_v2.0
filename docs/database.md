# Database Schema

GradeUnderflow uses PostgreSQL, structured relationally with cascading relationships. The database utilizes UUIDs for secure and non-sequential primary keys.

## Core Entities

### User
Represents an authenticated student on the platform.
- `id` (UUID)
- `email` (String, Unique)
- `password_hash` (String)

### Semester
A specific academic term belonging to a User.
- `id` (UUID)
- `user_id` (UUID) - *FK to User*
- `name` (String)
- `academic_year` (String) - *Regex validated: YYYY-YY*
- `semester_type` (Enum: ODD, EVEN, SUMMER)
- `status` (Enum: PLANNED, CURRENT, COMPLETED)

### Subject
An academic course within a Semester.
- `id` (UUID)
- `semester_id` (UUID) - *FK to Semester*
- `code` (String)
- `name` (String)
- `credits` (Integer)
- `subject_type` (Enum: THEORY, LABORATORY, PROJECT)

### Assessment
A planned evaluation within a Subject.
- `id` (UUID)
- `subject_id` (UUID) - *FK to Subject*
- `assessment_type` (Enum: PRE_END, ASSIGNMENT, QUIZ, END_SEMESTER, etc.)
- `title` (String)
- `max_marks` (Integer)
- `weightage` (Integer)

### AssessmentResult
A 1:1 relationship with an `Assessment`, tracking the student's performance.
- `id` (UUID)
- `assessment_id` (UUID) - *FK to Assessment, Unique*
- `status` (Enum: NOT_STARTED, SUBMITTED, CHECKED)
- `obtained_marks` (Integer, Nullable)

## Integrity Constraints
- **Cascading Deletes:** Deleting a `Semester` cascades downward, automatically removing all associated `Subjects`, `Assessments`, and `AssessmentResults`.
- **Enums:** Core logic relies strictly on PostgreSQL `ENUM` types to prevent invalid states.
