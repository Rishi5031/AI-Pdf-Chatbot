from pydantic import BaseModel, EmailStr, Field

class ForgotPasswordRequest(BaseModel):
    email: EmailStr

class ForgotPasswordResponse(BaseModel):
    message: str

class ResetPasswordRequest(BaseModel):
    token: str = Field(..., description="The raw reset token from the email link")
    password: str = Field(..., min_length=8, description="The new password")
    confirm_password: str = Field(..., min_length=8, description="Confirm the new password")

class ResetPasswordResponse(BaseModel):
    message: str
