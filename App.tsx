import React, { useState, useCallback } from 'react';
import { GoogleGenAI } from "@google/genai";
import type { Chat } from "@google/genai";

import FileUploadPanel from './components/FileUploadPanel';
import AgendaView from './components/AgendaView';
import ChatBot from './components/ChatBot';
import { MessageCircleIcon } from './components/icons';
import { generateAgendaFromDocument } from './services/geminiService';
import type { Agenda, ChatMessage } from './types';


const App: React.FC = () => {
  // Existing state
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [agenda, setAgenda] = useState<Agenda | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // New chat state
  const [chat, setChat] = useState<Chat | null>(null);
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isChatLoading, setIsChatLoading] = useState<boolean>(false);


  const handleFileSelect = useCallback((name: string, content: string) => {
    setFileName(name);
    setFileContent(content);
    // Reset everything related to the previous file
    setAgenda(null);
    setError(null);
    setChat(null);
    setChatMessages([]);
    setIsChatOpen(false);
  }, []);

  const handleGenerateAgenda = useCallback(async () => {
    if (!fileContent) {
      setError("No file content to process.");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setAgenda(null);
    setChat(null); // Clear previous chat session
    setIsChatOpen(false);


    try {
      const generatedAgenda = await generateAgendaFromDocument(fileContent);
      setAgenda(generatedAgenda);
      
      // Initialize chat after agenda is created
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const initialContext = `CONTEXT: You are a helpful assistant. The user has uploaded a document and you have generated a meeting agenda from it. Now, answer the user's questions based ONLY on this document and agenda. Do not use external knowledge. If the answer isn't in the provided text, say that you cannot find the answer in the document.

      --- DOCUMENT CONTENT ---
      ${fileContent}
      --------------------------

      --- GENERATED AGENDA ---
      ${JSON.stringify(generatedAgenda, null, 2)}
      --------------------------
      `;

      const newChat = ai.chats.create({
        model: 'gemini-2.5-flash',
        history: [
          { role: 'user', parts: [{ text: initialContext }] },
          { role: 'model', parts: [{ text: "Understood. I'm ready to answer questions about the document and the agenda. How can I help?" }] }
        ]
      });
      setChat(newChat);

      // Add initial message to display in the chat UI
      setChatMessages([{ role: 'model', content: "I'm ready to answer questions about the document and the agenda. How can I help?" }]);

    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  }, [fileContent]);

  const handleSendMessage = useCallback(async (message: string) => {
    if (!chat) return;

    const userMessage: ChatMessage = { role: 'user', content: message };
    setChatMessages(prev => [...prev, userMessage]);
    setIsChatLoading(true);

    try {
      const response = await chat.sendMessage({ message });
      const modelMessage: ChatMessage = { role: 'model', content: response.text };
      setChatMessages(prev => [...prev, modelMessage]);
    } catch (err) {
      const errorMessage: ChatMessage = { role: 'model', content: "Sorry, I encountered an error. Please try again." };
      setChatMessages(prev => [...prev, errorMessage]);
      console.error("Chat error:", err);
    } finally {
      setIsChatLoading(false);
    }
  }, [chat]);


  return (
    <div className="flex flex-col md:flex-row h-screen antialiased">
      <aside className="w-full md:w-1/3 lg:w-1/4 h-1/2 md:h-full flex-shrink-0">
        <FileUploadPanel
          onFileSelect={handleFileSelect}
          onGenerate={handleGenerateAgenda}
          isLoading={isLoading}
          fileName={fileName}
          hasContent={!!fileContent}
        />
      </aside>
      <main className="flex-1 bg-slate-50 h-1/2 md:h-full overflow-hidden relative">
        <AgendaView agenda={agenda} isLoading={isLoading} error={error} />

        {/* Chatbot components */}
        {agenda && !isLoading && (
          <>
            <button
              onClick={() => setIsChatOpen(true)}
              className="fixed bottom-4 right-4 sm:right-8 bg-blue-600 text-white rounded-full p-4 shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 z-40 transition-transform hover:scale-110"
              aria-label="Open chat"
            >
              <MessageCircleIcon className="w-8 h-8" />
            </button>
            <ChatBot
              isOpen={isChatOpen}
              onClose={() => setIsChatOpen(false)}
              messages={chatMessages}
              onSendMessage={handleSendMessage}
              isLoading={isChatLoading}
            />
          </>
        )}
      </main>
    </div>
  );
};

export default App;
