"use client";

import { Menu, X, SquarePen, ChevronDown, ChevronRight, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

interface SidebarProps {
  sessions: { id: number; title: string }[];
  currentSessionId: number | null;
  onSelectSession: (id: number) => void;
  onNewSession: () => void;
  sidebarOpen: boolean;
  toggleSidebar: () => void;
}

export default function Sidebar({
  sessions,
  currentSessionId,
  onSelectSession,
  onNewSession,
  sidebarOpen,
  toggleSidebar,
}: SidebarProps) {
      const [files, setFiles] = useState<string[]>([]);
      const [filesOpen, setFilesOpen] = useState(false);

      useEffect(() => {
      fetch("http://localhost:8000/files")
            .then(res => res.json())
            .then(data => setFiles(data.files || []));
      }, []);

      const deleteFile = async (filename: string) => {
      await fetch(`http://localhost:8000/files/${filename}`, { method: "DELETE" });
      setFiles(files.filter(f => f !== filename));
      };

      const resetKB = async () => {
      await fetch(`http://localhost:8000/files/reset`, { method: "DELETE" });
      setFiles([]);
      };

      return (
      <div
            className={`${
            sidebarOpen ? "w-64" : "w-16"
            } bg-gray-950 text-white flex flex-col transition-all duration-300 border-r border-gray-800`}
      >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-800">
            <span className={`${sidebarOpen ? "block" : "hidden"} font-bold`}>
            Chats
            </span>
            <button onClick={toggleSidebar}>
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            </div>

            {/* New Chat Button */}
            <div className="p-4">
            <Button
            className="w-full flex items-center justify-center gap-2 bg-white text-black hover:bg-gray-200 transition-all duration-300"
            onClick={onNewSession}
            >
            <SquarePen size={18} />
            <span className={`${sidebarOpen ? "block" : "hidden"} font-semibold`}>
                  New Chat
            </span>
            </Button>
            </div>

            {/* Session List */}
            <div className="flex-1 overflow-y-auto p-2 space-y-2">
            {sessions.map((s) => (
            <button
                  key={s.id}
                  className={`w-full text-left px-3 py-2 rounded-md ${
                  currentSessionId === s.id ? "bg-gray-800" : "hover:bg-gray-900"
                  }`}
                  onClick={() => onSelectSession(s.id)}
            >
                  {sidebarOpen ? s.title : "💬"}
            </button>
            ))}
            </div>

            {/* Uploaded Files Section */}
           <div className="border-t border-gray-800">
            <button
            onClick={() => setFilesOpen(!filesOpen)}
           className="flex items-center justify-between w-full px-4 py-2 hover:bg-gray-900"
            >
            <span>{sidebarOpen ? "Uploaded Files" : "📂"}</span>
            {sidebarOpen && (filesOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />)}
            </button>
            {filesOpen && sidebarOpen && (
            <div className="pl-4 space-y-2 pb-5">
                  {files.length === 0 && <p className="text-gray-400 text-sm">No files uploaded</p>}
                  {files.map(f => (
                 <div key={f} className="flex items-center justify-between text-sm bg-gray-900 px-2 py-1 rounded">
                  <span className="truncate">{f}</span>
                  <button onClick={() => deleteFile(f)} className="text-red-400 hover:text-red-600">
                        <Trash2 size={14} />
                  </button>
                  </div>
                  ))}
                  {/* <button onClick={resetKB} className="w-full text-xs text-red-500 mt-2 hover:text-red-700">
                  Reset Knowledge Base
                  </button> */}
            </div>
            )}
            </div>

            
      </div>
      );
}
