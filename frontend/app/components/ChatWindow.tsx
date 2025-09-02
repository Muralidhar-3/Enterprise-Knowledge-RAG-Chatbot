"use client";

import { useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Message {
  role: "user" | "ai";
  content: string;
  sources?: { text: string; source: string }[];
}

interface ChatWindowProps {
  currentSession: { id: number; messages: Message[] } | null;
  input: string;
  setInput: (v: string) => void;
  sendMessage: () => void;
  loading: boolean;
}

export default function ChatWindow({
  currentSession,
  input,
  setInput,
  sendMessage,
  loading,
}: ChatWindowProps) {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentSession?.messages, loading]);

  if (!currentSession) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500">
        Start a new chat to begin
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
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
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-900"
              }`}
            >
              <p>{msg.content}</p>
              {msg.role === "ai" && msg.sources && (
                <div className="mt-2 text-xs text-gray-700 border-t border-gray-300 pt-2">
                  <p className="font-semibold">Sources:</p>
                  <ul className="list-disc ml-4">
                    {msg.sources.map((src, idx) => (
                      <li key={idx}>
                        <em>{src.source}:</em> {src.text}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-200 text-gray-700 px-4 py-2 rounded-2xl animate-pulse">
              AI is thinking...
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t p-3 flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask something..."
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <Button onClick={sendMessage} disabled={loading}>
          Send
        </Button>
      </div>
    </div>
  );
}
