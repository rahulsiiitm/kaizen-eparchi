from fastapi import FastAPI, UploadFile, File, HTTPException
from pydantic import BaseModel
from app.services.rag_service import get_rag_response
from app.services.ingest_service import process_upload
from app.services.vision_service import analyze_xray
from app.core.config import settings

app = FastAPI(title="E-parchi AI Backend")

class QueryRequest(BaseModel):
    query: str
    file_id: str | None = None

@app.get("/")
def read_root():
    return {"status": "online", "message": "E-parchi Brain is Active"}

# This is the endpoint the Frontend will call to ask questions
@app.post("/analyze/query")
async def query_records(request: QueryRequest):
    print(f"📝 Received Question: {request.query}")
    response = get_rag_response(request.query)
    return response

@app.post("/upload")
async def upload_document(file: UploadFile = File(...)):
    # 1. Check if filename is provided
    if file.filename is None:
        raise HTTPException(status_code=400, detail="File must have a filename.")
    
    # 2. Read the uploaded bytes
    content = await file.read()
    
    # 3. Feed it to the brain
    result = process_upload(content, file.filename)
    
    return result

@app.post("/analyze/xray")
async def analyze_scan(file: UploadFile = File(...)):
    # 1. Check for valid image types
    if file.content_type not in ["image/jpeg", "image/png", "image/webp"]:
        raise HTTPException(status_code=400, detail="Invalid file type. Please upload an X-Ray image.")

    # 2. Check if filename is provided
    if file.filename is None:
        raise HTTPException(status_code=400, detail="File must have a filename.")

    # 3. Process
    content = await file.read()
    result = await analyze_xray(content, file.filename)

    return result

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)