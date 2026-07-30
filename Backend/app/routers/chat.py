# pyrefly: ignore [missing-import]
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.schemas.chat_schema import ChatRequest, ChatResponse
from app.services.message_service import save_message
from app.services.conversation_service import get_conversation_by_id
from app.chain.rag_chain import get_rag_chain
from app.auth.dependencies import get_current_user
from app.models.user import User

router = APIRouter(prefix="/api", tags=["Chat"])


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

        # 3. Generate answer
        answer = chain.invoke(request.question)
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
