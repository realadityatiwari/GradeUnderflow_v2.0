from typing import Tuple

def determine_grade(marks: float) -> Tuple[str, int, bool]:
    """
    Implements the AKTU grading table.
    90-100 -> A+ -> GP 10
    80-89  -> A  -> GP 9
    70-79  -> B+ -> GP 8
    60-69  -> B  -> GP 7
    50-59  -> C  -> GP 6
    45-49  -> D  -> GP 5
    40-44  -> E  -> GP 4
    Below 40 -> F -> GP 0
    Returns: (grade, grade_point, passed)
    """
    rounded_marks = round(marks)
    
    if rounded_marks >= 90:
        return "A+", 10, True
    elif rounded_marks >= 80:
        return "A", 9, True
    elif rounded_marks >= 70:
        return "B+", 8, True
    elif rounded_marks >= 60:
        return "B", 7, True
    elif rounded_marks >= 50:
        return "C", 6, True
    elif rounded_marks >= 45:
        return "D", 5, True
    elif rounded_marks >= 40:
        return "E", 4, True
    else:
        return "F", 0, False
