# embedding.py
import os

# pyrefly: ignore [missing-import]
from langchain_google_genai import GoogleGenerativeAIEmbeddings


def get_embedding_model():

    print("Embedding Model: ", os.getenv("GOOGLE_API_KEY"))
    embedding_model = GoogleGenerativeAIEmbeddings(
        model="models/gemini-embedding-2",
        google_api_key=os.getenv("GOOGLE_API_KEY"),
    )

    return embedding_model