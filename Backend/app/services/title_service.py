import logging
# pyrefly: ignore [missing-import]
from langchain_core.prompts import PromptTemplate
# pyrefly: ignore [missing-import]
from langchain_core.output_parsers import StrOutputParser
from app.services.llm_service import get_llm

logger = logging.getLogger(__name__)

TITLE_PROMPT_TEMPLATE = """You are an AI assistant.
Generate a concise conversation title.

Rules:
* Maximum 5 words.
* Do not use quotes.
* Do not use punctuation at the end.
* Return ONLY the title.
* Do not include explanations.
* Make the title descriptive.
* Use title case.
* If the question is vague, generate the best possible topic.

User Question:
{question}
"""

def generate_chat_title(question: str) -> str:
    """
    Generates a concise conversation title based on the user's first question.
    """
    llm = get_llm()
    prompt = PromptTemplate.from_template(TITLE_PROMPT_TEMPLATE)
    chain = prompt | llm | StrOutputParser()
    
    title = chain.invoke({"question": question})
    # Clean up any potential quotes or whitespace just in case the LLM ignores rules
    return title.strip().strip('"').strip("'")

def stream_chat_title_generator(db, conversation_id: int, user_id: int, question: str):
    from app.services.conversation_service import get_conversation_by_id
    conv = get_conversation_by_id(db, conversation_id, user_id)
    if not conv:
        yield f"data: [ERROR]\n\n"
        return
        
    if conv.title and conv.title.strip().lower() != "new chat":
        return

    llm = get_llm()
    prompt = PromptTemplate.from_template(TITLE_PROMPT_TEMPLATE)
    chain = prompt | llm | StrOutputParser()
    
    full_title = ""
    try:
        for chunk in chain.stream({"question": question}):
            cleaned = chunk.replace('"', '').replace("'", "").replace("\n", " ")
            if cleaned:
                full_title += cleaned
                safe_token = cleaned.replace("\n", "\ndata: ")
                yield f"data: {safe_token}\n\n"
    except Exception as e:
        import traceback
        traceback.print_exc()
        yield f"data: [ERROR]\n\n"
        return
        
    cleaned_title = full_title.strip()
    if cleaned_title and cleaned_title.lower() != "new chat":
        conv.title = cleaned_title
        db.commit()
