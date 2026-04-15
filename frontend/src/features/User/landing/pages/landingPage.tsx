import React, { useState, useEffect } from 'react';
import landingImage from '../../../../assets/landingImage.jfif';
import { Loader } from '../components/Loader';
import { Navbar } from '../components/Navbar';
import { Hero } from '../components/Hero';
import { CourseGrid } from '../components/CourseGrid';
import { motion } from 'framer-motion';
import { Sparkles, BookOpen, Layers } from 'lucide-react';

const Landing: React.FC = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-bg via-white to-brand-secondary/5 text-brand-text font-sans selection:bg-brand-primary/30 overflow-x-hidden animate-in fade-in duration-1000">
      <Navbar />
      <Hero />

      <section className="max-w-7xl mx-auto px-4 pb-12 grid gap-6 lg:grid-cols-3">
        {[
          {
            title: 'Prompt Engineering',
            description: 'Learn how to write AI instructions that are clear, safe, and powerful.',
            icon: Sparkles,
          },
          {
            title: 'Getting Started',
            description: 'A simple guide to begin learning with the platform in minutes.',
            icon: BookOpen,
          },
          {
            title: 'Focused Learning',
            description: 'Structured activities engineered for Grade 7 learners.',
            icon: Layers,
          },
        ].map((item, index) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: index * 0.12 }}
              className="bg-white/90 border border-brand-primary/10 rounded-[2rem] p-8 shadow-[0_24px_60px_rgba(0,0,0,0.06)] hover:shadow-[0_28px_70px_rgba(0,0,0,0.08)] transition-all"
            >
              <div className="w-14 h-14 rounded-3xl bg-brand-primary/10 text-brand-primary grid place-items-center mb-6">
                <Icon className="w-7 h-7" />
              </div>
              <h2 className="text-2xl font-black mb-3 text-brand-text">{item.title}</h2>
              <p className="text-brand-text/70 leading-relaxed">{item.description}</p>
            </motion.div>
          );
        })}
      </section>

      {/* Cinematic Image Section */}
      <div className="relative max-w-7xl mx-auto px-4 pb-12 group">
        <div className="absolute -inset-4 bg-brand-primary/5 rounded-[3.5rem] blur-3xl group-hover:bg-brand-primary/10 transition-all duration-700"></div>
        <div className="relative rounded-[3rem] overflow-hidden shadow-[0_20px_50px_rgba(107,33,168,0.1)] border border-white">
          <img src={landingImage} alt="Modern Learning" className="w-full h-auto object-cover min-h-100 transition-transform duration-1000 group-hover:scale-105" />
          <div className="absolute inset-0 bg-linear-to-t from-white via-white/20 to-transparent"></div>
          <div className="absolute bottom-12 left-12 right-12">
            <p className="text-sm font-black tracking-[0.2em] text-brand-primary uppercase mb-2">Empowering the next generation</p>
            <h3 className="text-3xl font-black italic tracking-tighter text-brand-text">Built for South African Grade 7 Success</h3>
          </div>
        </div>
      </div>

      <CourseGrid />

      <footer className="border-t border-brand-primary/5 py-12 text-center text-brand-text/50 text-sm">
        <p>© 2024 PromptPal. Accelerating education for South African learners.</p>
      </footer>
    </div>
  );
};

export default Landing;