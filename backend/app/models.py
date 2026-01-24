from typing import List, Optional
from datetime import datetime
from beanie import Document
from pydantic import BaseModel, Field

# --- SUPPORT MODELS (Embedded inside Documents) ---

class FileRecord(BaseModel):
    """
    Represents a single uploaded file (Prescription or X-Ray)
    """
    file_id: str          # The ID in Pinecone (Vector DB)
    filename: str         # Original filename (e.g., "scan.jpg")
    file_type: str        # "prescription" or "xray"
    local_path: str       # Where we saved the image on the laptop
    ai_summary: Optional[dict] = None # The JSON output from Gemini

class Message(BaseModel):
    """
    Represents a chat message in the Visit history
    """
    sender: str           # "doctor" or "ai"
    text: str
    timestamp: datetime = Field(default_factory=datetime.now)

# --- MAIN DATABASE DOCUMENTS ---

class Doctor(Document):
    name: str
    specialty: str = "General Physician"
    
    class Settings:
        name = "doctors"

class Patient(Document):
    name: str
    age: int
    gender: str
    created_at: datetime = Field(default_factory=datetime.now)
    total_visits: int = 0  # <--- Critical for "New Patient" logic
    
    class Settings:
        name = "patients"

class Visit(Document):
    patient_id: str       # Links to Patient
    doctor_id: str        # Links to Doctor
    visit_number: int     # 1 = New Patient, >1 = Returning
    timestamp: datetime = Field(default_factory=datetime.now)
    
    # Data Storage
    files: List[FileRecord] = []
    messages: List[Message] = []
    
    # Longitudinal Summary (What Gemini thinks of this visit)
    visit_summary: Optional[str] = None 
    
    class Settings:
        name = "visits"