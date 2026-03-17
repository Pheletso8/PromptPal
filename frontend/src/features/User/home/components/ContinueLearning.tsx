/**
 * ContinueLearning.tsx
 *
 * Shows the first assigned course as the "continue learning" card.
 * Accepts courses prop from HomePage (already fetched from backend).
 */
import { Link } from 'react-router-dom';
import type { Course } from '../../../../utils/api';

interface Props {
  courses: Course[];
}

const ContinueLearning = ({ courses }: Props) => {
  const activeCourse = courses[0];

  if (!activeCourse) return null;

  // Mock progress
  const progress = 65;

  return (
    <section className="mb-12">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="text-xs font-black text-blue-500 uppercase tracking-[0.3em] mb-1">Adventure Continues</h2>
          <h3 className="text-2xl font-black tracking-tight">Welcome back, Explorer!</h3>
        </div>
        <div className="hidden md:flex gap-2">
           <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-bold">7</div>
           <div className="text-right">
             <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Day Streak</p>
             <p className="text-xs font-bold text-white">Keep it up!</p>
           </div>
        </div>
      </div>

      <div className="relative group overflow-hidden rounded-[2.5rem] border border-blue-500/30 bg-gradient-to-br from-blue-600/10 via-transparent to-purple-600/10 p-1 md:p-1.5 transition-all hover:border-blue-500/50">
        <div className="bg-[#0f0f0f]/80 backdrop-blur-xl rounded-[2.2rem] p-8 md:p-12 md:flex items-center justify-between relative overflow-hidden">
          {/* Animated Background Element */}
          <div className="absolute -right-20 -top-20 w-80 h-80 bg-blue-600/20 blur-[100px] animate-pulse pointer-events-none" />
          <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-purple-600/10 blur-[100px] pointer-events-none" />

          <div className="relative z-10 max-w-xl">
            <div className="flex items-center gap-3 mb-6">
              <span className="bg-blue-600 text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-[0.2em] shadow-lg shadow-blue-600/20">
                Active Lesson
              </span>
              <span className="text-blue-400 text-xs font-bold">Topic: {activeCourse.lessonTopic || 'Intro'}</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-4 text-white hover:text-blue-400 transition-colors cursor-default">
              {activeCourse.title}
            </h1>
            
            <p className="text-gray-400 mb-8 text-base leading-relaxed font-medium">
              {activeCourse.whyLearn || 'Master prompting techniques to get perfect answers every time.'}
            </p>

            <div className="space-y-3 max-w-sm">
              <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-gray-500">
                <span>Course Progress</span>
                <span className="text-blue-400">{progress}% Complete</span>
              </div>
              <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden border border-white/5 p-[2px]">
                <div 
                  className="h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full shadow-[0_0_15px_rgba(37,99,235,0.4)] transition-all duration-1000"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>

          <Link
            to={`/course/${activeCourse._id}`}
            className="relative z-10 mt-10 md:mt-0 flex items-center justify-center gap-3 bg-blue-600 text-white px-10 py-5 rounded-2xl font-black text-lg transition-all hover:bg-blue-500 hover:scale-105 active:scale-95 shadow-2xl shadow-blue-600/40 group/btn"
          >
            Resume Lesson
            <span className="text-2xl group-hover/btn:translate-x-1 transition-transform">➔</span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ContinueLearning;