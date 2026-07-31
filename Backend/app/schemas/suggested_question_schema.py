from pydantic import BaseModel

class SuggestedQuestionResponse(BaseModel):
    id: int
    question: str

    class Config:
        from_attributes = True
