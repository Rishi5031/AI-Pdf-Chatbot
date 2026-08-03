import os
import uuid
import shutil
from pathlib import Path
from datetime import datetime
from sqlalchemy.orm import Session
# pyrefly: ignore [missing-import]
from fastapi import HTTPException, UploadFile, status

from app.models.user import User
from app.models.conversation import Conversation
from app.models.document import Document
from app.models.message import Message
from app.schemas.profile_schema import (
    AccountStatistics,
    ProfileResponse,
    ProfileUpdateRequest,
    ChangePasswordRequest
)
from app.auth.hashing import verify_password, hash_password
from app.services.vectorstore import delete_from_vector_store

AVATAR_UPLOAD_DIR = Path("app/uploaded_files/avatars")
AVATAR_UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

ALLOWED_IMAGE_TYPES = {"image/jpeg", "image/jpg", "image/png", "image/webp"}
ALLOWED_IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp"}
MAX_AVATAR_SIZE_BYTES = 5 * 1024 * 1024  # 5 MB


def get_account_statistics(db: Session, user: User) -> AccountStatistics:
    """
    Calculate and return statistics for the user's account.
    """
    conversations_count = (
        db.query(Conversation).filter(Conversation.user_id == user.id).count()
    )
    
    documents_count = (
        db.query(Document)
        .join(Conversation, Document.conversation_id == Conversation.id)
        .filter(Conversation.user_id == user.id)
        .count()
    )
    
    messages_count = (
        db.query(Message)
        .join(Conversation, Message.conversation_id == Conversation.id)
        .filter(Conversation.user_id == user.id)
        .count()
    )

    return AccountStatistics(
        conversations=conversations_count,
        documents=documents_count,
        messages=messages_count
    )


def get_profile(db: Session, user: User) -> ProfileResponse:
    """
    Retrieve user profile and account statistics.
    """
    db_user = db.query(User).filter(User.id == user.id).first()
    if not db_user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
        
    stats = get_account_statistics(db, db_user)
    
    profile_img = db_user.profile_image or db_user.profile_picture

    return ProfileResponse(
        id=db_user.id,
        name=db_user.name,
        email=db_user.email,
        profile_image=profile_img,
        bio=db_user.bio,
        created_at=db_user.created_at,
        statistics=stats
    )


def update_profile(db: Session, user: User, request: ProfileUpdateRequest) -> ProfileResponse:
    """
    Update user profile information (Name and Bio). Email remains read-only.
    """
    db_user = db.query(User).filter(User.id == user.id).first()
    if not db_user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    db_user.name = request.name
    db_user.bio = request.bio
    db_user.updated_at = datetime.utcnow()

    try:
        db.commit()
        db.refresh(db_user)
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update profile in database."
        )

    return get_profile(db, db_user)


def upload_avatar(db: Session, user: User, file: UploadFile) -> ProfileResponse:
    """
    Upload or replace profile picture (JPG, PNG, WEBP; max 5MB).
    """
    db_user = db.query(User).filter(User.id == user.id).first()
    if not db_user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    file_ext = Path(file.filename).suffix.lower() if file.filename else ""
    if file.content_type not in ALLOWED_IMAGE_TYPES or file_ext not in ALLOWED_IMAGE_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid image format. Allowed formats: JPG, PNG, WEBP."
        )

    # Read content to verify size limit
    file.file.seek(0, os.SEEK_END)
    file_size = file.file.tell()
    file.file.seek(0)

    if file_size > MAX_AVATAR_SIZE_BYTES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File size exceeds the maximum limit of 5 MB."
        )

    # Clean up previous local profile image if present
    if db_user.profile_image and db_user.profile_image.startswith("/uploaded_files/avatars/"):
        old_file_name = Path(db_user.profile_image).name
        old_file_path = AVATAR_UPLOAD_DIR / old_file_name
        if old_file_path.exists():
            try:
                old_file_path.unlink()
            except Exception:
                pass

    unique_filename = f"avatar_user_{user.id}_{uuid.uuid4().hex}{file_ext}"
    target_path = AVATAR_UPLOAD_DIR / unique_filename

    try:
        with target_path.open("wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to save profile picture on disk."
        )

    avatar_url = f"/uploaded_files/avatars/{unique_filename}"
    db_user.profile_image = avatar_url
    db_user.profile_picture = avatar_url
    db_user.updated_at = datetime.utcnow()

    try:
        db.commit()
        db.refresh(db_user)
    except Exception as e:
        db.rollback()
        if target_path.exists():
            target_path.unlink()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Database transaction failed during avatar update."
        )

    return get_profile(db, db_user)


def change_password(db: Session, user: User, request: ChangePasswordRequest) -> dict:
    """
    Change password for local authenticated users.
    Google users are rejected with an error.
    """
    db_user = db.query(User).filter(User.id == user.id).first()
    if not db_user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    if db_user.provider == "google" or db_user.password_hash is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Google-authenticated users cannot change passwords through the application."
        )

    if not verify_password(request.current_password, db_user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incorrect current password."
        )

    db_user.password_hash = hash_password(request.new_password)
    db_user.updated_at = datetime.utcnow()

    try:
        db.commit()
        db.refresh(db_user)
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update password."
        )

    return {"message": "Password changed successfully."}


def delete_account(db: Session, user: User) -> dict:
    """
    Delete authenticated user's account and all associated resources:
    1. Delete messages
    2. Delete conversations
    3. Delete documents
    4. Delete uploaded files on disk
    5. Delete vectors from vector store (Pinecone)
    6. Delete user record
    """
    db_user = db.query(User).filter(User.id == user.id).first()
    if not db_user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    try:
        # Fetch all user conversations
        conversations = db.query(Conversation).filter(Conversation.user_id == db_user.id).all()

        for conv in conversations:
            # Delete physical document files associated with conversation
            documents = db.query(Document).filter(Document.conversation_id == conv.id).all()
            for doc in documents:
                if doc.file_path and os.path.exists(doc.file_path):
                    try:
                        os.remove(doc.file_path)
                    except Exception as e:
                        print(f"Error deleting file {doc.file_path}: {e}")

            # Delete vectors from Pinecone vector store
            try:
                delete_from_vector_store(conv.id)
            except Exception as e:
                print(f"Error deleting vectors for conversation {conv.id}: {e}")

            # Delete messages and documents explicitly if needed
            db.query(Message).filter(Message.conversation_id == conv.id).delete(synchronize_session=False)
            db.query(Document).filter(Document.conversation_id == conv.id).delete(synchronize_session=False)
            db.delete(conv)

        # Remove local avatar image if stored on disk
        if db_user.profile_image and db_user.profile_image.startswith("/uploaded_files/avatars/"):
            avatar_name = Path(db_user.profile_image).name
            avatar_path = AVATAR_UPLOAD_DIR / avatar_name
            if avatar_path.exists():
                try:
                    avatar_path.unlink()
                except Exception as e:
                    print(f"Error deleting avatar {avatar_path}: {e}")

        # Delete user record
        db.delete(db_user)
        db.commit()

        return {"message": "Account deleted successfully."}

    except Exception as e:
        db.rollback()
        print(f"Database error during account deletion: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete user account. Transaction rolled back."
        )
