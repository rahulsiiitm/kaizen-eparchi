import os
from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from app.models import Doctor, Patient, Visit
from dotenv import load_dotenv

load_dotenv()

async def init_db():
    # 1. Get Mongo URL from .env or use local default
    # If you don't have a Mongo URL, it defaults to localhost
    mongo_url = os.getenv("MONGODB_URL") or "mongodb://localhost:27017"
    
    client = AsyncIOMotorClient(mongo_url)
    
    # 2. Create/Connect to the database named "clinic_ai_db"
    db = client.clinic_ai_db
    
    # 3. Initialize the Models (This creates the collections automatically)
    await init_beanie(
        database=db, #type: ignore
        document_models=[
            Doctor,
            Patient,
            Visit
        ]
    )
    print("✅ Database Connected: clinic_ai_db")