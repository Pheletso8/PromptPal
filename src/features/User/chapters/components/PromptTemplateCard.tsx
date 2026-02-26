interface TemplateProps {
  t: { id: string; title: string; scenario: string; prompt: string; icon: string };
  copied: string | null;
  onCopy: (text: string, id: string) => void;
}

export const PromptTemplateCard = ({ t, copied, onCopy }: TemplateProps) => (
  <div className="group p-8 rounded-3xl border border-white/5 bg-white/4 hover:bg-white/4 transition-all">
    <div className="flex items-start justify-between gap-6">
      <div className="flex-1">
        <div className="flex items-center space-x-3 mb-4">
          <span className="text-2xl">{t.icon}</span>
          <h4 className="text-xl font-bold">{t.title}</h4>
        </div>
        <p className="text-gray-500 text-sm mb-6">{t.scenario}</p>
        <div className="relative p-6 rounded-2xl bg-black/40 border border-white/5 font-mono text-sm text-blue-100/80 leading-relaxed">
          {t.prompt}
        </div>
      </div>
      <button 
        onClick={() => onCopy(t.prompt, t.id)}
        className={`mt-1 px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
          copied === t.id ? 'bg-green-500/20 border-green-500/50 text-green-400' : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
        }`}
      >
        {copied === t.id ? 'COPIED!' : 'COPY PROMPT'}
      </button>
    </div>
  </div>
);