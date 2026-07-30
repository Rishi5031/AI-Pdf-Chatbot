print("STEP 1")

import os
from dotenv import load_dotenv

print("STEP 2")

# pyrefly: ignore [missing-import]
from fastapi import FastAPI

print("STEP 3")

from app.database.connection import Base, engine

print("STEP 4")

from app.routers.upload import router as upload_router

print("STEP 5")

from app.routers.chat import router as chat_router

print("STEP 6")

from app.routers.conversation import router as conversation_router

print("STEP 7")

from app.routers.auth import router as auth_router

print("STEP 8")

from app.routers.password_reset import router as password_reset_router

print("STEP 9")

import app.models.user

print("STEP 10")

import app.models.password_reset

print("STEP 11")

load_dotenv()
print("STEP 12")

Base.metadata.create_all(bind=engine)
print("STEP 13")
# pyrefly: ignore [missing-import]
from fastapi.middleware.cors import CORSMiddleware


# Dev migration for is_pinned and user_id
from sqlalchemy import text

try:
    with engine.connect() as conn:
        conn.execute(
            text(
                "ALTER TABLE conversations ADD COLUMN is_pinned BOOLEAN DEFAULT FALSE;"
            )
        )
        conn.commit()
except Exception:
    pass  # Column might already exist

try:
    with engine.connect() as conn:
        # Give existing conversations a default user_id of 1 to prevent errors.
        # (Assuming the first registered user gets ID 1)
        conn.execute(
            text(
                "ALTER TABLE conversations ADD COLUMN user_id INTEGER DEFAULT 1 REFERENCES users(id);"
            )
        )
        conn.commit()
except Exception:
    pass  # Column might already exist

app = FastAPI(title="AI PDF Chatbot")

frontend_urls = [
    url.strip() for url in os.getenv("FRONTEND_URL", "http://localhost:5173").split(",")
]

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
app.include_router(auth_router)
app.include_router(password_reset_router)


@app.get("/")
def home():
    return {"message": "Backend is running"}
