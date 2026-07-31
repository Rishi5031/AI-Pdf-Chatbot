from pydantic import BaseModel
from typing import Optional

class ChatRequest(BaseModel):
    conversation_id: int
    question: str

class ChatResponse(BaseModel):
    answer: str
    title: Optional[str] = None
