from sqlalchemy.orm import Session
from app.models.user import User
from app.schemas.auth_schema import RegisterRequest
from app.auth.hashing import hash_password

def get_user_by_email(db: Session, email: str) -> User:
    return db.query(User).filter(User.email == email).first()

def get_user_by_id(db: Session, user_id: int) -> User:
    return db.query(User).filter(User.id == user_id).first()

def create_user(db: Session, user_in: RegisterRequest) -> User:
    hashed_password = hash_password(user_in.password)
    db_user = User(
        name=user_in.name,
        email=user_in.email,
        password_hash=hashed_password,
        provider="local"
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def create_google_user(db: Session, email: str, name: str, google_id: str, profile_picture: str = None) -> User:
    db_user = User(
        name=name,
        email=email,
        provider="google",
        google_id=google_id,
        profile_picture=profile_picture
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user
