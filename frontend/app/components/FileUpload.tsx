"use client";
import { useState } from "react";

export default function FileUpload() {
  const [file, setFile] = useState<File | null>(null);

  const handleUpload = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);

    await fetch("http://localhost:8000/upload", {
      method: "POST",
      body: formData,
    });
  };

  return (
    <div className="mb-4">
      <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
      <button 
        onClick={handleUpload} 
        className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg"
      >
        Upload
      </button>
    </div>
  );
}
