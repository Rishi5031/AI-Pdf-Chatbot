import os
# pyrefly: ignore [missing-import]
from pinecone import Pinecone
# pyrefly: ignore [missing-import]
from langchain_pinecone import PineconeVectorStore
from app.services.embedding import get_embedding_model


def get_pinecone_client() -> Pinecone:
    """
    Initialize and return a Pinecone client instance.
    Requires PINECONE_API_KEY environment variable.
    """
    api_key = os.getenv("PINECONE_API_KEY")
    if not api_key:
        raise ValueError("PINECONE_API_KEY environment variable is not set.")
    return Pinecone(api_key=api_key)


def get_index_name() -> str:
    """
    Retrieve the Pinecone index name from environment variables.
    """
    index_name = os.getenv("PINECONE_INDEX_NAME")
    if not index_name:
        raise ValueError("PINECONE_INDEX_NAME environment variable is not set.")
    return index_name


def get_pinecone_index():
    """
    Return a Pinecone Index object for direct index operations such as vector deletion.
    """
    pc = get_pinecone_client()
    index_name = get_index_name()
    return pc.Index(index_name)


def create_vector_store(documents, embedding_model):
    """
    Store document chunks and their embeddings in Pinecone.
    """
    index_name = get_index_name()
    vector = PineconeVectorStore.from_documents(
        documents=documents,
        embedding=embedding_model,
        index_name=index_name,
    )
    return vector


def get_vector_store(embedding_model):
    """
    Load vector store interface for Pinecone.
    """
    index_name = get_index_name()
    return PineconeVectorStore(
        index_name=index_name,
        embedding=embedding_model,
    )


def get_retriever(embedding_model, conversation_id: int):
    """
    Create a retriever scoped to a specific conversation_id.
    """
    vector_store = get_vector_store(embedding_model)

    retriever = vector_store.as_retriever(
        search_kwargs={
            "k": 4,
            "filter": {"conversation_id": conversation_id}
        }
    )

    return retriever


def delete_from_vector_store(conversation_id: int):
    """
    Delete all vectors associated with a conversation_id.
    """
    try:
        index = get_pinecone_index()
        index.delete(filter={"conversation_id": {"$eq": conversation_id}})
    except Exception as e:
        print(f"Error deleting vectors for conversation {conversation_id} from Pinecone: {e}")


def delete_document_vectors(document_id: int):
    """
    Delete all vectors associated with a document_id.
    """
    try:
        index = get_pinecone_index()
        index.delete(filter={"document_id": {"$eq": document_id}})
    except Exception as e:
        print(f"Error deleting vectors for document {document_id} from Pinecone: {e}")