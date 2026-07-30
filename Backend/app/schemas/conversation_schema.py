from pydantic import BaseModel
from datetime import datetime

class ConversationRename(BaseModel):
    title: str

class ConversationResponse(BaseModel):
    id: int
    title: str
    is_pinned: bool = False
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
