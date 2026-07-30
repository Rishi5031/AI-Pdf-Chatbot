import shutil
from pathlib import Path
# pyrefly: ignore [missing-import]
from fastapi import APIRouter, File, Form, HTTPException, UploadFile, Depends
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.services.conversation_service import get_conversation_by_id
from app.services.document_service import create_document
from app.services.pdf_service import load_and_split_pdf
from app.services.vectorstore import create_vector_store
from app.services.embedding import get_embedding_model

router = APIRouter(prefix="/api", tags=["Upload"])

UPLOAD_DIR = Path("app/uploaded_files")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

@router.post("/upload")
async def upload_pdf(
    file: UploadFile = File(...),  
    conversation_id: int = Form(...),
    db: Session = Depends(get_db)
):
    if file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="Only PDF files are allowed.")

    # Validate conversation exists
    conv = get_conversation_by_id(db, conversation_id)
    if not conv:
        raise HTTPException(status_code=404, detail="Conversation not found")

    file_path = UPLOAD_DIR / file.filename
    
    try:
        with file_path.open("wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        # Register document in DB
        doc = create_document(
            db=db, 
            conversation_id=conversation_id, 
            filename=file.filename, 
            file_path=str(file_path)
        )

        chunks = load_and_split_pdf(str(file_path))

        # Add conversation isolation metadata
        for chunk in chunks:
            chunk.metadata["conversation_id"] = conversation_id
            chunk.metadata["document_id"] = doc.id
            chunk.metadata["filename"] = file.filename
            
        embedding_model = get_embedding_model()

        create_vector_store(
            documents=chunks,
            embedding_model=embedding_model,
        )

        return {
            "message": "PDF uploaded successfully",
            "document_id": doc.id,
            "filename": file.filename,
            "total_chunks": len(chunks),
        }
    except Exception as e:
        print(f"Error during upload: {e}")
        # Clean up file on failure
        if file_path.exists():
            file_path.unlink()
        raise HTTPException(status_code=500, detail="Failed to process uploaded document.")