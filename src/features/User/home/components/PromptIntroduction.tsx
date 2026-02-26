export const PromptIntroduction = () => (
  <section className="mb-16 p-8 rounded-[2.5rem] border border-white/5 bg-white/2 relative overflow-hidden group">
    {/* Decorative Background Glow */}
    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 blur-[100px] pointer-events-none" />
    
    <div className="relative z-10 md:flex items-center gap-12">
      <div className="flex-1">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-widest mb-6">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
          <span>Digital Fluency 2026</span>
        </div>
        
        <h2 className="text-3xl md:text-4xl font-black italic tracking-tighter mb-6 leading-tight">
          What is <span className="text-blue-500 font-black italic underline decoration-blue-500/30">Prompt Engineering?</span>
        </h2>
        
        <div className="space-y-4 text-gray-400 text-sm md:text-base leading-relaxed max-w-2xl">
          <p>
            Think of Prompt Engineering as a <span className="text-white font-bold">new language</span> for the future. It is the art of giving precise, logical instructions to Artificial Intelligence to get the best possible results.
          </p>
          <p>
            For <span className="text-white font-bold">Grade 7 learners</span>, mastering this means you can turn AI into a personal tutor that helps you solve complex problems, research faster for projects, and spark your own creativity in ways that were never possible before.
          </p>
        </div>
      </div>

      <div className="mt-8 md:mt-0 shrink-0">
        <div className="p-6 rounded-3xl border border-white/10 bg-black/40 backdrop-blur-md">
          <h4 className="text-blue-400 font-black text-xs uppercase mb-4 tracking-widest">Why start now?</h4>
          <ul className="space-y-3 text-xs font-medium text-gray-300">
            <li className="flex items-center gap-2">🚀 Accelerate your learning speed</li>
            <li className="flex items-center gap-2">🧩 Build advanced critical thinking</li>
            <li className="flex items-center gap-2">🇿🇦 Lead the tech wave in SA</li>
          </ul>
        </div>
      </div>
    </div>
  </section>
);