# pyrefly: ignore [missing-import]
import chromadb
# pyrefly: ignore [missing-import]
from langchain_community.vectorstores import Chroma
from app.services.embedding import get_embedding_model

CHROMA_DB_DIR = "app/chroma_db"

def get_chroma_client():
    return chromadb.PersistentClient(path=CHROMA_DB_DIR)

def create_vector_store(documents, embedding_model):
    client = get_chroma_client()
    vector =  Chroma.from_documents(
        documents=documents,
        embedding=embedding_model,
        client=client,
        collection_name="pdf_collection",
    )

    print("vector", vector)
    return vector

def get_vector_store(embedding_model):
    client = get_chroma_client()
    return Chroma(
        client=client,
        collection_name="pdf_collection",
        embedding_function=embedding_model,
    )

def get_retriever(embedding_model, conversation_id: int):
    vector_store = get_vector_store(embedding_model)

    retriever = vector_store.as_retriever(
        search_kwargs={
            "k": 4,
            "filter": {"conversation_id": conversation_id}
        }
    )

    return retriever

def delete_from_vector_store(conversation_id: int):
    client = get_chroma_client()
    try:
        collection = client.get_collection("pdf_collection")
        collection.delete(where={"conversation_id": conversation_id})
    except Exception as e:
        print(f"Error deleting from vector store: {e}")