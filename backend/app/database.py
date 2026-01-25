import os
import certifi # <--- You might need to pip install certifi
from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from app.models import Doctor, Patient, Visit
from dotenv import load_dotenv

load_dotenv()

async def init_db():
    # 1. Get Mongo URL
    mongo_url = os.getenv("MONGODB_URL") or "mongodb://localhost:27017"
    
    # 2. THE FIX: Add tlsAllowInvalidCertificates=True for strict networks
    # We also use 'certifi' to provide valid certificates if yours are outdated
    client = AsyncIOMotorClient(
        mongo_url,
        tlsCAFile=certifi.where(), # Helps with SSL errors
        tlsAllowInvalidCertificates=True # BYPASSES the strict check (Good for debugging)
    )
    
    db = client.clinic_ai_db
    
    await init_beanie(
        database=db,#type: ignore
        document_models=[
            Doctor,
            Patient,
            Visit
        ]
    )
    print("✅ Database Connected: clinic_ai_db")