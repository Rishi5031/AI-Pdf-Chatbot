import os
from dotenv import load_dotenv
# pyrefly: ignore [missing-import]
from fastapi import FastAPI
from app.database.connection import Base, engine
from app.routers.upload import router as upload_router
from app.routers.chat import router as chat_router
from app.routers.conversation import router as conversation_router
from app.routers.auth import router as auth_router
from app.routers.password_reset import router as password_reset_router
from app.routers.document import router as document_router
from app.routers.profile import router as profile_router
import app.models.user
import app.models.password_reset
import app.models.suggested_question
from pathlib import Path
# pyrefly: ignore [missing-import]
from fastapi.staticfiles import StaticFiles

load_dotenv()
Base.metadata.create_all(bind=engine)
# pyrefly: ignore [missing-import]
from fastapi.middleware.cors import CORSMiddleware


# Dev migration for is_pinned, user_id, profile_image, bio, updated_at
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
        conn.execute(
            text(
                "ALTER TABLE conversations ADD COLUMN user_id INTEGER DEFAULT 1 REFERENCES users(id);"
            )
        )
        conn.commit()
except Exception:
    pass  # Column might already exist

try:
    with engine.connect() as conn:
        conn.execute(text("ALTER TABLE users ADD COLUMN profile_image VARCHAR;"))
        conn.commit()
except Exception:
    pass

try:
    with engine.connect() as conn:
        conn.execute(text("ALTER TABLE users ADD COLUMN bio TEXT;"))
        conn.commit()
except Exception:
    pass

try:
    with engine.connect() as conn:
        conn.execute(text("ALTER TABLE users ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;"))
        conn.commit()
except Exception:
    pass

app = FastAPI(title="AI PDF Chatbot")

# Mount uploaded files directory for avatar access
uploaded_dir = Path("app/uploaded_files")
uploaded_dir.mkdir(parents=True, exist_ok=True)
app.mount("/uploaded_files", StaticFiles(directory="app/uploaded_files"), name="uploaded_files")

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
app.include_router(document_router)
app.include_router(profile_router)


@app.get("/")
def home():
    return {"message": "Backend is running"}

