import json
from typing import List
from sqlalchemy.orm import Session
from app.models.suggested_question import SuggestedQuestion
from app.services.llm_service import get_llm
# pyrefly: ignore [missing-import]
from langchain_core.prompts import PromptTemplate

def generate_suggested_questions(chunks) -> List[str]:
    try:
        print("chunks", chunks)
        if not chunks:
            return []

        # Use first 5-10 chunks for context
        context_chunks = chunks[:10]
        print('context chunks' , context_chunks)
        context_text = "\n\n".join([chunk.page_content for chunk in context_chunks])
        print('context_text' , context_text)

        prompt_template = """
You are an expert assistant. Based on the following document context, generate exactly 3 highly important and useful suggested questions that a user might ask about the document(s).

Requirements:
- Questions must relate to the uploaded document(s).
- Avoid generic questions whenever possible.
- If multiple documents exist, generate questions that encourage comparison and cross-document reasoning.
- Return ONLY a JSON array of 3 strings. Do not include markdown formatting like ```json.

Example output:
[
  "Summarize the most important findings.",
  "What are the critical dates mentioned?",
  "How do these policies differ?"
]

Context:
{context}

JSON Array:"""
        
        prompt = PromptTemplate(template=prompt_template, input_variables=["context"])

        print("prompt", prompt)
        llm = get_llm()
        
        chain = prompt | llm
        print('chain' , chain)
        response = chain.invoke({"context": context_text})
        
        # Handle both string and list response formats (differs by langchain version/model)
        raw_content = response.content
        if isinstance(raw_content, list):
            # Extract text from the first block if it's a list
            content = raw_content[0].get('text', '').strip()
        else:
            content = str(raw_content).strip()
            
        print('Parsed content:', content)
        
        # Clean up possible markdown code blocks if the LLM ignores instructions
        if content.startswith("```json"):
            content = content[7:]
        if content.startswith("```"):
            content = content[3:]
        if content.endswith("```"):
            content = content[:-3]
        content = content.strip()

        questions = json.loads(content)
        
        if isinstance(questions, list) and len(questions) > 0:
            return [str(q) for q in questions][:3]
        
        return []
    except Exception as e:
        print(f"Failed to generate suggested questions: {e}")
        return []

def save_suggested_questions(db: Session, conversation_id: int, questions: List[str]):
    try:
        for q in questions:
            sq = SuggestedQuestion(conversation_id=conversation_id, question=q)
            db.add(sq)
        db.commit()
    except Exception as e:
        db.rollback()
        print(f"Failed to save suggested questions: {e}")

def get_suggested_questions(db: Session, conversation_id: int):
    return db.query(SuggestedQuestion).filter(SuggestedQuestion.conversation_id == conversation_id).all()

def delete_suggested_questions(db: Session, conversation_id: int):
    try:
        db.query(SuggestedQuestion).filter(SuggestedQuestion.conversation_id == conversation_id).delete()
        db.commit()
    except Exception as e:
        db.rollback()
        print(f"Failed to delete suggested questions: {e}")
