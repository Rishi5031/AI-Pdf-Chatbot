# vectorstore.py
# pyrefly: ignore [missing-import]
from langchain_chroma import Chroma
from app.utils.id_generator import generate_chunk_ids

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