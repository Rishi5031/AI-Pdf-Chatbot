import os
from dotenv import load_dotenv

# pyrefly: ignore [missing-import]
from fastapi import FastAPI
# pyrefly: ignore [missing-import]
from fastapi.middleware.cors import CORSMiddleware

from app.database.connection import Base, engine
from app.routers.upload import router as upload_router
from app.routers.chat import router as chat_router
from app.routers.conversation import router as conversation_router

load_dotenv()

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="AI PDF Chatbot")

frontend_urls = [url.strip() for url in os.getenv("FRONTEND_URL", "http://localhost:5173").split(",")]

app.add_middleware(
    CORSMiddleware,
    allow_origins=frontend_urls,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(upload_router)
app.include_router(chat_router)
app.include_router(conversation_router)

@app.get("/")
def home():
    return {"message": "Backend is running"}