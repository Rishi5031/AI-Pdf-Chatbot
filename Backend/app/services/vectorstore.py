# pyrefly: ignore [missing-import]
from app.utils.id_generator import generate_chunk_ids
# pyrefly: ignore [missing-import]
from langchain_chroma import Chroma

PERSIST_DIRECTORY = "app/chroma_db"

def create_vector_store(documents, embedding_model):
    """
    Create and persist a Chroma vector store.
    """

    vector_store = Chroma.from_documents(
        documents=documents,
        embedding=embedding_model,
        ids=generate_chunk_ids(documents),
        persist_directory=PERSIST_DIRECTORY,
    )

    return vector_store

def get_vector_store(embedding_model):
    return Chroma(
        persist_directory=PERSIST_DIRECTORY,
        embedding_function=embedding_model,
    )

def get_retriever(embedding_model, session_id):
    vector_store = get_vector_store(embedding_model)

    retriever = vector_store.as_retriever(
        search_kwargs={
            "k": 4,
            "filter": {"session_id": session_id}
        }
    )

    return retriever