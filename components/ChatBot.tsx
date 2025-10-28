import React, { useState, useEffect, useRef } from 'react';
import type { ChatMessage } from '../types';
import { SendIcon, XIcon, SparklesIcon } from './icons';

interface ChatBotProps {
  isOpen: boolean;
  onClose: () => void;
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

const ChatBot: React.FC<ChatBotProps> = ({ isOpen, onClose, messages, onSendMessage, isLoading }) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-20 right-4 sm:right-8 w-[calc(100%-2rem)] sm:w-96 h-[60vh] max-h-[700px] bg-white rounded-xl shadow-2xl flex flex-col z-50 transition-all duration-300">
      <header className="flex items-center justify-between p-4 border-b border-slate-200">
        <div className="flex items-center">
          <SparklesIcon className="w-6 h-6 text-blue-600 mr-2" />
          <h2 className="text-lg font-bold text-slate-800">Ask Gemini</h2>
        </div>
        <button onClick={onClose} className="text-slate-500 hover:text-slate-800">
          <XIcon className="w-6 h-6" />
        </button>
      </header>
      
      <div className="flex-1 p-4 overflow-y-auto bg-slate-50">
        <div className="flex flex-col space-y-4">
          {messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[80%] rounded-lg px-4 py-2 text-sm ${
                  msg.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-200 text-slate-800'
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
               <div className="max-w-[80%] rounded-lg px-4 py-2 text-sm bg-slate-200 text-slate-800">
                <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-slate-500 rounded-full animate-pulse [animation-delay:-0.3s]"></div>
                    <div className="w-2 h-2 bg-slate-500 rounded-full animate-pulse [animation-delay:-0.15s]"></div>
                    <div className="w-2 h-2 bg-slate-500 rounded-full animate-pulse"></div>
                </div>
               </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      <footer className="p-4 border-t border-slate-200">
        <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question..."
            className="flex-1 px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            className="bg-blue-600 text-white p-2.5 rounded-md hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed"
            disabled={isLoading || !input.trim()}
          >
            <SendIcon className="w-5 h-5" />
          </button>
        </form>
      </footer>
    </div>
  );
};

export default ChatBot;
