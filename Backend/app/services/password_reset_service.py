import secrets
import hashlib
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
# pyrefly: ignore [missing-import]
from fastapi import HTTPException
import re

from app.models.user import User
from app.models.password_reset import PasswordResetToken
from app.schemas.password_reset_schema import ForgotPasswordRequest, ResetPasswordRequest
from app.services.email_service import send_password_reset_email
from app.auth.hashing import hash_password

TOKEN_EXPIRATION_MINUTES = 30

def _hash_token(token: str) -> str:
    """Hash the raw token using SHA-256 for secure DB storage."""
    return hashlib.sha256(token.encode('utf-8')).hexdigest()

def _validate_password_strength(password: str):
    """Enforce strong password rules."""
    if len(password) < 8:
        raise HTTPException(status_code=400, detail="Password must be at least 8 characters long")
    if not re.search(r"[A-Z]", password):
        raise HTTPException(status_code=400, detail="Password must contain at least one uppercase letter")
    if not re.search(r"[a-z]", password):
        raise HTTPException(status_code=400, detail="Password must contain at least one lowercase letter")
    if not re.search(r"[0-9]", password):
        raise HTTPException(status_code=400, detail="Password must contain at least one number")

async def request_password_reset(db: Session, request: ForgotPasswordRequest):
    """
    Handle forgot password request:
    1. Check if user exists (fail silently if not to prevent email enumeration).
    2. Generate raw token and hash it.
    3. Store hashed token in DB.
    4. Send email with raw token.
    """
    user = db.query(User).filter(User.email == request.email).first()
    
    # We do NOT raise an exception if the user doesn't exist
    # to prevent email enumeration attacks.
    if user:
        # Generate cryptographically secure token
        raw_token = secrets.token_urlsafe(32)
        hashed_token = _hash_token(raw_token)
        
        # Calculate expiration
        expires_at = datetime.utcnow() + timedelta(minutes=TOKEN_EXPIRATION_MINUTES)
        
        # Store in DB
        reset_token_entry = PasswordResetToken(
            user_id=user.id,
            hashed_token=hashed_token,
            expires_at=expires_at
        )
        db.add(reset_token_entry)
        db.commit()
        
        # Send Email
        await send_password_reset_email(email_to=user.email, reset_token=raw_token)
        
    return {"message": "If an account exists with this email, a password reset link has been sent."}


def reset_password(db: Session, request: ResetPasswordRequest):
    """
    Handle reset password request:
    1. Verify passwords match and meet strength requirements.
    2. Hash incoming token.
    3. Find in DB, verify expiration, and verify not used.
    4. Update user password.
    5. Invalidate token.
    """
    if request.password != request.confirm_password:
        raise HTTPException(status_code=400, detail="Passwords do not match")
        
    _validate_password_strength(request.password)
    
    # Hash the incoming token to look it up in the database
    hashed_incoming_token = _hash_token(request.token)
    
    token_entry = db.query(PasswordResetToken).filter(
        PasswordResetToken.hashed_token == hashed_incoming_token
    ).first()
    
    if not token_entry:
        raise HTTPException(status_code=400, detail="Invalid or expired reset token.")
        
    if token_entry.used_at is not None:
        raise HTTPException(status_code=400, detail="This reset link has already been used.")
        
    if token_entry.expires_at < datetime.utcnow():
        raise HTTPException(status_code=400, detail="Reset link has expired.")
        
    # Get user
    user = db.query(User).filter(User.id == token_entry.user_id).first()
    if not user:
        raise HTTPException(status_code=400, detail="User no longer exists.")
        
    # Security enhancement: Only allow local provider users to reset password?
    # If they use google, maybe they shouldn't have a local password, but if they want to 
    # set one, it's fine. We will allow it.
    
    try:
        # Update user's password
        user.password_hash = hash_password(request.password)
        
        # Invalidate token
        token_entry.used_at = datetime.utcnow()
        
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail="Database error occurred while resetting password.")
        
    return {"message": "Password has been successfully reset. You can now log in."}
