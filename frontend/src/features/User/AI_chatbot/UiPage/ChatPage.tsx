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

// ... (keep your existing imports)

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
      // NOTE: Using FETCH here because it handles Streams (Reader) better than Axios
      const response = await fetch('https://multi-agent-system-promptpal.onrender.com', {
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
    <div className="min-h-screen bg-black text-white font-sans selection:bg-blue-500/30">
      <ChatHeader />
      <main className="max-w-3xl mx-auto px-6 pt-32 pb-48">
        <div className="space-y-8">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-4 duration-500`}>
              <div className={`max-w-[90%] p-6 rounded-3xl ${msg.role === 'user' ? 'bg-blue-600 shadow-[0_0_25px_rgba(37,99,235,0.3)]' : 'bg-zinc-900 border border-white/5 shadow-2xl'}`}>
                <div className="prose prose-invert max-w-none text-sm md:text-base leading-relaxed">
                  <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>{msg.content}</ReactMarkdown>
                </div>
                {msg.diagram && (
                  <div className="mt-6 pt-6 border-t border-white/5">
                    <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-3 text-center">Interactive Map 🗺️</p>
                    <Mermaid chart={msg.diagram} />
                  </div>
                )}
              </div>
            </div>
          ))}
          {isLoading && <div className="text-blue-400 pl-4 animate-pulse">Sharp-sharp, thinking...</div>}
          <div ref={messagesEndRef} />
        </div>
      </main>
      <ChatInput onSend={handleSend} />
    </div>
  );
};

export default ChatPage;
