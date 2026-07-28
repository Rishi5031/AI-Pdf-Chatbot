# pyrefly: ignore [missing-import]
from langchain_core.output_parsers import StrOutputParser
# pyrefly: ignore [missing-import]
from langchain_core.runnables import RunnablePassthrough,RunnableLambda

from app.prompts.rag_prompt import RAG_PROMPT
from app.services.embedding import get_embedding_model
from app.services.llm_service import get_llm
from app.services.vectorstore import get_retriever

def get_rag_chain(session_id):
    embedding_model = get_embedding_model()
    retriever = get_retriever(embedding_model, session_id)
    llm = get_llm()

    return (
        {
            "context": retriever | RunnableLambda(format_docs),
            "question": RunnablePassthrough(),
        }
        | RAG_PROMPT
        | llm
        | StrOutputParser()
    )

def format_docs(documents):
    return "\n\n".join(
        doc.page_content
        for doc in documents
    )