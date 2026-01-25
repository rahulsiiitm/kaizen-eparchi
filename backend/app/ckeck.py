import google.generativeai as genai
import os
from dotenv import load_dotenv

# Load your .env file
load_dotenv()

api_key = os.getenv("GOOGLE_API_KEY")

if not api_key:
    print("❌ Error: GOOGLE_API_KEY not found in .env")
else:
    print(f"🔑 checking models for API Key: {api_key[:5]}...")
    try:
        genai.configure(api_key=api_key)
        
        print("\n✅ AVAILABLE MODELS:")
        print("-" * 30)
        # List all models that support content generation
        for m in genai.list_models():
            if 'generateContent' in m.supported_generation_methods:
                print(f"- {m.name}")
        print("-" * 30)
        
    except Exception as e:
        print(f"❌ Error listing models: {e}")