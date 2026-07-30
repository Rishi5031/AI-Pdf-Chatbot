from sqlalchemy.orm import Session
from app.models.conversation import Conversation
from app.models.message import Message
from app.models.document import Document
from app.services.vectorstore import delete_from_vector_store

def create_conversation(db: Session, title: str = "new chat"):
    conversation = Conversation(title=title)
    db.add(conversation)
    db.commit()
    db.refresh(conversation)
    return conversation

def get_all_conversations(db: Session):
    return db.query(Conversation).order_by(Conversation.created_at.desc()).all()

def get_conversation_by_id(db: Session, conversation_id: int):
    return db.query(Conversation).filter(Conversation.id == conversation_id).first()

def delete_conversation(db: Session, conversation_id: int):
    conversation = db.query(Conversation).filter(Conversation.id == conversation_id).first()
    if conversation:
        # Delete related vectors from chroma
        delete_from_vector_store(conversation_id)
        
        db.delete(conversation)
        db.commit()
        return True
    return False
