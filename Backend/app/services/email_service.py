# pyrefly: ignore [missing-import]
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig, MessageType
from pydantic import EmailStr
import os
from pathlib import Path
from app.config.settings import settings

# Setup template directory
TEMPLATE_FOLDER = Path(__file__).parent.parent / "templates"
# Ensure template directory exists
TEMPLATE_FOLDER.mkdir(parents=True, exist_ok=True)

def get_mail_config() -> ConnectionConfig:
    """
    Get the FastMail connection config.
    Returns a dummy config if mail settings are not fully configured
    to prevent the app from crashing on startup.
    """
    return ConnectionConfig(
        MAIL_USERNAME=settings.MAIL_USERNAME or "dummy@example.com",
        MAIL_PASSWORD=settings.MAIL_PASSWORD or "dummy",
        MAIL_FROM=settings.MAIL_FROM or "dummy@example.com",
        MAIL_PORT=settings.MAIL_PORT,
        MAIL_SERVER=settings.MAIL_SERVER or "smtp.example.com",
        MAIL_FROM_NAME=settings.MAIL_FROM_NAME,
        MAIL_STARTTLS=settings.MAIL_STARTTLS,
        MAIL_SSL_TLS=settings.MAIL_SSL_TLS,
        USE_CREDENTIALS=bool(settings.MAIL_USERNAME),
        VALIDATE_CERTS=True,
        TEMPLATE_FOLDER=TEMPLATE_FOLDER,
    )

async def send_password_reset_email(email_to: EmailStr, reset_token: str):
    """
    Send a password reset email with the raw reset token.
    """
    # Construct the reset link using the first frontend URL (in case there are multiple, comma-separated)
    base_url = settings.FRONTEND_URL.split(",")[0].strip()
    reset_link = f"{base_url}/reset-password?token={reset_token}"
    
    # We use a template for the email body.
    message = MessageSchema(
        subject="Password Reset Request - AI PDF Chatbot",
        recipients=[email_to],
        template_body={
            "reset_link": reset_link,
            "fallback_url": reset_link,
        },
        subtype=MessageType.html
    )
    
    conf = get_mail_config()
    fm = FastMail(conf)
    
    try:
        # Send the email using the 'reset_password.html' template
        await fm.send_message(message, template_name="reset_password.html")
    except Exception as e:
        # In a real production system you would log this error.
        print(f"Failed to send email: {e}")
        # We don't raise an exception here because we want to maintain the generic
        # "If an account exists..." response to prevent email enumeration.
