from fastapi import FastAPI
from app.routers import upload, chat

app = FastAPI(title="Enterprise-Knowledge-RAG-Chatbot", version="1.0.0")

# Routers
app.include_router(upload.router, prefix="/upload", tags=["Upload"])
app.include_router(chat.router, prefix="/chat", tags=["Chat"])

@app.get("/")
def root():
      return {"message": "Enterprise-Knowledge-RAG-Chatbot API is running"}