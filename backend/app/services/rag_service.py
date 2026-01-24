import os
from typing import Optional
from dotenv import load_dotenv
from pinecone import Pinecone
from pydantic import SecretStr

from langchain_google_genai import ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings
from langchain_pinecone import PineconeVectorStore
from langchain.chains import RetrievalQA
from langchain_core.prompts import PromptTemplate

load_dotenv()

# === ENV VARS ===
pinecone_key = os.getenv("PINECONE_API_KEY")
pinecone_index = os.getenv("PINECONE_INDEX_NAME")
google_key = os.getenv("GOOGLE_API_KEY")

assert pinecone_key, "Missing PINECONE_API_KEY"
assert pinecone_index, "Missing PINECONE_INDEX_NAME"
assert google_key, "Missing GOOGLE_API_KEY"

# === INIT PINECONE CLIENT ===
pc = Pinecone(api_key=pinecone_key)

# === EMBEDDINGS ===
embeddings = GoogleGenerativeAIEmbeddings(
    model="models/text-embedding-004",
    google_api_key=SecretStr(google_key)
)

# === VECTORSTORE ===
vectorstore = PineconeVectorStore(
    index_name=pinecone_index,
    embedding=embeddings
)

# === LLM ===
llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash",
    temperature=0.3,
    google_api_key=google_key # type: ignore
)

# --- FIX: Use {{ double braces }} for the JSON example ---
template = """
You are E-parchi, an expert medical assistant.
Use ONLY the provided context.

Rules:
1. Do NOT hallucinate.
2. Provide medical clarity.
3. Provide JSON with:
- summary
- diagnosis
- medicines
4. Use evidence from context.

Context:
{context}

Question:
{question}

Output JSON only:
{{
  "summary": "...",
  "diagnosis": "...",
  "medicines": ["...", "..."]
}}
"""

QA_PROMPT = PromptTemplate.from_template(template)


def get_rag_response(query_text: str, file_id: Optional[str] = None, patient_id: Optional[str] = None):
    try:
        # === FILTERS (Clean, Editor-Friendly) ===
        filters = None
        if patient_id:
            filters = {"patient_id": patient_id}
        elif file_id:
            filters = {"file_id": file_id}

        # === RETRIEVER ===
        retriever = vectorstore.as_retriever(
            search_kwargs={
                "k": 3,
                **({"filter": filters} if filters else {})
            }
        )

        # === QA CHAIN ===
        qa = RetrievalQA.from_chain_type(
            llm=llm,
            chain_type="stuff",
            retriever=retriever,
            chain_type_kwargs={"prompt": QA_PROMPT},
            return_source_documents=True
        )

        result = qa.invoke({"query": query_text})

        # === CLEAN JSON ===
        clean_output = (
            result["result"]
            .replace("```json", "")
            .replace("```", "")
            .strip()
        )

        # === SOURCE DOC SAFE ===
        source = None
        docs = result.get("source_documents", [])
        if docs and len(docs) > 0:
            source = docs[0].metadata.get("source", None)

        return {
            "status": "success",
            "ai_response": clean_output,
            "source_document": source
        }

    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }   