import FileUpload from "./components/FileUpload";
import ChatWindow from "./components/ChatWindow";

export default function Home() {
  return (
    <main className="flex flex-col items-center p-6">
      <h1 className="text-2xl font-bold mb-6">AI Knowledge Base Chatbot</h1>
      <FileUpload />
      <ChatWindow />
    </main>
  );
}
