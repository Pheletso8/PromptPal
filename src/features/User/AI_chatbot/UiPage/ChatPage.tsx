import React, { useState } from 'react';
import { ChatHeader } from '../components/ChatHeader';
import { ChatMessage } from '../components/ChatMessage';
import { ChatInput } from '../components/ChatInput';

const ChatPage: React.FC = () => {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Holo! 🇿🇦 I'm your PromptPal AI tutor. I'm ready to help you with Maths, Science, or even just practice your prompting. What's on your mind today?" }
  ]);

  const handleSend = (text: string) => {
    const userMsg = { role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    
    // Simulate AI thinking
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "That's a great question! Let's break that down into steps like we learned in the 'Role' framework. First, what do you think the most important part is?" 
      }]);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-blue-500/30">
      <ChatHeader />
      
      {/* Decorative Glows */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full h-125 bg-blue-600/5 blur-[120px] pointer-events-none" />

      <main className="max-w-3xl mx-auto px-6 pt-32 pb-48">
        <div className="space-y-2">
          {messages.map((msg, i) => (
            <ChatMessage key={i} role={msg.role as any} content={msg.content} />
          ))}
        </div>
      </main>

      <ChatInput onSend={handleSend} />
    </div>
  );
};

export default ChatPage;