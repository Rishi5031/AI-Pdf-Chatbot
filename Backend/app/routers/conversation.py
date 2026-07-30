# pyrefly: ignore [missing-import]
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.database.connection import get_db
from app.services.conversation_service import (
    create_conversation,
    get_all_conversations,
    get_conversation_by_id,
    delete_conversation
)
from app.services.message_service import get_messages_by_conversation
from app.schemas.conversation_schema import ConversationResponse
from app.schemas.message_schema import MessageResponse

router = APIRouter(prefix="/api/conversations", tags=["Conversations"])

@router.post("", response_model=ConversationResponse)
def create_chat(db: Session = Depends(get_db)):
    return create_conversation(db)

@router.get("", response_model=List[ConversationResponse])
def get_chats(db: Session = Depends(get_db)):
    return get_all_conversations(db)

@router.get("/{conversation_id}/messages", response_model=List[MessageResponse])
def chat_history(conversation_id: int, db: Session = Depends(get_db)):
    # Validate conversation exists
    conv = get_conversation_by_id(db, conversation_id)
    if not conv:
        raise HTTPException(status_code=404, detail="Conversation not found")
    
    return get_messages_by_conversation(db, conversation_id)

@router.delete("/{conversation_id}")
def delete_chat(conversation_id: int, db: Session = Depends(get_db)):
    success = delete_conversation(db, conversation_id)
    if not success:
        raise HTTPException(status_code=404, detail="Conversation not found")
    return {"message": "Conversation deleted successfully"}
