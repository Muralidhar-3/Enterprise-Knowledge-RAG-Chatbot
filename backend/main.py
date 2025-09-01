from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
from pypdf import PdfReader
from sentence_transformers import SentenceTransformer
from pinecone import Pinecone, ServerlessSpec
import google.generativeai as genai

# --------------------
# Setup FastAPI + CORS
# --------------------
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, restrict this
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --------------------
# Setup Pinecone
# --------------------
PINECONE_API_KEY = os.getenv("PINECONE_API_KEY", "pcsk_3LjMzT_3JtwzUPL7kU5xUkcmjc9QLENUzL1jK9rso2nU27pQHcdkxvACmKbtSG54bWyxx9")
INDEX_NAME = "knowledge-base"

pc = Pinecone(api_key=PINECONE_API_KEY)

# Create index if not exists
if INDEX_NAME not in [idx["name"] for idx in pc.list_indexes()]:
    pc.create_index(
        name=INDEX_NAME,
        dimension=384,  # dimension for all-MiniLM-L6-v2
        metric="cosine",
        spec=ServerlessSpec(cloud="aws", region="us-east-1")
    )

index = pc.Index(INDEX_NAME)

# Load embedding model
embedding_model = SentenceTransformer("all-MiniLM-L6-v2")

# --------------------
# Setup Gemini
# --------------------
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "AIzaSyAb83X_-HwnydYLlXrhHTaLx_Lkk4MlLB4")
genai.configure(api_key=GEMINI_API_KEY)
gemini_model = genai.GenerativeModel("gemini-1.5-flash")

# --------------------
# Helper: Extract PDF text
# --------------------
def extract_text_from_pdf(file_path: str) -> str:
    reader = PdfReader(file_path)
    text = ""
    for page in reader.pages:
        text += page.extract_text() or ""
    return text

# --------------------
# File Upload Endpoint
# --------------------
@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    file_path = f"uploaded_{file.filename}"
    
    # Save uploaded file
    with open(file_path, "wb") as f:
        f.write(await file.read())

    # Extract text (PDF only for now)
    if file.filename.endswith(".pdf"):
        text = extract_text_from_pdf(file_path)
    else:
        return {"status": "error", "message": "Only PDF supported for now"}

    # Chunking (naive: 500 chars)
    chunks = [text[i:i+500] for i in range(0, len(text), 500)]

    # Store chunks in Pinecone
    vectors = []
    for i, chunk in enumerate(chunks):
        emb = embedding_model.encode(chunk).tolist()
        vectors.append({
            "id": f"{file.filename}_{i}",
            "values": emb,
            "metadata": {"text": chunk, "source": file.filename}
        })
    index.upsert(vectors=vectors)

    return {
        "status": "success",
        "filename": file.filename,
        "chunks_added": len(chunks)
    }

# --------------------
# Chat Endpoint (Gemini + Pinecone)
# --------------------
class Query(BaseModel):
    query: str

@app.post("/chat")
async def chat(query: Query):
    # 1. Embed user query
    query_embedding = embedding_model.encode(query.query).tolist()

    # 2. Query Pinecone
    results = index.query(vector=query_embedding, top_k=3, include_metadata=True)

    retrieved_chunks = [
    {"text": match["metadata"]["text"], "source": match["metadata"]["source"]}
    for match in results["matches"]
    ]

    # 3. Construct context
    context = "\n\n".join([chunk["text"] for chunk in retrieved_chunks])

    # 4. Send to Gemini
    prompt = f"""You are a helpful assistant.
Use the following context to answer the user's question.

Context:
{context}

Question:
{query.query}

Answer:"""

    response = gemini_model.generate_content(prompt)

# Extract response text safely
    answer = ""
    if response and response.candidates:
        parts = response.candidates[0].content.parts
        answer = " ".join([p.text for p in parts if hasattr(p, "text")])
    else:
        answer = "No answer generated."

    return {
        "answer": answer,
        "sources": retrieved_chunks
    }

