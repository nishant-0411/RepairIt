'use client';

import { useChat } from '@ai-sdk/react';
import { HttpChatTransport } from 'ai';
import { Send, User, Bot } from 'lucide-react';

export default function TroubleshootPage() {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    transport: new HttpChatTransport({ url: 'http://localhost:8000/api/v1/chat/' }),
  });

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <header className="bg-white shadow-sm py-4 px-6 border-b">
        <h1 className="text-xl font-bold text-gray-800">Troubleshooting Assistant</h1>
      </header>

      <main className="flex-1 overflow-y-auto p-6 max-w-4xl mx-auto w-full">
        {messages.map((m) => (
          <div key={m.id} className={`flex items-start gap-4 mb-6 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`p-2 rounded-full ${m.role === 'user' ? 'bg-blue-100 text-blue-600' : 'bg-gray-200 text-gray-600'}`}>
              {m.role === 'user' ? <User size={20} /> : <Bot size={20} />}
            </div>
            <div className={`px-4 py-3 rounded-2xl max-w-[80%] ${m.role === 'user' ? 'bg-blue-600 text-white rounded-tr-sm' : 'bg-white shadow-sm border border-gray-100 rounded-tl-sm text-gray-800'}`}>
              <p className="whitespace-pre-wrap">{m.content}</p>
            </div>
          </div>
        ))}
      </main>

      <footer className="bg-white border-t p-4">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto relative flex items-center">
          <input
            className="w-full bg-gray-100 rounded-full py-3 pl-6 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 border-transparent transition-all"
            value={input}
            placeholder="Describe your issue..."
            onChange={handleInputChange}
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="absolute right-2 p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send size={18} />
          </button>
        </form>
      </footer>
    </div>
  );
}
