import os
import base64
import json
import re
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import HumanMessage
from dotenv import load_dotenv

load_dotenv()

# We use the latest Flash model for Vision capabilities.
vision_llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash",
    temperature=0.0,
    google_api_key=os.getenv("GOOGLE_API_KEY") 
)

def clean_json_string(s):
    """
    Aggressive cleaner for AI JSON output.
    1. Removes Markdown code blocks.
    2. Uses Regex to find the main JSON object { ... }.
    """
    # Step 1: Remove Markdown formatting
    s = s.replace("```json", "").replace("```", "").strip()
    
    # Step 2: Use Regex to find the first '{' and the last '}'
    # This ignores "Here is your analysis:" prefixes.
    match = re.search(r"\{[\s\S]*\}", s)
    if match:
        return match.group(0)
    return s

async def analyze_xray(file_bytes: bytes, filename: str):
    try:
        print(f"🩻 Scanning X-Ray: {filename}...")
        
        # 1. Prepare Image for the AI
        image_b64 = base64.b64encode(file_bytes).decode("utf-8")
        
        # 2. The Radiologist Prompt (Strict JSON)
        prompt = """
        You are an expert Radiologist. Analyze this medical scan.
        
        TASK:
        1. DETECT: Identify fractures, abnormalities, or verify if Normal.
        2. LOCATE: Specific body part and side.
        
        OUTPUT FORMAT (Strict JSON only, no trailing commas):
        {
            "finding": "Diagnosis (e.g. Distal Radius Fracture)",
            "location": "Specific location (e.g. Right Wrist)",
            "severity": "Mild / Moderate / Severe",
            "notes": "One sentence summary."
        }
        """
        
        message = HumanMessage(
            content=[
                {"type": "text", "text": prompt},
                {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{image_b64}"}}
            ]
        )
        
        # 3. Invoke the Vision Model
        response = vision_llm.invoke([message])
        
        # 4. Handle Response Content
        content = response.content
        if isinstance(content, list):
            content = content[0]
        content_str = str(content)
        
        print(f"🔍 Raw AI Output: {content_str}") # Debug print

        # 5. Clean & Parse
        clean_json = clean_json_string(content_str)
        
        try:
            analysis_result = json.loads(clean_json)
        except json.JSONDecodeError:
            print("⚠️ Standard JSON parse failed. Trying repair...")
            # Fallback: Sometimes AI leaves a trailing comma like {"a":1,}
            # We try to remove it.
            clean_json = re.sub(r",\s*}", "}", clean_json)
            try:
                analysis_result = json.loads(clean_json)
            except:
                # Ultimate Fail-Safe
                analysis_result = {
                    "finding": "Analysis Failed",
                    "severity": "Unknown",
                    "location": "See Image",
                    "notes": "Could not parse AI response."
                }

        return {
            "status": "success",
            "filename": filename,
            "analysis": analysis_result
        }

    except Exception as e:
        print(f"❌ X-Ray Analysis Failed: {e}")
        return {
            "status": "error", 
            "message": str(e),
            "analysis": {
                "finding": "System Error",
                "severity": "Unknown",
                "location": "Unknown",
                "notes": str(e)
            }
        }