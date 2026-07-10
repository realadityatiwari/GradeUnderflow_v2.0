from typing import Any

from app.dependencies.auth import get_current_user
from app.models.user import User
from app.schemas.user import UserResponse
from fastapi import APIRouter, Depends

router = APIRouter()


@router.get("/me", response_model=UserResponse)
def read_user_me(
    current_user: User = Depends(get_current_user),
) -> Any:
    """
    Get current user.
    """
    return current_user
