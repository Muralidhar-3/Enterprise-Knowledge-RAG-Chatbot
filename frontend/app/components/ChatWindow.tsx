"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Message {
  role: "user" | "ai";
  content: string;
}

export default function ChatWindow() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { role: "user" as const, content: input }];
    setMessages(newMessages);
    setInput("");

    // 🔗 Call FastAPI
    const res = await fetch("http://localhost:8000/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: input }),
    });

    const data = await res.json();

    setMessages([
      ...newMessages,
      { role: "ai", content: data.answer },
    ]);
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
