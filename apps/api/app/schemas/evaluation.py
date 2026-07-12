from pydantic import BaseModel

class CategoryContribution(BaseModel):
    percentage: float
    contribution: float

class InternalEvaluation(BaseModel):
    assignment: CategoryContribution
    quiz: CategoryContribution
    surprise: CategoryContribution
    pre_end: CategoryContribution
    total: float

class ExternalEvaluation(BaseModel):
    percentage: float
    marks: float

class FinalEvaluation(BaseModel):
    marks: float
    percentage: float
    grade: str
    grade_point: int
    passed: bool

class EvaluationResultResponse(BaseModel):
    internal: InternalEvaluation
    external: ExternalEvaluation
    final: FinalEvaluation
