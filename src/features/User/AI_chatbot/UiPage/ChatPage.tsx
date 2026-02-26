import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css'; // Required for LaTeX styling
import { ChatHeader } from '../components/ChatHeader';
import { ChatInput } from '../components/ChatInput';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const ChatPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Holo! 🇿🇦 I'm **PromptPal**. Ready for some Maths or Science? Example: Ask me about $E=mc^2$ or fractions like $\\frac{1}{2}$." }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom whenever messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = { role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:8000/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: text }),
      });

      if (!response.ok) throw new Error("Server error");

      const result = await response.json();
      
      // Adjust result.data.hint based on your specific backend JSON structure
      const assistantResponse = result.data?.hint || result.hint || "I couldn't generate a hint.";

      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: assistantResponse 
      }]);
    } catch (err) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "Eish, something went wrong with the connection. Is the Docker backend running?" 
      }]);
    } finally {
      setIsLoading(false);
    }
  };
    return (
    <div className="min-h-screen bg-black text-white font-sans">
      <ChatHeader />
      
      <main className="max-w-3xl mx-auto px-6 pt-32 pb-48">
        <div className="space-y-6">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {/* Using ChatMessage if you want, or keeping the clean div style below */}
              <div className={`max-w-[85%] p-4 rounded-2xl ${msg.role === 'user' ? 'bg-blue-600' : 'bg-gray-900 border border-gray-800'}`}>
                
                {/* FIX 1: Wrap ReactMarkdown in a div for styling to solve Error 2322 */}
                <div className="prose prose-invert max-w-none text-sm md:text-base">
                  <ReactMarkdown 
                    remarkPlugins={[remarkMath]} 
                    rehypePlugins={[rehypeKatex]}
                  >
                    {msg.content}
                  </ReactMarkdown>
                </div>

              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex items-center space-x-2 text-blue-400 animate-pulse pl-4">
              <span className="text-sm font-medium">PromptPal is thinking...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* FIX 2: Only pass props your ChatInput actually accepts (removed 'disabled') */}
      <ChatInput onSend={handleSend} />
    </div>
  );
};

export default ChatPage;