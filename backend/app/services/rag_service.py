import os
# 1. Standard Imports
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings
from langchain_pinecone import PineconeVectorStore

# 2. Updated Core Imports (The Fix)
from langchain.chains import RetrievalQA
from langchain_core.prompts import PromptTemplate  # We fixed this earlier

load_dotenv()

# 1. Connect to the Index you just verified
embeddings = GoogleGenerativeAIEmbeddings(model="models/text-embedding-004")
vectorstore = PineconeVectorStore(
    index_name=os.getenv("PINECONE_INDEX_NAME"),
    embedding=embeddings
)

# 2. Setup the AI (Gemini)
llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash", # Faster and great for this use case
    temperature=0.3,
    google_api_key=os.getenv("GOOGLE_API_KEY")
)

# 3. The "Traceability" Prompt
# This forces the AI to prove its work by citing the text.
template = """
You are E-parchi, an expert medical assistant.
Use the context below to answer the doctor's question.

CRITICAL INSTRUCTION:
1. Answer strictly based on the context.
2. Provide a "summary" of the diagnosis.
3. Provide "evidence" by quoting the exact text from the document.

Context: {context}

Question: {question}

Format your answer as a JSON object with keys: "summary", "diagnosis", "medicines" (list).
"""

QA_CHAIN_PROMPT = PromptTemplate.from_template(template)

def get_rag_response(query_text: str, file_id: str = None):
    try:
        # 1. Create a Filter (If file_id is provided)
        search_kwargs = {"k": 3}
        if file_id:
            search_kwargs["filter"] = {"file_id": file_id}

        # 2. Pass the filter to the Retriever
        qa_chain = RetrievalQA.from_chain_type(
            llm=llm,
            chain_type="stuff",
            retriever=vectorstore.as_retriever(search_kwargs=search_kwargs), # <--- Filter applied here
            chain_type_kwargs={"prompt": QA_CHAIN_PROMPT},
            return_source_documents=True
        )

        result = qa_chain.invoke({"query": query_text})
        
# Clean up the AI response (remove ```json markers)
        clean_json = result["result"].replace("```json", "").replace("```", "").strip()
        
        return {
            "status": "success",
            "ai_response": clean_json, 
            "source_document": result["source_documents"][0].metadata.get("source")
        }
    except Exception as e:
        return {"status": "error", "message": str(e)}