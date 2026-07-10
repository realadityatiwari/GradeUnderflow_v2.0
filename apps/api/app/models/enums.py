from enum import Enum

class SemesterType(str, Enum):
    ODD = "ODD"
    EVEN = "EVEN"
    SUMMER = "SUMMER"
    WINTER = "WINTER"

class SemesterStatus(str, Enum):
    CURRENT = "CURRENT"
    COMPLETED = "COMPLETED"
    ARCHIVED = "ARCHIVED"

class SubjectType(str, Enum):
    THEORY = "THEORY"
    LABORATORY = "LABORATORY"

class AssessmentType(str, Enum):
    ASSIGNMENT = "ASSIGNMENT"
    QUIZ = "QUIZ"
    SURPRISE_TEST = "SURPRISE_TEST"
    PRE_END = "PRE_END"
    END_SEMESTER = "END_SEMESTER"

class AssessmentCategory(str, Enum):
    THEORY = "THEORY"
    LABORATORY = "LABORATORY"

class AssessmentStatus(str, Enum):
    NOT_STARTED = "NOT_STARTED"
    IN_PROGRESS = "IN_PROGRESS"
    SUBMITTED = "SUBMITTED"
    CHECKED = "CHECKED"
