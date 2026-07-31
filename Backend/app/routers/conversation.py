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
from app.schemas.conversation_schema import ConversationResponse, ConversationRename
from app.schemas.message_schema import MessageResponse
from app.schemas.suggested_question_schema import SuggestedQuestionResponse
from app.services.suggested_question_service import get_suggested_questions
from app.auth.dependencies import get_current_user
from app.models.user import User

router = APIRouter(prefix="/api/conversations", tags=["Conversations"])

@router.post("", response_model=ConversationResponse)
def create_chat(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return create_conversation(db, current_user.id)

@router.get("", response_model=List[ConversationResponse])
def get_chats(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return get_all_conversations(db, current_user.id)

@router.get("/{conversation_id}/messages", response_model=List[MessageResponse])
def chat_history(conversation_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    # Validate conversation exists and belongs to user
    conv = get_conversation_by_id(db, conversation_id, current_user.id)
    if not conv:
        raise HTTPException(status_code=404, detail="Conversation not found")
    
    return get_messages_by_conversation(db, conversation_id)

@router.delete("/{conversation_id}")
def delete_chat(conversation_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    success = delete_conversation(db, conversation_id, current_user.id)
    if not success:
        raise HTTPException(status_code=404, detail="Conversation not found")
    return {"message": "Conversation deleted successfully"}

@router.patch("/{conversation_id}/pin", response_model=ConversationResponse)
def toggle_pin_chat(conversation_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    conv = get_conversation_by_id(db, conversation_id, current_user.id)
    if not conv:
        raise HTTPException(status_code=404, detail="Conversation not found")
    
    conv.is_pinned = not conv.is_pinned
    db.commit()
    db.refresh(conv)
    return conv

@router.patch("/{conversation_id}/rename", response_model=ConversationResponse)
def rename_chat(conversation_id: int, request: ConversationRename, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    conv = get_conversation_by_id(db, conversation_id, current_user.id)
    if not conv:
        raise HTTPException(status_code=404, detail="Conversation not found")
    
    conv.title = request.title
    db.commit()
    db.refresh(conv)
    return conv

@router.get("/{conversation_id}/suggestions", response_model=List[SuggestedQuestionResponse])
def get_conversation_suggestions(conversation_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    conv = get_conversation_by_id(db, conversation_id, current_user.id)
    if not conv:
        raise HTTPException(status_code=404, detail="Conversation not found")
    
    return get_suggested_questions(db, conversation_id)
