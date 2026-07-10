from typing import Optional

from app.core.security import verify_password
from app.models.user import User
from app.repositories.user import user_repository
from app.schemas.user import UserCreate
from fastapi import HTTPException
from sqlalchemy.orm import Session


class AuthService:
    def register(self, db: Session, user_in: UserCreate) -> User:
        user = user_repository.get_by_email(db, email=user_in.email)
        if user:
            raise HTTPException(
                status_code=400,
                detail="The user with this email already exists in the system.",
            )
        user = user_repository.create(db, obj_in=user_in)
        return user

    def authenticate(
        self, db: Session, email: str, password: str
    ) -> Optional[User]:
        user = user_repository.get_by_email(db, email=email)
        if not user:
            return None
        if not verify_password(password, user.password_hash):
            return None
        return user

auth_service = AuthService()
