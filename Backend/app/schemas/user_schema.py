from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional

class UserBase(BaseModel):
    name: str
    email: EmailStr

class UserResponse(UserBase):
    id: int
    provider: str
    profile_picture: Optional[str] = None
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True
