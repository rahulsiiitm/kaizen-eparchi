import os
import time
import uuid
import base64
import json
from pydantic import SecretStr
from langchain_google_genai import ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings
from langchain_pinecone import PineconeVectorStore
from langchain_core.documents import Document
from langchain_core.messages import HumanMessage
from dotenv import load_dotenv

load_dotenv()

# Setup Models
vision_llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash",
    api_key=SecretStr(os.getenv("GOOGLE_API_KEY") or "")
)

summary_llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash",
    temperature=0.3,
    api_key=SecretStr(os.getenv("GOOGLE_API_KEY") or "")
)

#
embeddings = GoogleGenerativeAIEmbeddings(
    model="models/text-embedding-004",
    google_api_key=SecretStr(os.getenv("GOOGLE_API_KEY") or "") # <--- THE MISSING PIECE
)

# --- UPDATE: Accept patient_id ---
async def process_upload(file_bytes: bytes, filename: str, patient_id: str | None = None):
    try:
        print(f"👀 Reading file: {filename}...")
        
        # --- STEP 1: OCR (Read Image) ---
        image_b64 = base64.b64encode(file_bytes).decode("utf-8")
        
        ocr_message = HumanMessage(
            content=[
                {"type": "text", "text": "Transcribe this medical document exactly. Output ONLY the text found."},
                {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{image_b64}"}}
            ]
        )
        
        ai_response = vision_llm.invoke([ocr_message])
        extracted_text = ai_response.content
        if isinstance(extracted_text, list):
            extracted_text = " ".join(str(item) for item in extracted_text)
        print(f"✅ Text Extracted ({len(extracted_text)} chars)")

        # --- STEP 2: Save to Brain (Pinecone) ---
        file_id = str(uuid.uuid4())
        
        # LOGIC: If App sends a patient_id, use it. If not, use file_id as a fallback.
        final_patient_id = patient_id if patient_id else file_id

        doc = Document(
            page_content=extracted_text,
            metadata={
                "source": filename,
                "file_id": file_id,
                "patient_id": final_patient_id, # <--- KEY CHANGE: Storing the Group ID
                "upload_timestamp": time.time()
            }
        )

        vectorstore = PineconeVectorStore(
            index_name=os.getenv("PINECONE_INDEX_NAME"),
            embedding=embeddings
        )
        vectorstore.add_documents([doc])
        print(f"💾 Memorized with ID: {file_id} (Patient: {final_patient_id})")

        # --- STEP 3: Auto-Generate Summary ---
        print("🧠 Generating Instant Summary...")
        
        summary_prompt = f"""
        You are an expert medical AI. Analyze the following extracted medical text.
        
        EXTRACTED TEXT:
        {extracted_text}
        
        OUTPUT FORMAT (JSON):
        - "patient_summary": "Brief summary...",
        - "differential_diagnoses": [
            "1. Most likely: [Condition] (Reason)",
            "2. Potential alternative: [Condition] (Reason)"
        ],
        - "medicines": ["List of medicines..."],
        - "advice": "Non-medicine advice..."
        """
        
        summary_response = summary_llm.invoke(summary_prompt)
        content = summary_response.content
        if isinstance(content, list):
            content = " ".join(str(item) for item in content)
        clean_json_text = content.replace("```json", "").replace("```", "").strip()
        
        try:
            parsed_summary = json.loads(clean_json_text)
        except:
            parsed_summary = {
                "patient_summary": "Analysis complete.", 
                "diagnosis": "See text", 
                "medicines": [],
                "raw_text": clean_json_text
            }

        return {
            "status": "success",
            "file_id": file_id,
            "patient_id": final_patient_id, # Return this so App can track session
            "extracted_text_preview": extracted_text[:100] + "...",
            "analysis": parsed_summary
        }

    except Exception as e:
        print(f"❌ Error in processing: {e}")
        return {"status": "error", "message": str(e)}

# ADD THIS FUNCTION AT THE END OF THE FILE
async def memorize_report(text_summary: str, filename: str, patient_id: str):
    """
    Manually saves a text summary (like an X-Ray finding) into Pinecone.
    This allows RAG to answer questions about X-Rays.
    """
    try:
        # 1. Create a unique ID
        file_id = str(uuid.uuid4())
        
        # 2. Prepare the Document
        doc = Document(
            page_content=text_summary,
            metadata={
                "source": filename,
                "file_id": file_id,
                "patient_id": patient_id, # Link to Patient
                "type": "medical_report",
                "upload_timestamp": time.time()
            }
        )

        # 3. Push to Pinecone
        vectorstore = PineconeVectorStore(
            index_name=os.getenv("PINECONE_INDEX_NAME"),
            embedding=embeddings
        )
        vectorstore.add_documents([doc])
        
        print(f"💾 Manually Memorized Report: {file_id}")
        return file_id

    except Exception as e:
        print(f"❌ Failed to memorize report: {e}")
        return None