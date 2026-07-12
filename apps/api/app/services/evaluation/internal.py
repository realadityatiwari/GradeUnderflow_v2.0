from typing import List
from app.models.assessment import Assessment
from app.models.enums import AssessmentType
from app.schemas.evaluation import CategoryContribution, InternalEvaluation
from app.services.evaluation.utils import calculate_percentage, calculate_contribution

def calculate_category(assessments: List[Assessment], target_type: AssessmentType, max_contribution: float) -> CategoryContribution:
    """
    Calculates the contribution for a specific category based on its assessments.
    """
    category_assessments = [a for a in assessments if a.assessment_type == target_type]
    
    total_max = 0.0
    total_obtained = 0.0
    
    for assessment in category_assessments:
        if assessment.result and assessment.result.obtained_marks is not None:
            total_max += assessment.max_marks
            total_obtained += assessment.result.obtained_marks
            
    if total_max == 0:
        return CategoryContribution(percentage=0.0, contribution=0.0)
        
    percentage = calculate_percentage(total_obtained, total_max)
    contribution = calculate_contribution(percentage, max_contribution)
    
    return CategoryContribution(
        percentage=round(percentage, 2),
        contribution=round(contribution, 2)
    )

def evaluate_internal(assessments: List[Assessment]) -> InternalEvaluation:
    """
    Calculates the internal evaluation breakdown based on AKTU rules.
    Max Internal = 30
    Assignments = 20% -> 6 marks
    Quiz = 30% -> 9 marks
    Surprise Test = 20% -> 6 marks
    Pre-End = 30% -> 9 marks
    """
    assignment = calculate_category(assessments, AssessmentType.ASSIGNMENT, max_contribution=6.0)
    quiz = calculate_category(assessments, AssessmentType.QUIZ, max_contribution=9.0)
    surprise = calculate_category(assessments, AssessmentType.SURPRISE_TEST, max_contribution=6.0)
    pre_end = calculate_category(assessments, AssessmentType.PRE_END, max_contribution=9.0)
    
    total = sum([
        assignment.contribution,
        quiz.contribution,
        surprise.contribution,
        pre_end.contribution
    ])
    
    return InternalEvaluation(
        assignment=assignment,
        quiz=quiz,
        surprise=surprise,
        pre_end=pre_end,
        total=round(total, 2)
    )
