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
# ✅ USING gemini-flash-latest for stability & global knowledge
llm = ChatGoogleGenerativeAI(
    model="gemini-flash-latest",
    temperature=0.3,
    google_api_key=google_key
)

# --- THE FIX: HYBRID PROMPT (Context + Global Knowledge) ---
template = """
You are E-parchi, an expert medical assistant.
You have access to the patient's records (Context), but you also possess extensive general medical knowledge.

Context from records:
{context}

Doctor's Question:
{question}

Instructions:
1. **First, check the Context:** Look for specific details about *this* patient (past meds, X-ray findings, allergies).
2. **If Context is missing the answer:** (e.g., Doctor asks "How do I treat this fracture?" but no prescription exists yet):
   - You **MUST** use your general medical knowledge.
   - Provide standard medical treatment guidelines, dosage recommendations, or next steps.
   - Start these answers with: *"Based on standard medical guidelines..."* or *"General treatment for this condition includes..."*
3. **Connect the Dots:** If the X-Ray context says "Fracture" and the doctor asks "Treatment?", suggest casting/splinting/surgery based on the severity mentioned.
4. **Safety:** Do NOT invent *patient actions* (like "He took medicine yesterday") if it's not in the records. Only provide *medical advice* from global knowledge.

Answer:
"""

QA_PROMPT = PromptTemplate.from_template(template)


def get_rag_response(query_text: str, file_id: Optional[str] = None, patient_id: Optional[str] = None):
    try:
        # === FILTERS ===
        filters = None
        if patient_id:
            filters = {"patient_id": patient_id}
        elif file_id:
            filters = {"file_id": file_id}

        # === RETRIEVER ===
        retriever = vectorstore.as_retriever(
            search_kwargs={
                "k": 5, 
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

        # === CLEAN OUTPUT ===
        clean_output = result["result"].strip()

        # === SOURCE DOC ===
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