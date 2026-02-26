import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import HomeNav from '../components/HomeNav';
import ContinueLearning from '../components/ContinueLearning';
import CourseCard from '../components/CourseCard';
import StatsWidgets from '../components/StatsWidgets';
import { PromptIntroduction } from '../components/PromptIntroduction'; // New Import
import { COURSES } from '../../../../data/courseData';
import { VideoPlayer } from '../../chapters/components/VideoPlayer';


const HomePage: React.FC = () => {
  const [search, setSearch] = useState("");
  const [activeTag, setActiveTag] = useState("All");

  const tags = ["All", "Maths", "Research", "Science", "EMS", "English"];
  
  const filteredCourses = COURSES.filter(c => 
    (activeTag === "All" || c.tag === activeTag) && 
    c.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-blue-500/30 pb-20">
      <HomeNav />
       {/* NEW: Floating AI Lab CTA (Bottom Right) */}
      <Link 
        to="/ai-chatbot" 
        className="fixed bottom-8 right-8 z-50 group flex items-center gap-3 bg-blue-600 hover:bg-blue-500 text-white px-6 py-4 rounded-2xl font-black italic shadow-[0_0_30px_rgba(37,99,235,0.4)] transition-all hover:scale-105 active:scale-95"
      >
        <span className="text-xl">🤖</span>
        <span className="hidden md:block uppercase tracking-tighter">Open AI Lab</span>
      </Link>
      <main className="max-w-7xl mx-auto px-8 pt-28">
        <PromptIntroduction />
        <VideoPlayer videoUrl="https://www.youtube.com/embed/dtSpw9xVo2k" />
        <ContinueLearning />
        {/* NEW: Dedicated AI Tutor Promo Section */}
        <section className="mb-12 p-8 rounded-3xl border border-blue-500/20 bg-blue-500/5 flex flex-col md:flex-row items-center justify-between gap-6">
           <div>
             <h3 className="text-2xl font-black italic mb-2 tracking-tighter">Stuck on a problem?</h3>
             <p className="text-gray-400 text-sm">Our PromptPal AI is ready to help you with your Grade 7 homework right now.</p>
           </div>
           <Link to="/ai-chatbot" className="bg-white text-black px-8 py-3 rounded-xl font-bold text-sm hover:bg-blue-50 transition-all">
             Chat with AI Tutor
           </Link>
        </section>
        <section className="mb-12">
          {/* Search & Filter Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div className="relative flex-1 max-w-md">
              <input 
                type="text" 
                placeholder="Search subjects or topics..." 
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-12 py-4 focus:outline-none focus:border-blue-500/50 transition-all"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 opacity-40 text-xl">🔍</span>
            </div>
            <div className="flex items-center space-x-2 overflow-x-auto pb-2 no-scrollbar">
              {tags.map(tag => (
                <button 
                  key={tag}
                  onClick={() => setActiveTag(tag)}
                  className={`px-5 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap ${activeTag === tag ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'bg-white/5 text-gray-500 hover:bg-white/10'}`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Course Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredCourses.map(course => (
              <Link to={`/course/${course.id}`} key={course.id}>
                <CourseCard course={course} />
              </Link>
            ))}
          </div>
        </section>

        <StatsWidgets />
      </main>
    </div>
  );
};

export default HomePage;