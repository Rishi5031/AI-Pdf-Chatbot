from sqlalchemy.orm import Session
from app.models.conversation import Conversation
from app.models.message import Message
from app.models.document import Document
from app.services.vectorstore import delete_from_vector_store

def create_conversation(db: Session, user_id: int, title: str = "new chat"):
    conversation = Conversation(title=title, user_id=user_id)
    db.add(conversation)
    db.commit()
    db.refresh(conversation)
    return conversation

def get_all_conversations(db: Session, user_id: int):
    return db.query(Conversation).filter(Conversation.user_id == user_id).order_by(Conversation.created_at.desc()).all()

def get_conversation_by_id(db: Session, conversation_id: int, user_id: int):
    return db.query(Conversation).filter(Conversation.id == conversation_id, Conversation.user_id == user_id).first()

def delete_conversation(db: Session, conversation_id: int, user_id: int):
    conversation = db.query(Conversation).filter(Conversation.id == conversation_id, Conversation.user_id == user_id).first()
    if conversation:
        # Delete related vectors from vector store (Pinecone)
        delete_from_vector_store(conversation_id)
        
        db.delete(conversation)
        db.commit()
        return True
    return False
