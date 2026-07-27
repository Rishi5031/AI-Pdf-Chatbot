# main.py

import os
from dotenv import load_dotenv

# pyrefly: ignore [missing-import]
from fastapi import FastAPI
# pyrefly: ignore [missing-import]
from fastapi.middleware.cors import CORSMiddleware

from app.routers.upload import router as upload_router

load_dotenv()

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

@app.get("/")
def home():
    return {"message": "Backend is running"}