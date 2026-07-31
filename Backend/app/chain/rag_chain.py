# pyrefly: ignore [missing-import]
from langchain_core.runnables import RunnablePassthrough, RunnableParallel
# pyrefly: ignore [missing-import]
from langchain_core.output_parsers import StrOutputParser

from app.prompts.rag_prompt import RAG_PROMPT
from app.services.embedding import get_embedding_model
from app.services.llm_service import get_llm
from app.services.vectorstore import get_retriever

def format_docs(docs):
    return "\n\n".join(doc.page_content for doc in docs)

def get_rag_chain(conversation_id: int):
    embedding_model = get_embedding_model()
    retriever = get_retriever(embedding_model, conversation_id)
    llm = get_llm()

    rag_chain_from_docs = (
        RunnablePassthrough.assign(context=(lambda x: format_docs(x["context"])))
        | RAG_PROMPT
        | llm
        | StrOutputParser()
    )

    return RunnableParallel(
        {"context": retriever, "question": RunnablePassthrough()}
    ).assign(answer=rag_chain_from_docs)