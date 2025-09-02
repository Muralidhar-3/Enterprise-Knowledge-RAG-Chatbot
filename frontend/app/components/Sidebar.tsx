"use client";

import { Menu, X, SquarePen  } from "lucide-react";
import { Button } from "@/components/ui/button";

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
  return (
    <div
      className={`${
        sidebarOpen ? "w-64" : "w-16"
      } bg-gray-900 text-white flex flex-col transition-all duration-300`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <span className={`${sidebarOpen ? "block" : "hidden"} font-bold`}>
          Chats
        </span>
        <button onClick={toggleSidebar}>
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Session List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {sessions.map((s) => (
          <button
            key={s.id}
            className={`w-full text-left px-3 py-2 rounded-md ${
              currentSessionId === s.id ? "bg-gray-700" : "hover:bg-gray-800"
            }`}
            onClick={() => onSelectSession(s.id)}
          >
            {sidebarOpen ? s.title : "💬"}
          </button>
        ))}
      </div>

      {/* New Chat Button */}
      <div className="p-4">
        <Button
          className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700"
          onClick={onNewSession}
        >
          <SquarePen size={18} />
          <span className={`${sidebarOpen ? "block" : "hidden"} font-semibold`}>
            New Chat
          </span>
        </Button>
      </div>
    </div>
  );
}
