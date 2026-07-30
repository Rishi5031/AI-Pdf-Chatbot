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
from app.routers.auth import router as auth_router
from app.routers.password_reset import router as password_reset_router

import app.models.user  # Ensure User model is loaded before create_all
import app.models.password_reset  # Ensure PasswordResetToken model is loaded before create_all
load_dotenv()

# Create database tables
Base.metadata.create_all(bind=engine)

# Dev migration for is_pinned and user_id
from sqlalchemy import text
try:
    with engine.connect() as conn:
        conn.execute(text("ALTER TABLE conversations ADD COLUMN is_pinned BOOLEAN DEFAULT FALSE;"))
        conn.commit()
except Exception:
    pass # Column might already exist

try:
    with engine.connect() as conn:
        # Give existing conversations a default user_id of 1 to prevent errors. 
        # (Assuming the first registered user gets ID 1)
        conn.execute(text("ALTER TABLE conversations ADD COLUMN user_id INTEGER DEFAULT 1 REFERENCES users(id);"))
        conn.commit()
except Exception:
    pass # Column might already exist

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
app.include_router(auth_router)
app.include_router(password_reset_router)

@app.get("/")
def home():
    return {"message": "Backend is running"}

print("\n========== REGISTERED ROUTES ==========")
for route in app.routes:
    print(route.path)
print("=======================================\n")