# chat.py
from app.chain.rag_chain import get_rag_chain
from app.services.generation_service import generate_answer
# pyrefly: ignore [missing-import]
from fastapi import APIRouter
from pydantic import BaseModel


router = APIRouter(
    prefix="/api",
    tags=["Chat"]
)


class ChatRequest(BaseModel):
    question: str
    session_id:str


@router.post("/chat")
def chat(request: ChatRequest):

    chain = get_rag_chain(request.session_id)
    answer = chain.invoke(request.question)

    return {
        "question": request.question,
        "answer": answer,   
    }