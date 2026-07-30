from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.schemas.password_reset_schema import (
    ForgotPasswordRequest, 
    ForgotPasswordResponse, 
    ResetPasswordRequest, 
    ResetPasswordResponse
)
from app.services.password_reset_service import request_password_reset, reset_password

router = APIRouter(
    prefix="/api/auth",
    tags=["Authentication"]
)

@router.post("/forgot-password", response_model=ForgotPasswordResponse)
async def forgot_password(request: ForgotPasswordRequest, db: Session = Depends(get_db)):
    """
    Initiate the password reset flow.
    Sends a secure token to the user's email if the account exists.
    """
    # Notice we await this because send_password_reset_email is async
    return await request_password_reset(db, request)

@router.post("/reset-password", response_model=ResetPasswordResponse)
def reset_password_endpoint(request: ResetPasswordRequest, db: Session = Depends(get_db)):
    """
    Reset a user's password using the token sent to their email.
    """
    return reset_password(db, request)
