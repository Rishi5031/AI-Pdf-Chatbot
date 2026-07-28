# upload.py

from app.services.vectorstore import create_vector_store
from app.services.embedding import get_embedding_model
from pathlib import Path
import shutil

# pyrefly: ignore [missing-import]
from fastapi import APIRouter, File, HTTPException, UploadFile, Form
from app.services.pdf_service import load_and_split_pdf

router = APIRouter(prefix="/api", tags=["Upload"])

UPLOAD_DIR = Path("app/uploaded_files")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)


@router.post("/upload")
async def upload_pdf(file: UploadFile = File(...),  session_id: str = Form(...)):
    if file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="Only PDF files are allowed.")

    file_path = UPLOAD_DIR / file.filename

    with file_path.open("wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    chunks = load_and_split_pdf(str(file_path))

    for chunk in chunks:
        chunk.metadata["session_id"] = session_id
        chunk.metadata["filename"] = file.filename
        
    embedding_model = get_embedding_model()

    vector_store = create_vector_store(
        documents=chunks,
        embedding_model=embedding_model,
    )

    return {
        "message": "PDF uploaded successfully",
        "filename": file.filename,
        "total_chunks": len(chunks),
    }