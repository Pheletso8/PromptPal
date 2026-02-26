interface MessageProps {
  role: 'user' | 'assistant';
  content: string;
}

export const ChatMessage = ({ role, content }: MessageProps) => (
  <div className={`flex ${role === 'user' ? 'justify-end' : 'justify-start'} mb-6 animate-in fade-in slide-in-from-bottom-2`}>
    <div className={`max-w-[80%] p-4 rounded-2xl border ${
      role === 'user' 
        ? 'bg-blue-600 border-blue-400 text-white rounded-tr-none shadow-[0_0_20px_rgba(37,99,235,0.2)]' 
        : 'bg-white/3 border-white/10 text-gray-200 rounded-tl-none backdrop-blur-md'
    }`}>
      <p className="text-sm md:text-base leading-relaxed whitespace-pre-wrap">{content}</p>
      {role === 'assistant' && (
        <div className="mt-3 pt-3 border-t border-white/5 flex items-center gap-2">
          <span className="text-[10px] font-black text-blue-500 uppercase">PromptPal AI</span>
        </div>
      )}
    </div>
  </div>
);