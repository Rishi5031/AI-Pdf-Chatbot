# pyrefly: ignore [missing-import]
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.schemas.auth_schema import RegisterRequest, LoginRequest, TokenResponse, GoogleLoginRequest
from app.schemas.user_schema import UserResponse
from app.services.auth_service import register_user, authenticate_user, authenticate_google_user
from app.auth.dependencies import get_current_user
from app.models.user import User

router = APIRouter(prefix="/api/auth", tags=["Auth"])

@router.post("/register", response_model=UserResponse)
def register(request: RegisterRequest, db: Session = Depends(get_db)):
    return register_user(db, request)

@router.post("/login", response_model=TokenResponse)
def login(request: LoginRequest, db: Session = Depends(get_db)):
    return authenticate_user(db, request)

@router.post("/google", response_model=TokenResponse)
def google_login(request: GoogleLoginRequest, db: Session = Depends(get_db)):
    return authenticate_google_user(db, request)

@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user
