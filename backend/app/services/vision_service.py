import os
import base64
import json
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import HumanMessage
from dotenv import load_dotenv

load_dotenv()

# We use the latest Flash model for Vision capabilities.
# Note: Ensure your API key has access to this model version.
vision_llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash",
    temperature=0.0,
    google_api_key=os.getenv("GOOGLE_API_KEY") # type: ignore
)

async def analyze_xray(file_bytes: bytes, filename: str):
    try:
        print(f"🩻 Scanning X-Ray: {filename}...")
        
        # 1. Prepare Image for the AI
        image_b64 = base64.b64encode(file_bytes).decode("utf-8")
        
        # 2. The Radiologist Prompt
        # We ask for "Location" to satisfy your requirement to "point out" the problem.
        prompt = """
        You are an expert Radiologist and Orthopedic Surgeon. 
        Analyze this medical scan.
        
        TASK:
        1. DETECT: Identify any fractures, dislocations, or abnormalities.
        2. LOCATE: Specifically describe WHERE the problem is (e.g., "Distal 1/3rd of the radius").
        3. PRESCRIBE: Suggest standard immediate treatment guidelines (First Aid/Splinting) and next steps.
        
        OUTPUT FORMAT (Return ONLY raw JSON):
        {
            "finding": "Short medical diagnosis (e.g., Tibia Fracture)",
            "location": "Specific location description",
            "severity": "Low / Moderate / Severe",
            "treatment_plan": [
                "Step 1: ...",
                "Step 2: ..."
            ],
            "is_normal": false
        }
        
        If the image is Normal, set "is_normal": true and "finding": "No abnormalities detected".
        If the image is NOT a medical scan, return {"error": "Invalid Image"}.
        """
        
        message = HumanMessage(
            content=[
                {"type": "text", "text": prompt},
                {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{image_b64}"}}
            ]
        )
        
        # 3. Invoke the Vision Model
        response = vision_llm.invoke([message])
        
        # 4. Clean and Parse JSON
        content = response.content if isinstance(response.content, str) else response.content[0] if response.content else ""
        content_str = str(content) if not isinstance(content, str) else content
        clean_json = content_str.replace("```json", "").replace("```", "").strip()
        
        try:
            analysis_result = json.loads(clean_json)
        except json.JSONDecodeError:
            # Fallback if the AI chatters instead of giving JSON
            analysis_result = {
                "finding": "Analysis Complete",
                "raw_output": clean_json
            }

        return {
            "status": "success",
            "filename": filename,
            "analysis": analysis_result
        }

    except Exception as e:
        print(f"❌ X-Ray Analysis Failed: {e}")
        return {"status": "error", "message": str(e)}