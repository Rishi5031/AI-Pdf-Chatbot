# pyrefly: ignore [missing-import]
from langchain_core.runnables import RunnablePassthrough
# pyrefly: ignore [missing-import]
from langchain_core.output_parsers import StrOutputParser

from app.prompts.rag_prompt import RAG_PROMPT
from app.services.embedding import get_embedding_model
from app.services.llm_service import get_llm
from app.services.vectorstore import get_retriever

def get_rag_chain(conversation_id: int):
    embedding_model = get_embedding_model()
    retriever = get_retriever(embedding_model, conversation_id)
    llm = get_llm()

    return (
        {"context": retriever, "question": RunnablePassthrough()}
        | RAG_PROMPT
        | llm
        | StrOutputParser()
    )