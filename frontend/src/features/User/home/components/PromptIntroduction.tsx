export const PromptIntroduction = () => (
  <section className="mb-16 p-8 rounded-[2.5rem] border border-brand-primary/10 bg-brand-secondary/5 relative overflow-hidden group">
    {/* Decorative Background Glow */}
    <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/5 blur-[100px] pointer-events-none" />
    
    <div className="relative z-10 md:flex items-center gap-12">
      <div className="flex-1">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-[10px] font-black uppercase tracking-widest mb-6">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-primary"></span>
          </span>
          <span>Digital Fluency 2026</span>
        </div>
        
        <h2 className="text-3xl md:text-4xl font-black italic tracking-tighter mb-6 leading-tight text-brand-text">
          What is <span className="text-brand-primary font-black italic underline decoration-brand-primary/30">Prompt Engineering?</span>
        </h2>
        
        <div className="space-y-4 text-brand-text/70 text-sm md:text-base leading-relaxed max-w-2xl">
          <p>
            Imagine you have a <span className="text-brand-text font-bold">Super Robot</span> that is incredibly smart but needs very clear directions to work. If you give it a vague instruction, it might get confused.
          </p>
          <p>
            <span className="text-brand-primary font-bold">Prompt Engineering</span> is simply the art of talking to AI in a way that it understands perfectly. It means using clear, simple, and specific words to tell the computer exactly what you want it to do.
          </p>
          <p className="text-brand-text font-medium pt-2">
            By learning how to give <span className="text-brand-primary italic">"good instructions,"</span> you are learning how to use the world's most powerful tool to help you succeed!
          </p>
        </div>
      </div>

      <div className="mt-8 md:mt-0 shrink-0">
        <div className="p-6 rounded-3xl border border-brand-primary/10 bg-white/40 backdrop-blur-md max-w-xs shadow-sm">
          <h4 className="text-brand-primary font-black text-xs uppercase mb-4 tracking-widest underline decoration-brand-primary/30">Your New Superpower</h4>
          <ul className="space-y-4 text-xs font-medium text-brand-text/80">
            <li className="flex items-start gap-3 group/item">
              <span className="text-xl transition-transform group-hover/item:scale-125">🎓</span>
              <div>
                <span className="block text-brand-text font-bold mb-0.5">Personal Tutor</span>
                <span className="text-brand-text/60">It explains tough homework, like a hard Math problem, so it's easy to understand.</span>
              </div>
            </li>
            <li className="flex items-start gap-3 group/item">
              <span className="text-xl transition-transform group-hover/item:scale-125">🔍</span>
              <div>
                <span className="block text-brand-text font-bold mb-0.5">Research Assistant</span>
                <span className="text-brand-text/60">It helps you find info for class projects much faster than searching big books.</span>
              </div>
            </li>
            <li className="flex items-start gap-3 group/item">
              <span className="text-xl transition-transform group-hover/item:scale-125">✨</span>
              <div>
                <span className="block text-brand-text font-bold mb-0.5">Creative Spark</span>
                <span className="text-brand-text/60">It helps you come up with new ideas for stories, drawings, or experiments.</span>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
);