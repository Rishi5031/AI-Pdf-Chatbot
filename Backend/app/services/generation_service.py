from app.prompts.rag_prompt import RAG_PROMPT
from app.services.llm_service import get_llm


def generate_answer(question, documents):

    context = "\n\n".join(
        doc.page_content
        for doc in documents
    )

    prompt = RAG_PROMPT.invoke(
        {
            "context": context,
            "question": question,
        }
    )

    llm = get_llm()

    response = llm.invoke(prompt)

    return response.content