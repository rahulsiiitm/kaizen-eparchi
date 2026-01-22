import os
from dotenv import load_dotenv

# Load the .env file from the backend root directory
load_dotenv()

class Settings:
    PROJECT_NAME: str = "E-parchi AI Backend"
    GOOGLE_API_KEY: str | None = os.getenv("GOOGLE_API_KEY")
    PINECONE_API_KEY: str | None = os.getenv("PINECONE_API_KEY")
    PINECONE_INDEX_NAME: str | None = os.getenv("PINECONE_INDEX_NAME")

settings = Settings()