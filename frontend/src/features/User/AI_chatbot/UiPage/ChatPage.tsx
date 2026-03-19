import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import { ChatHeader } from '../components/ChatHeader';
import { ChatInput } from '../components/ChatInput';
import { Mermaid } from '../components/Mermaid';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  diagram?: string;
}

const ChatPage: React.FC = () => {

  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Holo! 🇿🇦 I'm **PromptPal**. Ready for some Maths or Science?" }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);


  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, isLoading]);

  const handleSend = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = { role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const CHAT_API_URL = import.meta.env.VITE_CHAT_API_URL || 'https://multi-agent-system-promptpal.onrender.com';
      const response = await fetch(CHAT_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: text }),
      });

      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullText = "";

      // Add empty assistant bubble to fill up as we stream
      setMessages(prev => [...prev, { role: 'assistant', content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n\n");

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;

          try {
            const json = JSON.parse(line.replace("data: ", ""));

            if (json.type === "hint_delta") {
              fullText += json.delta;
              setMessages(prev => {
                const updated = [...prev];
                updated[updated.length - 1] = { ...updated[updated.length - 1], content: fullText };
                return updated;
              });
            }

            if (json.type === "complete") {
              setMessages(prev => {
                const updated = [...prev];
                updated[updated.length - 1] = {
                  ...updated[updated.length - 1],
                  content: fullText,
                  diagram: json.data?.diagram
                };
                return updated;
              });
            }
          } catch (err) {
            console.error("Parse error in chunk:", err);
          }
        }
      }
    } catch (err) {
      console.error("Connection Error:", err);
      setMessages(prev => [...prev, { role: 'assistant', content: "Eish, connection load-shedding! 🔌 Is the Render backend awake?" }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg text-brand-text font-sans selection:bg-brand-primary/30">
      <ChatHeader />
      <main className="max-w-3xl mx-auto px-6 pt-32 pb-48">
        <div className="space-y-8">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-4 duration-500`}>
              <div className={`max-w-[90%] p-6 rounded-3xl ${msg.role === 'user' ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20' : 'bg-white border border-brand-primary/10 shadow-sm'}`}>
                <div className={`prose ${msg.role === 'user' ? 'prose-invert' : 'prose-neutral'} max-w-none text-sm md:text-base leading-relaxed`}>
                  <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>{msg.content}</ReactMarkdown>
                </div>
                {msg.diagram && (
                  <div className={`mt-6 pt-6 border-t ${msg.role === 'user' ? 'border-white/20' : 'border-brand-primary/10'}`}>
                    <p className={`text-[10px] font-black uppercase tracking-[0.2em] mb-3 text-center ${msg.role === 'user' ? 'text-white' : 'text-brand-primary'}`}>Interactive Map 🗺️</p>
                    <Mermaid chart={msg.diagram} />
                  </div>
                )}
              </div>
            </div>
          ))}
          {isLoading && <div className="text-brand-primary pl-4 animate-pulse font-black italic uppercase text-xs tracking-widest">Sharp-sharp, thinking...</div>}
          <div ref={messagesEndRef} />
        </div>
      </main>
      <ChatInput onSend={handleSend} />
    </div>
  );
};

export default ChatPage;
