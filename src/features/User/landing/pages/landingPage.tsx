import React, { useState, useEffect } from 'react';
import landingImage from '../../../../assets/landingImage.jfif';
import { Loader } from '../components/Loader';
import { Navbar } from '../components/Navbar';
import { Hero } from '../components/Hero';
import { CourseGrid } from '../components/CourseGrid';

const Landing: React.FC = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-blue-500/30 overflow-x-hidden animate-in fade-in duration-1000">
      <Navbar />
      <Hero />

      {/* Cinematic Image Section */}
      <div className="relative max-w-7xl mx-auto px-4 pb-12 group">
        <div className="absolute -inset-4 bg-blue-600/10 rounded-[3rem] blur-3xl group-hover:bg-blue-600/20 transition-all duration-700"></div>
        <div className="relative rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl">
          <img src={landingImage} alt="Modern Learning" className="w-full h-auto object-cover min-h-100 transition-transform duration-1000 group-hover:scale-105" />
          <div className="absolute inset-0 bg-linear-to-t from-black via-black/40 to-transparent"></div>
          <div className="absolute bottom-12 left-12 right-12">
            <p className="text-sm font-medium tracking-[0.2em] text-blue-400 uppercase mb-2">Empowering the next generation</p>
            <h3 className="text-3xl font-bold text-white">Built for South African Grade 7 Success</h3>
          </div>
        </div>
      </div>

      <CourseGrid />

      <footer className="border-t border-white/5 py-12 text-center text-gray-600 text-sm">
        <p>© 2024 PromptPal. Accelerating education for South African learners.</p>
      </footer>
    </div>
  );
};

export default Landing;