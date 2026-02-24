import React, { useState } from 'react';
import logo from '../../../../assets/promptpal.png';
import { Link } from 'react-router-dom';

// Mock Data for the UI
const COURSES = [
  { id: 1, title: "AI for Maths Homework", tag: "Maths", image: "https://images.unsplash.com", progress: 0 },
  { id: 2, title: "GenAI Research Masterclass", tag: "Research", image: "https://images.unsplash.com", progress: 0 },
  { id: 3, title: "Natural Sciences Assistant", tag: "Science", image: "https://images.unsplash.com", progress: 0 },
  { id: 4, title: "EMS: Future Economics", tag: "EMS", image: "https://images.unsplash.com", progress: 0 },
];

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
      {/* --- Sidebar / Header Navigation --- */}
      <nav className="fixed top-0 w-full z-50 backdrop-blur-xl border-b border-white/5 bg-black/40 px-8 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <img src={logo} alt="logo" className="w-8 h-8 rounded-lg shadow-lg shadow-blue-500/20" />
            <span className="font-black tracking-tighter text-xl">Prompt<span className="text-blue-500">Pal</span></span>
          </div>
          <div className="flex items-center space-x-4">
             <div className="w-8 h-8 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-full border border-white/20" />
             <span className="text-sm font-medium text-gray-300">Grade 7 Learner</span>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-8 pt-28">
        
        {/* --- Section 1: Course in Progress (Active Learning) --- */}
        <section className="mb-12">
          <h2 className="text-sm font-bold text-blue-500 uppercase tracking-[0.2em] mb-4">Welcome back!</h2>
          <div className="relative group overflow-hidden rounded-3xl border border-blue-500/30 bg-blue-500/5 p-8 md:flex items-center justify-between">
            <div className="relative z-10 max-w-xl">
               <span className="bg-blue-500/20 text-blue-400 text-[10px] font-bold px-2 py-1 rounded mb-4 inline-block">CONTINUE LEARNING</span>
               <h1 className="text-3xl font-bold mb-2">GenAI Prompt Engineering 101</h1>
               <p className="text-gray-400 mb-6">Master the "Role, Task, Context" framework to get perfect answers every time.</p>
               <div className="flex items-center space-x-4">
                 <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 w-[65%]" />
                 </div>
                 <span className="text-sm font-bold text-blue-400">65%</span>
               </div>
            </div>
            <button className="mt-6 md:mt-0 bg-white text-black px-8 py-3 rounded-xl font-bold hover:bg-blue-50 transition-all shadow-xl shadow-white/5">
              Resume Lesson
            </button>
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 blur-[100px] -z-0" />
          </div>
        </section>

        {/* --- Section 2: Search & Filter Bar --- */}
        <section className="mb-12">
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

          {/* --- Section 3: Course Grid --- */}
          <Link to="/course/:id" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredCourses.map(course => (
              <div 
                key={course.id}
                className="group relative rounded-3xl border border-white/5 bg-white/[0.02] overflow-hidden hover:border-white/20 transition-all duration-500"
              >
                {/* Course Image */}
                <div className="relative h-40 overflow-hidden">
                  <img src={course.image} alt={course.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] to-transparent opacity-60" />
                  <span className="absolute top-4 left-4 bg-black/60 backdrop-blur-md text-[10px] font-bold px-2 py-1 rounded-md border border-white/10">
                    {course.tag}
                  </span>
                </div>

                <div className="p-6">
                  <h4 className="font-bold text-lg leading-tight mb-4 group-hover:text-blue-400 transition-colors">
                    {course.title}
                  </h4>
                  <div className="flex items-center justify-between">
                     <span className="text-xs text-gray-500">12 Lessons</span>
                     <button className="p-2 rounded-lg bg-white/5 hover:bg-blue-600 transition-colors group/btn">
                        <span className="text-lg leading-none">→</span>
                     </button>
                  </div>
                </div>
              </div>
            ))}
          </Link>
        </section>

        {/* --- Added Value: Relevant Widgets for Grade 7 --- */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 rounded-3xl border border-white/5 bg-white/[0.02] p-8">
            <h3 className="text-xl font-bold mb-6">Weekly Goals</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-4 bg-white/5 p-4 rounded-2xl border border-white/5">
                 <div className="w-10 h-10 flex items-center justify-center bg-green-500/20 text-green-400 rounded-xl">✓</div>
                 <div>
                   <p className="font-bold text-sm">Complete NS Practice Quiz</p>
                   <p className="text-xs text-gray-500">Earned 50 XP</p>
                 </div>
              </div>
              <div className="flex items-center space-x-4 bg-white/5 p-4 rounded-2xl border border-white/5 opacity-50">
                 <div className="w-10 h-10 flex items-center justify-center border border-white/10 rounded-xl">2</div>
                 <div>
                   <p className="font-bold text-sm">Draft History Essay with AI</p>
                   <p className="text-xs text-gray-500">Next milestone</p>
                 </div>
              </div>
            </div>
          </div>
          
          <div className="rounded-3xl border border-blue-500/20 bg-gradient-to-b from-blue-500/5 to-transparent p-8 text-center flex flex-col items-center justify-center">
             <div className="text-4xl mb-4">🔥</div>
             <h3 className="text-2xl font-bold">5 Day Streak!</h3>
             <p className="text-gray-500 text-sm mt-2">You're learning faster than 85% of other Grade 7s.</p>
             <button className="mt-6 w-full py-3 rounded-xl bg-blue-600 font-bold text-sm">View Leaderboard</button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default HomePage;