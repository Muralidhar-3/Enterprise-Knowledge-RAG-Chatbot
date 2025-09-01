"use client";
import { useState } from "react";

export default function ChatWindow() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ role: string, text: string }[]>([]);

  const sendMessage = async () => {
    const res = await fetch("http://localhost:8000/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: input }),
    });

    const data = await res.json();
    setMessages([...messages, { role: "user", text: input }, { role: "ai", text: data.answer }]);
    setInput("");
  };

  return (
    <div className="w-full max-w-lg mt-6">
      <div className="border rounded-lg p-4 h-64 overflow-y-scroll bg-gray-50">
        {messages.map((msg, i) => (
          <p key={i} className={msg.role === "user" ? "text-right" : "text-left"}>
            <b>{msg.role}:</b> {msg.text}
          </p>
        ))}
      </div>
      <div className="flex mt-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 border px-2 py-1 rounded-lg"
          placeholder="Ask something..."
        />
        <button 
          onClick={sendMessage} 
          className="ml-2 px-4 py-1 bg-green-500 text-white rounded-lg"
        >
          Send
        </button>
      </div>
    </div>
  );
}
