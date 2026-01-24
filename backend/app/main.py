import os
import shutil
import uuid
from typing import List
from contextlib import asynccontextmanager

from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware

from app.database import init_db
from app.models import Patient, Visit, FileRecord, Message

# --- CRITICAL IMPORTS FOR AI ---
from app.services.ingest_service import process_upload, memorize_report 
from app.services.rag_service import get_rag_response
from app.services.vision_service import analyze_xray 

# 1. LIFESPAN (Startup/Shutdown Logic)
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Connect to DB
    await init_db()
    yield
    # Shutdown: (Cleanup if needed)

app = FastAPI(title="Clinic AI EMR", lifespan=lifespan)

# 2. CORS (Allow Mobile App)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 3. Mount Local Storage (For saving images locally)
os.makedirs("uploads", exist_ok=True)
app.mount("/static", StaticFiles(directory="uploads"), name="static")

# --- PATIENT ENDPOINTS ---

@app.post("/patients/create")
async def create_patient(name: str = Form(...), age: int = Form(...), gender: str = Form(...)):
    """
    Register a new patient (e.g., Sita Verma)
    """
    # Check if patient exists? (Skipping for hackathon speed)
    patient = Patient(name=name, age=age, gender=gender, total_visits=0)
    await patient.insert()
    return {"status": "success", "patient": patient}

@app.get("/patients")
async def list_patients():
    """
    Get all registered patients for the dashboard
    """
    patients = await Patient.find_all().to_list()
    return patients

# --- VISIT ENDPOINTS ---

@app.post("/visits/create")
async def start_visit(patient_id: str = Form(...), doctor_id: str = Form("dr_default")):
    """
    Start a new session for a patient
    """
    # 1. Get Patient
    patient = await Patient.get(patient_id)
    if not patient:
        raise HTTPException(404, "Patient not found")
    
    # 2. Increment Visit Count
    patient.total_visits += 1
    await patient.save()
    
    # 3. Create Visit
    visit = Visit(
        patient_id=str(patient.id),
        doctor_id=doctor_id,
        visit_number=patient.total_visits
    )
    await visit.insert()
    
    return {"status": "started", "visit": visit, "patient_name": patient.name}

@app.get("/visits/history/{patient_id}")
async def get_patient_history(patient_id: str):
    """
    Get previous visits to show timeline
    """
    visits = await Visit.find(Visit.patient_id == patient_id).sort(-Visit.timestamp).to_list()
    return visits

# --- INTELLIGENT UPLOAD ENDPOINT ---

@app.post("/visits/{visit_id}/upload")
async def upload_medical_file(
    visit_id: str,
    file: UploadFile = File(...),
    type: str = Form("prescription") # "xray" or "prescription"
):
    """
    1. Routes file to correct AI (Vision vs Ingest).
    2. Memorizes the content in Pinecone (even X-Rays).
    3. Saves file record to MongoDB.
    4. ADDS A MESSAGE to the chat history so it appears in the timeline.
    """
    visit = await Visit.get(visit_id)
    if not visit:
        raise HTTPException(404, "Visit not found")

    # 1. Save File Locally
    file_ext = file.filename.split(".")[-1]
    unique_name = f"{visit.patient_id}_{uuid.uuid4()}.{file_ext}"
    file_path = f"uploads/{unique_name}"
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    # 2. Read File
    with open(file_path, "rb") as f:
        content = f.read()

    print(f"🧠 AI Analyzing {type.upper()} for Patient {visit.patient_id}...")
    
    saved_id = None
    
    # 3. Intelligent Routing & Processing
    try:
        if type == "xray":
            # --- X-RAY FLOW ---
            ai_result = await analyze_xray(content, file.filename)
            ai_summary = ai_result.get("analysis", {})
            
            # Create a chat-friendly string
            chat_text = (
                f"🩻 **X-Ray Analysis**\n"
                f"**Finding:** {ai_summary.get('finding', 'Unknown')}\n"
                f"**Severity:** {ai_summary.get('severity', 'Unknown')}\n"
                f"**Location:** {ai_summary.get('location', 'Unknown')}"
            )
            
            # === MEMORIZE THIS INTO PINECONE ===
            # We convert the JSON finding into a sentence so RAG can read it later.
            memory_text = f"X-Ray Analysis of {file.filename}: Found {ai_summary.get('finding')} in {ai_summary.get('location')}. Severity is {ai_summary.get('severity')}."
            saved_id = await memorize_report(memory_text, file.filename, visit.patient_id)
            
        else:
            # --- PRESCRIPTION FLOW ---
            ai_result = await process_upload(content, file.filename, patient_id=visit.patient_id)
            ai_summary = ai_result.get("analysis", {})
            saved_id = ai_result.get("file_id") # process_upload already generates an ID
            
            # Create a chat-friendly string
            chat_text = (
                f"📄 **Prescription Digitized**\n"
                f"**Summary:** {ai_summary.get('patient_summary', 'Processed')}\n"
                f"**Medicines:** {', '.join(ai_summary.get('medicines', []))}"
            )

    except Exception as e:
        print(f"❌ AI Failed: {e}")
        ai_summary = {"error": str(e)}
        chat_text = "❌ I encountered an error analyzing this file."
        saved_id = "error"

    # 4. Save File Record (The Database Copy)
    record = FileRecord(
        file_id=saved_id or str(uuid.uuid4()),
        filename=file.filename,
        file_type=type,
        local_path=file_path,
        ai_summary=ai_summary
    )
    visit.files.append(record)

    # 5. Save Chat Message (The "Chatbot" Experience)
    # We add a message from the "ai" so it shows up in the chat window immediately.
    visit.messages.append(Message(sender="ai", text=chat_text))

    await visit.save()
    
    return {
        "status": "processed", 
        "file_type": type,
        "ai_summary": ai_summary,
        "chat_message": chat_text # Return this so frontend can append it locally too
    }

# --- CHAT ENDPOINT (Longitudinal RAG) ---

@app.post("/visits/{visit_id}/chat")
async def chat_with_patient_context(visit_id: str, query: str = Form(...)):
    """
    Chat with the AI about this specific patient's history.
    DEBUG MODE: Returns full system errors if they occur.
    """
    visit = await Visit.get(visit_id)
    if not visit:
        raise HTTPException(404, "Visit not found")

    print(f"🤖 Asking RAG for Patient ID: {visit.patient_id}")

    # 1. AI Retrieval (The "Brain")
    response_data = get_rag_response(query, patient_id=visit.patient_id)
    
    # 2. DEBUG LOGIC: Check for errors immediately
    if response_data.get("status") == "error":
        print(f"❌ RAG CRASHED: {response_data}")
        # Return the error directly to the UI so you can see it
        return {
            "response": f"SYSTEM ERROR: {response_data.get('message')}",
            "debug_info": response_data
        }

    ai_text = response_data.get("ai_response", "No response generated.")

    # 3. Save Chat History (Only if successful)
    visit.messages.append(Message(sender="doctor", text=query))
    visit.messages.append(Message(sender="ai", text=ai_text))
    await visit.save()
    
    return {
        "response": ai_text,
        "source": response_data.get("source_document")
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)