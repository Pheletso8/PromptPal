import React from 'react';
import { Hammer, Fan, Clock } from 'lucide-react';

const MaintenancePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-brand-bg text-brand-text font-sans flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="fixed top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-brand-primary/10 blur-[150px] pointer-events-none" />
      <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-brand-secondary/10 blur-[150px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-2xl text-center space-y-12">
        {/* Animated Icon Cluster */}
        <div className="flex justify-center items-center gap-8 mb-12">
          <div className="w-24 h-24 rounded-[2rem] bg-white shadow-2xl flex items-center justify-center animate-bounce duration-[3000ms]">
            <Hammer className="w-10 h-10 text-brand-primary" />
          </div>
          <div className="w-32 h-32 rounded-[2.5rem] bg-brand-primary text-white shadow-2xl flex items-center justify-center animate-spin duration-[10000ms]">
            <Fan className="w-14 h-14" />
          </div>
          <div className="w-24 h-24 rounded-[2rem] bg-white shadow-2xl flex items-center justify-center animate-bounce-reverse duration-[3000ms]">
            <Clock className="w-10 h-10 text-brand-secondary" />
          </div>
        </div>

        <div className="space-y-6">
          <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter text-brand-text">
            SYSTEM <span className="text-brand-primary">UPGRADE</span>
          </h1>
          <p className="text-lg md:text-xl text-brand-text/50 font-medium max-w-lg mx-auto leading-relaxed">
            PromptPal is currently undergoing scheduled maintenance to bring you new AI features. We'll be back online shortly.
          </p>
        </div>

        <div className="pt-12 flex flex-col items-center gap-6">
          <div className="px-8 py-3 bg-brand-primary/5 border border-brand-primary/10 rounded-full flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-brand-primary animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-primary">Admins are hard at work</span>
          </div>
          
          <p className="text-xs text-brand-text/30 font-bold uppercase tracking-widest">
            Estimated completion: Soon
          </p>
        </div>

        {/* Branding */}
        <div className="pt-20">
          <div className="text-center opacity-30 group">
            <h2 className="text-2xl font-black tracking-tight text-brand-text mb-1">
              Prompt<span className="text-brand-primary">Pal</span>
            </h2>
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-text">Grade 7 AI Lab</p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes bounce-reverse {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        .animate-bounce-reverse {
          animation: bounce-reverse 3s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default MaintenancePage;
