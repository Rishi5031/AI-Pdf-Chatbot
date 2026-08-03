from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime

class AccountStatistics(BaseModel):
    conversations: int
    documents: int
    messages: int

class ProfileResponse(BaseModel):
    id: int
    name: str
    email: EmailStr
    profile_image: Optional[str] = None
    bio: Optional[str] = None
    created_at: datetime
    statistics: AccountStatistics

    class Config:
        from_attributes = True

class ProfileUpdateRequest(BaseModel):
    name: str = Field(..., min_length=2, max_length=100, description="Full Name must be between 2 and 100 characters")
    bio: Optional[str] = Field(None, max_length=500, description="Bio maximum 500 characters")

class ChangePasswordRequest(BaseModel):
    current_password: str = Field(..., min_length=1, description="Current password is required")
    new_password: str = Field(..., min_length=6, description="New password must be at least 6 characters")
