from typing import List
# pyrefly: ignore [missing-import]
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
# pyrefly: ignore [missing-import]
from fastapi.responses import Response
import os

from app.database.connection import get_db
from app.auth.dependencies import get_current_user, get_current_user_from_query
from app.models.user import User
from app.schemas.document_schema import DocumentResponse
from app.services.conversation_service import get_conversation_by_id
from app.services.document_service import get_documents_by_conversation, get_document_by_id, delete_document
from app.services.vectorstore import delete_document_vectors

router = APIRouter(prefix="/api", tags=["Document"])

@router.get("/conversations/{conversation_id}/documents", response_model=List[DocumentResponse])
def get_documents_for_conversation(
    conversation_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Verify conversation ownership
    conv = get_conversation_by_id(db, conversation_id, current_user.id)
    if not conv:
        raise HTTPException(status_code=403, detail="Conversation not found or access denied")
    
    docs = get_documents_by_conversation(db, conversation_id)
    return docs

@router.get("/documents/{document_id}", response_model=DocumentResponse)
def get_document(
    document_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    doc = get_document_by_id(db, document_id)
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
        
    # Verify ownership through conversation
    conv = get_conversation_by_id(db, doc.conversation_id, current_user.id)
    if not conv:
        raise HTTPException(status_code=403, detail="Access denied")
        
    return doc

@router.delete("/documents/{document_id}")
def delete_document_endpoint(
    document_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    doc = get_document_by_id(db, document_id)
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
        
    # Verify ownership through conversation
    conv = get_conversation_by_id(db, doc.conversation_id, current_user.id)
    if not conv:
        raise HTTPException(status_code=403, detail="Access denied")
        
    # Delete vectors from Pinecone vector store
    delete_document_vectors(document_id)
    
    # Delete from database (which also removes file from disk via our updated service)
    success = delete_document(db, document_id)
    if not success:
        raise HTTPException(status_code=500, detail="Failed to delete document record")
        
    return {"message": "Document deleted successfully"}

@router.get("/documents/{document_id}/file")
def get_document_file(
    document_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    doc = get_document_by_id(db, document_id)
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
        
    # Verify ownership through conversation
    conv = get_conversation_by_id(db, doc.conversation_id, current_user.id)
    if not conv:
        raise HTTPException(status_code=403, detail="Access denied")
        
    if not doc.file_path or not os.path.exists(doc.file_path):
        raise HTTPException(status_code=404, detail="File not found on disk")
        
    with open(doc.file_path, "rb") as f:
        content = f.read()
        
    headers = {
        "Content-Disposition": "inline",
        "Content-Type": "application/pdf"
    }
        
    return Response(content=content, media_type="application/pdf", headers=headers)
