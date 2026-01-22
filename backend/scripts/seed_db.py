import os
import time
from dotenv import load_dotenv
from pydantic import SecretStr
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_pinecone import PineconeVectorStore
from langchain_core.documents import Document

# 1. Load your API Keys from the .env file
# We go "up one level" (..) because this script is in backend/scripts/
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), "../.env"))

api_key = os.getenv("PINECONE_API_KEY")
index_name = os.getenv("PINECONE_INDEX_NAME")
google_key = os.getenv("GOOGLE_API_KEY")

if not api_key or not google_key:
    print("❌ Error: Missing API Keys. Check your .env file!")
    exit(1)

print(f"🔌 Connecting to Pinecone Index: {index_name}...")

# 2. Initialize the Embedding Model (Must be 'text-embedding-004' for 768 dimensions)
embeddings = GoogleGenerativeAIEmbeddings(
    model="models/text-embedding-004",
    google_api_key=SecretStr(google_key)
)

# 3. The "Golden Dataset" (Dummy Data)
# This mimics what OCR would extract from a handwritten prescription.
sample_prescription_text = """
Patient Name: Rahul Sharma
Age: 21
Date: 07/12/2025
Diagnosis: Acute Bronchitis with mild fever.
Rx:
1. Tab. Azithromycin 500mg - 1 tablet daily for 3 days (After food).
2. Tab. Paracetamol 650mg - SOS (If fever > 100F).
3. Syp. Ascoril D - 2 tsp three times a day.
Advice: Steam inhalation twice daily. Drink warm water. Review after 5 days.
Doctor: Dr. A. K. Gupta (Reg: 45221)
"""

# 4. Create the Document with Metadata
# The metadata is KEY for your "Traceability" feature.
docs = [
    Document(
        page_content=sample_prescription_text,
        metadata={
            "source": "prescription_sample_01.jpg",
            "type": "handwritten_prescription",
            "patient_id": "rahul_001",
            "upload_timestamp": time.time()
        }
    )
]

# 5. Upload to Pinecone
print("🚀 Turning text into vectors and uploading...")

try:
    vectorstore = PineconeVectorStore.from_documents(
        documents=docs,
        embedding=embeddings,
        index_name=index_name
    )
    print("✅ Success! The dummy prescription is now inside the AI brain.")
except Exception as e:
    print(f"❌ Error uploading to Pinecone: {e}")