"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function FileUpload() {
  const [file, setFile] = useState<File | null>(null);

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("http://localhost:8000/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    alert(`Uploaded: ${data.filename}`);
    setFile(null);
  };

  return (
    <div className="mb-6 flex gap-2 items-center">
      <Input
        type="file"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="w-64"
      />
      <Button onClick={handleUpload}>Upload</Button>
    </div>
  );
}
