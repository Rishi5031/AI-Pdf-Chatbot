# pyrefly: ignore [missing-import]
from fastapi import APIRouter, Depends, HTTPException
# pyrefly: ignore [missing-import]
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.schemas.chat_schema import ChatRequest, ChatResponse
from app.services.message_service import save_message
from app.services.conversation_service import get_conversation_by_id
from app.services.title_service import generate_chat_title
from app.chain.rag_chain import get_rag_chain
from app.auth.dependencies import get_current_user
from app.models.user import User
from app.services.chat_service import stream_chat_generator

router = APIRouter(prefix="/api", tags=["Chat"])

@router.post("/chat/generate-title")
def generate_title_endpoint(
    request: ChatRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    from app.services.title_service import stream_chat_title_generator
    return StreamingResponse(
        stream_chat_title_generator(db, request.conversation_id, current_user.id, request.question),
        media_type="text/event-stream"
    )

@router.post("/chat/stream")
def stream_chat(
    request: ChatRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # 1. Save user message immediately before streaming
    save_message(
        db=db,
        conversation_id=request.conversation_id,
        role="user",
        content=request.question,
    )
    
    # 2. Return StreamingResponse which will save the assistant message at the end
    return StreamingResponse(
        stream_chat_generator(db, request.conversation_id, current_user.id, request.question),
        media_type="text/event-stream"
    )

@router.post("/chat", response_model=ChatResponse)
def chat(
    request: ChatRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if not request.question.strip():
        raise HTTPException(status_code=400, detail="Question cannot be empty")

    conv = get_conversation_by_id(db, request.conversation_id, current_user.id)
    if not conv:
        raise HTTPException(
            status_code=404, detail="Conversation not found or access denied"
        )

    # 1. Save user message
    save_message(
        db=db,
        conversation_id=request.conversation_id,
        role="user",
        content=request.question,
    )

    # 2. Get RAG chain with isolated retriever
    try:
        chain = get_rag_chain(request.conversation_id)

        # 4. Generate answer
        result = chain.invoke(request.question)
        answer = result["answer"]
        context_docs = result.get("context", [])

        if context_docs:
            from collections import defaultdict
            file_pages = defaultdict(set)
            
            for doc in context_docs:
                filename = doc.metadata.get("filename", "Unknown Document")
                page_val = doc.metadata.get("page")
                
                # Format page nicely
                if page_val is not None and isinstance(page_val, int):
                    page_str = f"Page {page_val + 1}"
                elif page_val is not None:
                    page_str = f"Page {page_val}"
                else:
                    page_str = ""
                    
                if page_str:
                    file_pages[filename].add(page_str)
                else:
                    # To ensure the file is still recorded even without pages
                    if filename not in file_pages:
                        file_pages[filename] = set()
            
            source_parts = []
            for filename, pages in file_pages.items():
                valid_pages = sorted(list(pages))
                if valid_pages:
                    pages_str = ", ".join(valid_pages)
                    if len(valid_pages) > 1:
                        source_parts.append(f"{filename} {{{pages_str}}}")
                    else:
                        # For a single page, we can use curly braces as requested
                        source_parts.append(f"{filename} {{{pages_str}}}")
                else:
                    source_parts.append(f"{filename}")
            
            if len(source_parts) > 0:
                combined_sources = ", ".join(source_parts)
                first_filename = list(file_pages.keys())[0]
                import urllib.parse
                safe_uri = urllib.parse.quote(first_filename)
                answer += f"\n\n[Source: {combined_sources}](#source:{safe_uri})"
                
    except Exception as e:
        print(f"Error generating answer: {e}")
        # Even if it fails, maybe we save an error message, but raising exception is standard for now.
        raise HTTPException(
            status_code=500, detail="Failed to generate answer from the document."
        )

    # 4. Save AI response
    save_message(
        db=db, conversation_id=request.conversation_id, role="assistant", content=answer
    )

    return {"answer": answer}
