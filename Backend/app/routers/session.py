# pyrefly: ignore [missing-import]
from fastapi import APIRouter
import uuid


router = APIRouter(
    prefix="/api/session",
    tags=["Session"]
)


@router.post("/new")
def create_new_session():

    session_id = str(uuid.uuid4())

    return {
        "session_id": session_id
    }