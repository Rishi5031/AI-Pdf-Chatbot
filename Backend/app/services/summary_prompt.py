# pyrefly: ignore [missing-import]
from langchain_core.prompts import PromptTemplate

SHORT_SUMMARY_TEMPLATE = """
You are an expert summarizer. Provide a short summary of the following document(s).
The summary should be approximately 150-250 words.
Focus on the main purpose, primary ideas, and important conclusions.

Document Content:
{text}

Short Summary:
"""

DETAILED_SUMMARY_TEMPLATE = """
You are an expert analyst. Provide a comprehensive and detailed summary of the following document(s).
Your summary should include the following sections (use clear headings):
- Major Topics
- Key Findings
- Policies (if applicable)
- Important Facts
- Recommendations
- Conclusions

Document Content:
{text}

Detailed Summary:
"""

EXECUTIVE_SUMMARY_TEMPLATE = """
You are an executive assistant. Provide an executive summary of the following document(s) designed for executives and stakeholders.
Maintain a highly professional tone.
Include the following sections (use clear headings):
- Purpose
- Business Impact
- Risks
- Opportunities
- Recommendations

Document Content:
{text}

Executive Summary:
"""

BULLET_SUMMARY_TEMPLATE = """
You are an expert summarizer. Provide a concise bulleted summary of the following document(s).
Highlight the following aspects using bullet points:
- Important Facts
- Key Findings
- Important Dates (if applicable)
- Main Conclusions

Document Content:
{text}

Bullet Summary:
"""

def get_summary_prompt(summary_type: str) -> PromptTemplate:
    if summary_type == "short":
        return PromptTemplate(template=SHORT_SUMMARY_TEMPLATE, input_variables=["text"])
    elif summary_type == "detailed":
        return PromptTemplate(template=DETAILED_SUMMARY_TEMPLATE, input_variables=["text"])
    elif summary_type == "executive":
        return PromptTemplate(template=EXECUTIVE_SUMMARY_TEMPLATE, input_variables=["text"])
    elif summary_type == "bullet":
        return PromptTemplate(template=BULLET_SUMMARY_TEMPLATE, input_variables=["text"])
    else:
        raise ValueError(f"Unsupported summary type: {summary_type}")
