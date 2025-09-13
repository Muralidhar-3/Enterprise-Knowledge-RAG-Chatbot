"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

export default function FileUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("http://localhost:8000/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      alert(`Uploaded: ${data.filename}`);
    } catch (error) {
      console.error("Upload failed", error);
    } finally {
      // Clear file from state & input
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      setIsUploading(false);
    }
  };

  return (
    <div className="mb-6 flex gap-2 items-center">
      <Input
        ref={fileInputRef}
        type="file"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="w-72 bg-gray-100 text-black cursor-pointer"
      />

      {/* {file && (
        <p className="text-sm text-gray-600">
          Selected: <span className="font-medium">{file.name}</span>
        </p>
      )} */}

      <Button
        onClick={handleUpload}
        disabled={!file || isUploading}
        className="flex items-center gap-2"
      >
        {isUploading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Uploading...
          </>
        ) : (
          "Upload"
        )}
      </Button>
    </div>
  );
}

