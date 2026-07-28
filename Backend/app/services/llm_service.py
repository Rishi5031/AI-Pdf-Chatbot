import os

# pyrefly: ignore [missing-import]
from langchain_google_genai import ChatGoogleGenerativeAI


def get_llm():

    llm = ChatGoogleGenerativeAI(
        model="gemini-2.5-flash",
        google_api_key=os.getenv("GOOGLE_API_KEY"),
        temperature=0,
    )

    return llm