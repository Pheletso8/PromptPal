import React, { useState } from 'react';
import logo from '../../../../assets/promptpal.png';

const CourseDetail: React.FC = () => {
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const templates = [
    {
      id: "homework",
      title: "Homework Helper",
      scenario: "When you're stuck on a difficult concept and need an explanation.",
      prompt: "Act as a friendly Grade 7 tutor. Explain the concept of [Topic, e.g., Photosynthesis] using a simple analogy. Don't give me the answer to my homework, but help me understand how it works step-by-step.",
      icon: "📚"
    },
    {
      id: "research",
      title: "Research Assistant",
      scenario: "Starting a project and need to find the most important facts.",
      prompt: "I am doing a school project on [Topic]. Identify the 5 most important facts I should include. For each fact, explain why it is important for a Grade 7 student to know, and suggest one credible source to look at.",
      icon: "🔍"
    },
    {
      id: "essay",
      title: "Writing Partner",
      scenario: "When you have the ideas but struggle to structure your essay.",
      prompt: "I am writing a persuasive essay about [Topic]. Based on the following ideas: [List ideas], help me create a 4-paragraph outline including an introduction, two body paragraphs with evidence, and a conclusion.",
      icon: "✍️"
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-blue-500/30 pb-24">
      {/* --- Sticky Header --- */}
      <nav className="fixed top-0 w-full z-50 backdrop-blur-xl border-b border-white/5 bg-black/40 px-8 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <img src={logo} alt="logo" className="w-8 h-8 rounded-lg" />
            <span className="font-black tracking-tighter text-xl">Prompt<span className="text-blue-500">Pal</span></span>
          </div>
          <button className="text-sm font-bold text-gray-400 hover:text-white transition">Back to Dashboard</button>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-8 pt-32">
        {/* --- Why Prompt Engineering? (Educational Context) --- */}
        <section className="mb-20 text-center md:text-left md:flex items-center gap-12">
          <div className="flex-1">
            <h2 className="text-blue-500 font-bold uppercase tracking-widest text-sm mb-4">The Skill of the Future</h2>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
              Why learn <span className="text-blue-500">Prompting?</span>
            </h1>
            <div className="space-y-4 text-gray-400 text-lg leading-relaxed">
              <p>
                Prompt Engineering isn't just about "talking to robots." It's a new form of <span className="text-white font-medium">critical thinking</span>. By learning to craft precise instructions, you develop the ability to decompose complex problems into smaller, manageable tasks.
              </p>
              <p>
                For Grade 7 learners, this is a gateway to <span className="text-white font-medium">digital fluency</span>. It teaches you how to iterate, refine your thoughts, and collaborate with AI to enhance your own creativity—not replace it.
              </p>
            </div>
          </div>
          <div className="hidden md:block w-1 h-64 bg-gradient-to-b from-transparent via-blue-500/20 to-transparent" />
        </section>

        {/* --- Video Section --- */}
        <section className="mb-24">
          <div className="relative group rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl bg-white/5 aspect-video flex items-center justify-center">
            {/* Mock Video Placeholder */}
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 to-purple-600/20 z-0" />
            <div className="relative z-10 text-center">
              <button className="w-20 h-20 bg-white text-black rounded-full flex items-center justify-center pl-1 hover:scale-110 transition-transform shadow-2xl shadow-blue-500/20">
                <span className="text-2xl">▶</span>
              </button>
              <p className="mt-4 font-bold text-white/60 uppercase tracking-widest text-xs">Watch: Mastery in 5 Minutes</p>
            </div>
          </div>
        </section>

        {/* --- Prompt Templates Section --- */}
        <section className="mb-20">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold mb-2">Prompt Templates</h2>
              <p className="text-gray-500">Copy these to your favorite AI to start learning smarter.</p>
            </div>
          </div>

          <div className="grid gap-6">
            {templates.map((t) => (
              <div key={t.id} className="group p-8 rounded-3xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all">
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
                    onClick={() => copyToClipboard(t.prompt, t.id)}
                    className={`mt-1 px-4 py-2 rounded-xl text-xs font-bold transition-all border ${copied === t.id ? 'bg-green-500/20 border-green-500/50 text-green-400' : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'}`}
                  >
                    {copied === t.id ? 'COPIED!' : 'COPY PROMPT'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* --- Added: Learning Guardrails (Crucial for Grade 7) --- */}
        <section className="rounded-3xl border border-orange-500/20 bg-orange-500/5 p-8 flex items-start gap-6">
          <div className="text-3xl">⚠️</div>
          <div>
            <h4 className="text-lg font-bold text-orange-400 mb-2">Study Safely & Honestly</h4>
            <p className="text-gray-400 text-sm leading-relaxed">
              AI is a powerful <span className="text-white">tutor</span>, but not a replacement for your brain! Always check the facts the AI gives you, never use it to cheat on tests, and ensure your teacher allows AI use for specific assignments.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default CourseDetail;