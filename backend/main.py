from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

# Allow frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, restrict this
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --------------------
# File Upload Endpoint
# --------------------
@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    contents = await file.read()
    # TODO: process with embeddings + vector DB later
    with open(f"uploaded_{file.filename}", "wb") as f:
        f.write(contents)
    return {"status": "success", "filename": file.filename}


# --------------------
# Chat Endpoint
# --------------------
class Query(BaseModel):
    query: str

@app.post("/chat")
async def chat(query: Query):
    # TODO: integrate RAG logic here
    return {"answer": f"Echo: {query.query}"}
