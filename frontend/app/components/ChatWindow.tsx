"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Message {
  role: "user" | "ai";
  content: string;
  sources?: { text: string; source: string }[];
}

export default function ChatWindow() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { role: "user" as const, content: input }];
    setMessages(newMessages);
    setInput("");

    try {
      const res = await fetch("http://127.0.0.1:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: input }),
      });

      const data = await res.json();

      setMessages([
        ...newMessages,
        {
          role: "ai",
          content: data.answer,
          sources: data.sources,
        },
      ]);
    } catch (error) {
      console.error("Error fetching chat:", error);
    }
  };

  return (
    <div className="w-full max-w-2xl">
      <div className="h-96 overflow-y-auto border rounded-md p-4 mb-4 space-y-2">
        {messages.map((msg, i) => (
          <Card key={i} className={msg.role === "user" ? "bg-blue-50" : "bg-gray-100"}>
            <CardContent className="p-2">
              <p>
                <strong>{msg.role === "user" ? "You" : "AI"}:</strong> {msg.content}
              </p>
              {msg.role === "ai" && msg.sources && (
                <div className="mt-2 text-sm text-gray-600">
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
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask something..."
        />
        <Button onClick={sendMessage}>Send</Button>
      </div>
    </div>
  );
}
