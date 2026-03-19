import React from 'react';

export const ChatInput = ({ onSend }: { onSend: (val: string) => void }) => {
  const [input, setInput] = React.useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    onSend(input);
    setInput("");
  };

  return (
    <div className="fixed bottom-0 w-full px-4 pb-8 pt-6 bg-linear-to-t from-brand-bg via-brand-bg/95 to-transparent backdrop-blur-[2px]">
      <div className="max-w-3xl mx-auto">
        {/* Quick Action Chips for Kids */}
        <div className="flex gap-2 mb-4 overflow-x-auto no-scrollbar pb-2">
          {["Explain simply 💡", "Check my facts 🔍", "Give me a quiz 📝", "Help me brainstorm 🧠"].map(hint => (
            <button 
              key={hint}
              onClick={() => setInput(prev => prev + " " + hint)}
              className="px-5 py-2.5 rounded-full border border-brand-primary/10 bg-white text-[10px] font-black uppercase tracking-widest text-brand-text/40 hover:bg-brand-primary hover:text-white hover:border-brand-primary transition-all whitespace-nowrap shadow-sm"
            >
              {hint}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="relative group">
          <div className="absolute -inset-1 bg-linear-to-r from-brand-primary to-brand-secondary rounded-3xl blur opacity-10 group-focus-within:opacity-20 transition duration-1000"></div>
          <div className="relative flex items-center bg-white border border-brand-primary/20 rounded-[1.5rem] overflow-hidden p-2 shadow-xl shadow-brand-primary/5 transition-all focus-within:border-brand-primary/40">
            <input 
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask your AI tutor anything..."
              className="flex-1 bg-transparent px-5 py-4 text-brand-text font-medium text-sm focus:outline-none placeholder:text-brand-text/30"
            />
            <button className="bg-brand-primary text-white px-6 py-4 rounded-2xl hover:opacity-90 transition-all font-black italic uppercase text-[10px] tracking-[0.2em] shadow-lg shadow-brand-primary/20">
              Send
            </button>
          </div>
        </form>
        <p className="text-center text-[10px] text-brand-text/30 mt-5 uppercase font-black tracking-[0.1em]">
          Always check your facts with a teacher or textbook! 🇿🇦
        </p>
      </div>
    </div>
  );
};