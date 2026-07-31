from pydantic import BaseModel, Field
from typing import Literal

class SummaryRequest(BaseModel):
    summary_type: Literal["short", "detailed", "executive", "bullet"] = Field(
        ..., description="The type of summary to generate."
    )
