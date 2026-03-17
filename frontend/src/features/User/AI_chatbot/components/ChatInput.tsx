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
    <div className="fixed bottom-0 w-full px-4 pb-8 pt-4 bg-linear-to-t from-black via-black to-transparent">
      <div className="max-w-3xl mx-auto">
        {/* Quick Action Chips for Kids */}
        <div className="flex gap-2 mb-4 overflow-x-auto no-scrollbar pb-2">
          {["Explain simply 💡", "Check my facts 🔍", "Give me a quiz 📝", "Help me brainstorm 🧠"].map(hint => (
            <button 
              key={hint}
              onClick={() => setInput(prev => prev + " " + hint)}
              className="px-4 py-2 rounded-full border border-white/10 bg-white/5 text-[10px] font-bold text-gray-400 hover:bg-blue-600 hover:text-white transition-all whitespace-nowrap"
            >
              {hint}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="relative group">
          <div className="absolute -inset-1 bg-linear-to-r from-blue-600 to-purple-600 rounded-3xl blur opacity-20 group-focus-within:opacity-40 transition duration-1000"></div>
          <div className="relative flex items-center bg-[#0d0d0d] border border-white/10 rounded-2xl overflow-hidden p-2">
            <input 
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask your AI tutor anything..."
              className="flex-1 bg-transparent px-4 py-3 text-sm focus:outline-none placeholder:text-gray-600"
            />
            <button className="bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-500 transition-all font-bold text-xs uppercase tracking-widest shadow-lg shadow-blue-600/20">
              Send
            </button>
          </div>
        </form>
        <p className="text-center text-[10px] text-gray-600 mt-4 uppercase font-bold tracking-tighter">
          Always check your facts with a teacher or textbook! 🇿🇦
        </p>
      </div>
    </div>
  );
};