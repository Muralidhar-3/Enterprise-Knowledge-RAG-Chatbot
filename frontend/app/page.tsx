"use client";

import { useState } from "react";
import FileUpload from "./components/FileUpload";
import ChatWindow from "./components/ChatWindow";
import Sidebar from "./components/Sidebar";

export default function Home() {
  const [sessions, setSessions] = useState<any[]>([]);
  const [currentSession, setCurrentSession] = useState<any | null>(null);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const startNewSession = () => {
    const newSession = {
      id: Date.now(),
      title: `Chat ${sessions.length + 1}`,
      messages: [],
    };
    setSessions([...sessions, newSession]);
    setCurrentSession(newSession);
  };

  const sendMessage = async () => {
    if (!input.trim() || !currentSession) return;

    const userMessage = { role: "user" as const, content: input };
    const updatedSession = {
      ...currentSession,
      messages: [...currentSession.messages, userMessage],
    };
    updateSession(updatedSession);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("http://127.0.0.1:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: input }),
      });
      const data = await res.json();

      const aiMessage = {
        role: "ai" as const,
        content: data.answer,
        sources: data.sources,
      };
      const newUpdatedSession = {
        ...updatedSession,
        messages: [...updatedSession.messages, aiMessage],
      };
      updateSession(newUpdatedSession);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateSession = (updated: any) => {
    setSessions((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
    setCurrentSession(updated);
  };

  return (
    <main className="flex h-screen">
      <Sidebar
        sessions={sessions}
        currentSessionId={currentSession?.id || null}
        onSelectSession={(id) => setCurrentSession(sessions.find((s) => s.id === id))}
        onNewSession={startNewSession}
        sidebarOpen={sidebarOpen}
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />

      <div className="flex flex-col items-center flex-1">
        <h1 className="text-2xl font-bold p-4 border-b">
          Enterprise-Knowledge-RAG-Chatbot
        </h1>
        <FileUpload />
        <ChatWindow
          currentSession={currentSession}
          setCurrentSession={setCurrentSession}
          input={input}
          setInput={setInput}
          sendMessage={sendMessage}
          loading={loading}
        />
      </div>
    </main>
  );
}
