# pyrefly: ignore [missing-import]
from google.oauth2 import id_token
# pyrefly: ignore [missing-import]
from google.auth.transport import requests
# pyrefly: ignore [missing-import]
from fastapi import HTTPException
from app.config.settings import settings

def verify_google_token(token: str) -> dict:
    if not settings.GOOGLE_CLIENT_ID:
        raise HTTPException(status_code=500, detail="Google Client ID not configured")
    try:
        idinfo = id_token.verify_oauth2_token(token, requests.Request(), settings.GOOGLE_CLIENT_ID)
        return idinfo
    except ValueError:
        raise HTTPException(status_code=401, detail="Invalid Google token")
