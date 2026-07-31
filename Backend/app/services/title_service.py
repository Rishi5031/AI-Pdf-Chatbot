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
