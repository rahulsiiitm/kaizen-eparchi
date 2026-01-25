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
    google_api_key=google_key
)

# --- THE FIX: Natural Language Prompt (No JSON) ---
template = """
You are E-parchi, an intelligent medical assistant for doctors.
You have access to the patient's history in the Context below.

Context from patient records:
{context}

Doctor's Question:
{question}
Instructions:
1. Answer the doctor's question SPECIFICALLY. Do not just summarize the file.
2. If the doctor asks "Is he improving?", compare the dates in the context to give a trend.
3. If the context has X-Ray results, mention findings like fractures or severity.
4. If the answer is not in the context, say "I don't see that in the records."
5. Be concise and professional. Do NOT use markdown code blocks or JSON.

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
        # We increase k=5 to get more history for better comparisons
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
        # Since we aren't asking for JSON anymore, we just strip whitespace
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