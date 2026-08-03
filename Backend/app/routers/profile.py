# pyrefly: ignore [missing-import]
from fastapi import APIRouter, Depends, File, UploadFile, status
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.auth.dependencies import get_current_user
from app.models.user import User
from app.schemas.profile_schema import (
    ProfileResponse,
    ProfileUpdateRequest,
    ChangePasswordRequest
)
from app.services.profile_service import (
    get_profile,
    update_profile,
    upload_avatar,
    change_password,
    delete_account
)

router = APIRouter(prefix="/api/profile", tags=["Profile"])


@router.get("", response_model=ProfileResponse, status_code=status.HTTP_200_OK)
def get_user_profile(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Retrieve logged-in user's profile and account statistics.
    """
    return get_profile(db=db, user=current_user)


@router.put("", response_model=ProfileResponse, status_code=status.HTTP_200_OK)
def update_user_profile(
    request: ProfileUpdateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Update logged-in user's profile information (Name and Bio). Email is read-only.
    """
    return update_profile(db=db, user=current_user, request=request)


@router.post("/avatar", response_model=ProfileResponse, status_code=status.HTTP_200_OK)
def upload_user_avatar(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Upload or replace profile avatar image (JPG, PNG, WEBP, max 5MB).
    """
    return upload_avatar(db=db, user=current_user, file=file)


@router.put("/change-password", status_code=status.HTTP_200_OK)
def change_user_password(
    request: ChangePasswordRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Change password for local authenticated user. Google users are rejected with HTTP 400.
    """
    return change_password(db=db, user=current_user, request=request)


@router.delete("", status_code=status.HTTP_200_OK)
def delete_user_account(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Delete logged-in user's account, conversations, messages, documents, uploaded files, and vectors.
    """
    return delete_account(db=db, user=current_user)
