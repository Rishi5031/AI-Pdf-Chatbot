import json
import logging
from sqlalchemy.orm import Session

from app.services.document_service import get_documents_by_conversation
from app.services.pdf_service import extract_raw_text_from_pdf
from app.services.summary_prompt import get_summary_prompt
from app.services.llm_service import get_llm
from app.services.message_service import save_message

logger = logging.getLogger(__name__)

def stream_summary_generator(db: Session, conversation_id: int, user_id: int, summary_type: str):
    """
    Asynchronous generator that streams LLM summary tokens via Server-Sent Events (SSE).
    """
    try:
        documents = get_documents_by_conversation(db, conversation_id)
        if not documents:
            yield "data: \n\ndata: [ERROR: No documents found to summarize]\n\n"
            return
            
        combined_text = ""
        unique_filenames = []
        sources = []
        
        for doc in documents:
            if doc.file_path:
                try:
                    text = extract_raw_text_from_pdf(doc.file_path)
                    if combined_text:
                        combined_text += "\n\n--- Next Document ---\n\n"
                    combined_text += f"Document Name: {doc.filename}\n{text}"
                    
                    if doc.filename not in unique_filenames:
                        unique_filenames.append(doc.filename)
                        sources.append({"filename": doc.filename})
                except Exception as e:
                    logger.error(f"Failed to extract text from {doc.file_path}: {e}")
        
        if not combined_text:
            yield "data: \n\ndata: [ERROR: Failed to extract text from documents]\n\n"
            return

        prompt_template = get_summary_prompt(summary_type)
        prompt_value = prompt_template.invoke({"text": combined_text})
        
        llm = get_llm()
        
        full_answer = ""
        
        for chunk in llm.stream(prompt_value):
            token = chunk.content
            if token:
                if isinstance(token, list):
                    text_parts = []
                    for item in token:
                        if isinstance(item, str):
                            text_parts.append(item)
                        elif isinstance(item, dict) and "text" in item:
                            text_parts.append(item["text"])
                    token = "".join(text_parts)
                elif not isinstance(token, str):
                    token = str(token)
                    
                full_answer += token
                safe_token = token.replace("\n", "\ndata: ")
                yield f"data: {safe_token}\n\n"
                
    except Exception as e:
        logger.error(f"Streaming error in summary: {e}")
        import traceback
        traceback.print_exc()
        yield "data: \n\ndata: [ERROR: Failed to generate summary]\n\n"
        return

    # After streaming completes, save the full response to the database with encoded sources
    save_content = full_answer
    if unique_filenames:
        save_content += f"\n\n__SOURCES__{json.dumps(unique_filenames)}"

    try:
        save_message(db=db, conversation_id=conversation_id, role="assistant", content=save_content)
    except Exception as e:
        logger.error(f"Failed to save assistant summary message: {e}")
            
    metadata = {
        "type": "metadata",
        "sources": sources
    }
    yield f"data: {json.dumps(metadata)}\n\n"
