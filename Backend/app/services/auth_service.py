from sqlalchemy.orm import Session
# pyrefly: ignore [missing-import]
from fastapi import HTTPException
from app.schemas.auth_schema import RegisterRequest, LoginRequest, TokenResponse, GoogleLoginRequest
from app.services.user_service import get_user_by_email, create_user, create_google_user
from app.auth.hashing import verify_password
from app.auth.jwt import create_access_token
from app.auth.google_auth import verify_google_token

def register_user(db: Session, request: RegisterRequest) -> dict:
    existing_user = get_user_by_email(db, request.email)
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    user = create_user(db, request)
    return user

def authenticate_user(db: Session, request: LoginRequest) -> TokenResponse:
    user = get_user_by_email(db, request.email)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    if user.provider != "local":
        raise HTTPException(status_code=401, detail="Please login with your provider")
        
    if not verify_password(request.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid email or password")
        
    access_token = create_access_token(data={"sub": str(user.id), "email": user.email})
    return TokenResponse(access_token=access_token, user=user)

def authenticate_google_user(db: Session, request: GoogleLoginRequest) -> TokenResponse:
    idinfo = verify_google_token(request.token)
    
    email = idinfo.get("email")
    name = idinfo.get("name")
    google_id = idinfo.get("sub")
    picture = idinfo.get("picture")
    
    if not email:
        raise HTTPException(status_code=400, detail="Email not provided by Google")
        
    user = get_user_by_email(db, email)
    if not user:
        user = create_google_user(db, email, name, google_id, picture)
        
    access_token = create_access_token(data={"sub": str(user.id), "email": user.email})
    return TokenResponse(access_token=access_token, user=user)
