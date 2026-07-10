from typing import Optional
from uuid import UUID

from app.models.user import User
from app.schemas.user import UserCreate
from sqlalchemy.orm import Session
from app.core.security import get_password_hash


class UserRepository:
    def get_by_email(self, db: Session, email: str) -> Optional[User]:
        return db.query(User).filter(User.email == email).first()

    def get_by_id(self, db: Session, user_id: UUID) -> Optional[User]:
        return db.query(User).filter(User.id == user_id).first()

    def create(self, db: Session, obj_in: UserCreate) -> User:
        db_obj = User(
            email=obj_in.email,  # type: ignore
            password_hash=get_password_hash(obj_in.password),  # type: ignore
            full_name=obj_in.full_name,  # type: ignore
        )
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

user_repository = UserRepository()
