import json
import logging
from sqlalchemy.orm import Session
from app.services.message_service import save_message
from app.services.conversation_service import get_conversation_by_id
from app.services.title_service import generate_chat_title
from app.chain.rag_chain import get_rag_chain

logger = logging.getLogger(__name__)

def stream_chat_generator(db: Session, conversation_id: int, user_id: int, question: str):
    """
    Asynchronous generator that streams LLM tokens via Server-Sent Events (SSE).
    """
    chain = get_rag_chain(conversation_id)
    
    full_answer = ""
    docs = []
    
    try:
        # LangChain's .stream() on a RunnableParallel with .assign() yields dict chunks
        for chunk in chain.stream(question):
            if isinstance(chunk, dict):
                if "context" in chunk:
                    docs = chunk["context"]
                if "answer" in chunk:
                    token = chunk["answer"]
                    full_answer += token
                    # Safely encode newlines for the SSE protocol
                    safe_token = token.replace("\n", "\ndata: ")
                    yield f"data: {safe_token}\n\n"
            else:
                # Fallback if it yields raw strings
                full_answer += str(chunk)
                safe_token = str(chunk).replace("\n", "\ndata: ")
                yield f"data: {safe_token}\n\n"
    except Exception as e:
        logger.error(f"Streaming error: {e}")
        import traceback
        traceback.print_exc()
        yield f"data: \n\n[ERROR: Failed to generate response]\n\n"
        return

    # After streaming completes, save the full response to the database
    try:
        save_message(db=db, conversation_id=conversation_id, role="assistant", content=full_answer)
    except Exception as e:
        logger.error(f"Failed to save assistant message: {e}")
        
    # Generate title if it is still a new chat
    title_updated = None
    try:
        conv = get_conversation_by_id(db, conversation_id, user_id)
        if conv and (not conv.title or conv.title.strip().lower() == "new chat"):
            new_title = generate_chat_title(question)
            if new_title and new_title.lower() != "new chat":
                conv.title = new_title
                db.commit()
                title_updated = new_title
    except Exception as e:
        logger.error(f"Failed to generate title during stream: {e}")
        
    # Send the final metadata event containing sources and the new title
    sources = []
    if docs:
        for d in docs:
            filename = d.metadata.get("filename", "Unknown")
            page = d.metadata.get("page", 1)
            sources.append({"filename": filename, "page": page})
            
    metadata = {
        "type": "metadata",
        "sources": sources
    }
    if title_updated:
        metadata["title"] = title_updated
        
    yield f"data: {json.dumps(metadata)}\n\n"
