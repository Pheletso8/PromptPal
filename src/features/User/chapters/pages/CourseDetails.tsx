import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { COURSES } from '../../../../data/courseData';
import { DetailNav } from '../components/DetailNav';
import { LearningGuardrails } from '../components/LearningGuardrails';
import { Link } from 'react-router-dom';

const CourseDetail: React.FC = () => {
  const { id } = useParams();
  const [copied, setCopied] = useState<string | null>(null);

  // Find the specific course data based on the URL ID
  const course = COURSES.find(c => c.id === Number(id));

  if (!course) return <div className="text-white p-20 text-center font-bold">Course not found...</div>;

  const copyToClipboard = (text: string, templateId: string) => {
    navigator.clipboard.writeText(text);
    setCopied(templateId);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-blue-500/30 pb-24 relative overflow-hidden">
      
      {/* --- FIXED SOUTH AFRICAN BACKGROUND LAYER --- */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {/* 1. Dynamic Course Image - REDUCED BLUR & INCREASED OPACITY */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000"
          style={{ 
            backgroundImage: `url(${course.image})`,
            filter: 'blur(15px)', // DECREASED from 60px to 15px so you can see the image
            transform: 'scale(1.05)',
            opacity: 0.2// INCREASED from 0.35 to 0.5 to make it pop
          }}
        />
        
        {/* 2. South African Subtle Pattern Overlay */}
        <div className="absolute inset-0 opacity-[0.04] bg-[url('https://www.transparenttextures.com')]" />

        {/* 3. The Dark Gradient - DECREASED DARKNESS AT THE TOP */}
        <div className="absolute inset-0 bg-linear-to-b from-black/2 via-black/60 to-black" />
      </div>

      {/* --- CONTENT LAYER --- */}
      <div className="relative z-10">
        <DetailNav />

        <main className="max-w-5xl mx-auto px-8 pt-32">
          {/* Header Card / Progress */}
          <div className="flex items-center justify-between mb-12 bg-white/5 p-6 rounded-3xl border border-white/10 backdrop-blur-xl shadow-2xl">
            <div className="flex items-center space-x-5">
              <span className="bg-blue-600 text-[10px] font-black px-3 py-1 rounded-full tracking-tighter uppercase shadow-lg shadow-blue-600/20">
                {course.tag}
              </span>
              <h1 className="text-2xl font-black tracking-tight italic">{course.title}</h1>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Progress</p>
              <p className="text-xl font-black text-blue-400">{course.progress}%</p>
            </div>
          </div>

          {/* Educational Context Section */}
          <section className="mb-16 max-w-3xl">
            <h2 className="text-blue-500 font-black uppercase tracking-[0.3em] text-[10px] mb-4">Why we learn this</h2>
            <p className="text-gray-300 text-xl leading-relaxed font-light italic">
              "{course.whyLearn}"
            </p>
          </section>

          {/* Lesson Video Section */}
          <section className="mb-20 rounded-[2.5rem] overflow-hidden border border-white/5 aspect-video bg-black/60 shadow-2xl group">
             <iframe 
               className="w-full h-full opacity-90 group-hover:opacity-100 transition-opacity duration-700" 
               src={course.videoUrl} 
               title="Lesson Video" 
               frameBorder="0" 
               allowFullScreen
             ></iframe>
          </section>

          {/* Prompting Lab Section */}
          <section className="mb-20 p-10 rounded-[2.5rem] border border-blue-500/20 bg-blue-500/5 backdrop-blur-md">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
              <div className="flex items-center space-x-3">
                <span className="text-3xl">🧪</span>
                <div>
                  <h3 className="text-xs font-black text-blue-400 uppercase tracking-widest">Prompting Lab</h3>
                  <p className="text-xl font-bold">{course.lessonTopic}</p>
                </div>
              </div>
              
              {/* NEW: Contextual AI CTA */}
              <Link 
                to="/ai-chatbot" 
                className="bg-blue-600 text-white px-6 py-2 rounded-xl text-xs font-black italic uppercase hover:bg-blue-500 transition-all flex items-center gap-2"
              >
                🚀 Test in AI Lab
              </Link>
            </div>

            <div className="grid gap-6">
              {course.templates.map((t) => (
                <div key={t.id} className="p-6 rounded-2xl bg-black/60 border border-white/5 group hover:border-blue-500/30 transition-all duration-300">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center space-x-3">
                      <span className="text-xl">{t.icon}</span>
                      <span className="text-sm font-black text-white/90 uppercase tracking-tighter italic">{t.title}</span>
                    </div>
                    <button 
                      onClick={() => copyToClipboard(t.prompt, t.id)}
                      className="text-[10px] font-black text-blue-500 hover:text-white uppercase tracking-widest transition-all"
                    >
                      {copied === t.id ? 'Prompt Copied!' : 'Copy Template'}
                    </button>
                  </div>
                  <div className="relative p-5 rounded-xl bg-white/2 border border-white/5">
                    <p className="font-mono text-sm text-gray-400 leading-relaxed italic">{t.prompt}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Quiz Section */}
          <section className="mb-20 pt-16 border-t border-white/10">
            <h3 className="text-3xl font-black italic mb-10 tracking-tighter text-white">Knowledge Check</h3>
            <div className="bg-white/3 p-10 rounded-[2.5rem] border border-white/5 backdrop-blur-md">
              <p className="text-xl font-medium mb-8 text-gray-200 leading-snug">{course.assessment.question}</p>
              <div className="grid gap-4">
                {course.assessment.options.map((opt, i) => (
                  <button 
                    key={i} 
                    className="w-full text-left p-5 rounded-2xl border border-white/5 bg-white/5 hover:border-blue-500/50 hover:bg-blue-500/5 transition-all text-sm font-medium group"
                  >
                    <span className="mr-4 opacity-30 group-hover:opacity-100 transition-opacity">{i + 1}.</span>
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          </section>

          <LearningGuardrails />
        </main>
      </div>
    </div>
  );
};

export default CourseDetail;