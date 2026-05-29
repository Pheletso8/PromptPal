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

  const normalizeUrl = (url: string) => url.replace(/\/+$|\s+/g, '');
  const prettifyAssistantText = (raw: string) => {
    let text = raw.trim().replace(/\r\n/g, '\n').replace(/\n{3,}/g, '\n\n');
    text = text.replace(/^(Summary|Key points|Important|Note|Steps|Answer|Explanation|Why):/gmi, '### $1:');
    text = text.replace(/^(\d+)\.\s+/gm, '$1. ');
    return text;
  };

  const extractMermaidDiagram = (content: string) => {
    const match = /```mermaid\s*([\s\S]*?)```/i.exec(content);
    return match?.[1].trim();
  };

  const stripMermaidDiagram = (content: string) => content.replace(/```mermaid[\s\S]*?```/gi, '').trim();

  const handleSend = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = { role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const CHAT_API_URL = 'https://multi-agent-system-promptpal.onrender.com/ask';
      console.debug('[ChatPage] sending request to:', CHAT_API_URL);

      const response = await fetch(CHAT_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: text }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const contentType = response.headers.get('content-type') || '';
      const isJson = contentType.toLowerCase().includes('application/json');

      // Add empty assistant bubble so the UI can show the answer.
      setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

      if (isJson) {
        const payload = await response.json();
        const answerText = payload?.data?.hint ?? payload?.hint ?? payload?.data?.answer ?? payload?.answer ?? '';
        const prettyText = prettifyAssistantText(String(answerText));
        const diagram = payload?.data?.diagram ?? payload?.diagram ?? extractMermaidDiagram(prettyText);
        const finalContent = diagram ? stripMermaidDiagram(prettyText) : prettyText;

        setMessages(prev => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            ...updated[updated.length - 1],
            content: finalContent,
            diagram,
          };
          return updated;
        });
        return;
      }

      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullText = "";

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
              const prettyText = prettifyAssistantText(fullText);
              setMessages(prev => {
                const updated = [...prev];
                updated[updated.length - 1] = { ...updated[updated.length - 1], content: prettyText };
                return updated;
              });
            }

            if (json.type === "complete") {
              const prettyText = prettifyAssistantText(fullText);
              const diagram = json.data?.diagram || extractMermaidDiagram(prettyText);
              const finalContent = diagram ? stripMermaidDiagram(prettyText) : prettyText;

              setMessages(prev => {
                const updated = [...prev];
                updated[updated.length - 1] = {
                  ...updated[updated.length - 1],
                  content: finalContent,
                  diagram,
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
