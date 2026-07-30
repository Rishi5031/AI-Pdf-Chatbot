from sqlalchemy.orm import Session
from app.models.document import Document

def create_document(db: Session, conversation_id: int, filename: str, file_path: str):
    document = Document(
        conversation_id=conversation_id,
        filename=filename,
        file_path=file_path
    )
    db.add(document)
    db.commit()
    db.refresh(document)
    return document

def get_documents_by_conversation(db: Session, conversation_id: int):
    return db.query(Document).filter(Document.conversation_id == conversation_id).all()

def delete_document(db: Session, document_id: int):
    document = db.query(Document).filter(Document.id == document_id).first()
    if document:
        db.delete(document)
        db.commit()
        return True
    return False
