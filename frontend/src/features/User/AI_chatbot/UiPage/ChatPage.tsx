import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css'; 
import { ChatHeader } from '../components/ChatHeader';
import { ChatInput } from '../components/ChatInput';
import { Mermaid } from '../components/Mermaid';
import { useVoice } from '../../hooks/useVoice';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  diagram?: string;
}

const ChatPage: React.FC = () => {
  // 1. ADD MUTE STATE
  const [isMuted, setIsMuted] = useState(false);
  
  // 2. EXTRACT STOP FROM HOOK
  const { speak, stop } = useVoice(); 
  
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Holo! 🇿🇦 I'm **PromptPal**. Ready for some Maths or Science? Example: Ask me about $E=mc^2$ or fractions like $\\frac{1}{2}$." }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 3. EFFECT TO KILL SPEECH INSTANTLY ON MUTE
  useEffect(() => {
    if (isMuted) stop();
  }, [isMuted, stop]);

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
      const hintText = result.data?.hint || "Aowa! I couldn't get a hint. Try again?";
      const diagramCode = result.data?.diagram || "";

      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: hintText,
        diagram: diagramCode 
      }]);
      
      // 4. GUARD SPEECH WITH isMuted STATE
      if (!isMuted) {
        speak(hintText, isMuted);
      }

    } catch (err) {
      const errorMsg = "Eish, connection load-shedding! 🔌 Is the Docker backend running?";
      setMessages(prev => [...prev, { role: 'assistant', content: errorMsg }]);
      if (!isMuted) speak("Eish, connection load-shedding!", isMuted);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-blue-500/30">
      {/* 5. PASS STATE AND TOGGLE TO HEADER */}
      <ChatHeader 
        isMuted={isMuted} 
        onToggleMute={() => setIsMuted(!isMuted)} 
      />
      
      <main className="max-w-3xl mx-auto px-6 pt-32 pb-48">
        <div className="space-y-8">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-4 duration-500`}>
              <div className={`max-w-[90%] p-6 rounded-3xl ${
                msg.role === 'user' 
                  ? 'bg-blue-600 shadow-[0_0_25px_rgba(37,99,235,0.3)]' 
                  : 'bg-zinc-900 border border-white/5 shadow-2xl'
              }`}>
                
                <div className="prose prose-invert max-w-none text-sm md:text-base leading-relaxed">
                  <ReactMarkdown 
                    remarkPlugins={[remarkMath]} 
                    rehypePlugins={[rehypeKatex]}
                    components={{
                        // @ts-ignore
                        div: ({node, ...props}) => <div className="my-4 p-4 bg-white/5 rounded-xl border border-white/10" {...props} />
                    }}
                  >
                    {msg.content}
                  </ReactMarkdown>
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
          
          {isLoading && (
            <div className="flex items-center space-x-3 text-blue-400 pl-4">
               <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
               <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
               <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
               <span className="text-xs font-bold uppercase tracking-widest">Sharp-sharp, thinking...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </main>

      <ChatInput onSend={handleSend} />
    </div>
  );
};

export default ChatPage;
