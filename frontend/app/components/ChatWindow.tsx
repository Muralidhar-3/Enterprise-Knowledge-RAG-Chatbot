"use client";

import { useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";


interface Message {
  role: "user" | "ai";
  content: string;
  sources?: { text: string; source: string }[];
}

interface Session {
  id: number;
  messages: Message[];
}

interface ChatWindowProps {
  currentSession: Session | null;
  setCurrentSession: (session: Session | null) => void; // ✅ added setter
  input: string;
  setInput: (v: string) => void;
  sendMessage: () => void;
  loading: boolean;
}

export default function ChatWindow({
  currentSession,
  setCurrentSession,
  input,
  setInput,
  sendMessage,
  loading,
}: ChatWindowProps) {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const [openSources, setOpenSources] = useState<{ [key: number]: boolean }>({});

  // Toggle for sources
  const toggleOpen = (index: number) => {
    setOpenSources((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  // scroll into view on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentSession?.messages, loading]);

  // 🔹 Load persisted chats
  useEffect(() => {
    const saved = localStorage.getItem("chatSessions");
    if (saved && !currentSession) {
      const sessions: Session[] = JSON.parse(saved);
      if (sessions.length > 0) {
        setCurrentSession(sessions[sessions.length - 1]); // load last session
      }
    }
  }, []);

  // 🔹 Save chat when messages change
  useEffect(() => {
    if (currentSession) {
      const saved = localStorage.getItem("chatSessions");
      const sessions: Session[] = saved ? JSON.parse(saved) : [];
      const updated = sessions.map((s) =>
        s.id === currentSession.id ? currentSession : s
      );
      const exists = sessions.some((s) => s.id === currentSession.id);
      if (!exists) updated.push(currentSession);
      localStorage.setItem("chatSessions", JSON.stringify(updated));
    }
  }, [currentSession]);

  if (!currentSession) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-400 bg-gray-900/10 rounded-lg border border-gray-800 m-4">
        <div className="text-center">
          <Brain className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-lg">Start a new chat to begin</p>
          <p className="text-sm text-gray-500 mt-2">Upload documents and ask questions about your knowledge base</p>
        </div>
      </div>
    );
  }

  

  return (
    <div className="flex-1 flex flex-col h-80 min-w-[75%] max-w-[75%] bg-black">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-900/20 rounded-t-lg border border-gray-800">
        {currentSession.messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[75%] px-4 py-2 rounded-2xl ${
                msg.role === "user"
                  ? "bg-white text-black"
                  : "bg-gray-800 text-white border border-gray-700"
              }`}
            >
              <p>{msg.content}</p>
              {msg.role === "ai" && msg.sources && (
                <div className="mt-2 text-xs text-gray-400 border-t border-gray-600 pt-2">
                  <button
                    onClick={() => toggleOpen(i)}
                    className="flex items-center gap-1 font-semibold text-gray-300 hover:text-white hover:underline"
                  >
                    {openSources[i] ? (
                      <ChevronDown size={14} />
                    ) : (
                      <ChevronRight size={14} />
                    )}
                    Sources
                  </button>

                  {openSources[i] && (
                    <ul className="list-disc ml-5 mt-2 space-y-1">
                      {msg.sources.map((src, idx) => (
                        <li key={idx} className="text-gray-400">
                          <em>{src.source}:</em> {src.text}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}

            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-800 text-gray-300 px-4 py-2 rounded-2xl animate-pulse border border-gray-700">
              AI is thinking...
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 flex gap-2 bg-gray-900/20 rounded-b-lg border-x border-b border-gray-800">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask something..."
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-gray-600"
        />
        <Button 
          onClick={sendMessage} 
          disabled={loading}
          className="bg-white text-black hover:bg-gray-200 transition-all duration-300"
        >
          Send
        </Button>
      </div>
    </div>
  );
}
