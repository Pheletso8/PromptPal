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
          <h2 className="text-[10px] font-black text-brand-primary uppercase tracking-[0.3em] mb-1 italic">Adventure Continues</h2>
          <h3 className="text-2xl font-black tracking-tight text-brand-text">Welcome back, Explorer!</h3>
        </div>
        <div className="hidden md:flex gap-3">
           <div className="w-10 h-10 rounded-xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center text-brand-primary font-black shadow-sm">7</div>
           <div className="text-right">
             <p className="text-[10px] font-black uppercase tracking-widest text-brand-text/30">Day Streak</p>
             <p className="text-xs font-black text-brand-text italic">Keep it up!</p>
           </div>
        </div>
      </div>

      <div className="relative group overflow-hidden rounded-[2.5rem] border border-gray-50 bg-white p-1 md:p-1.5 transition-all hover:border-brand-primary/20 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <div className="bg-white/80 backdrop-blur-xl rounded-[2.2rem] p-8 md:p-12 md:flex items-center justify-between relative overflow-hidden">
          {/* Animated Background Elements */}
          <div className="absolute -right-20 -top-20 w-80 h-80 bg-brand-primary/10 blur-[100px] animate-pulse pointer-events-none" />
          <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-brand-secondary/5 blur-[100px] pointer-events-none" />

          <div className="relative z-10 max-w-xl">
            <div className="flex items-center gap-3 mb-6">
              <span className="bg-brand-primary text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-[0.2em] shadow-lg shadow-brand-primary/20 italic">
                Active Lesson
              </span>
              <span className="text-brand-primary/60 text-[10px] font-black uppercase tracking-widest">Topic: {activeCourse.lessonTopic || 'Intro'}</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-4 text-brand-text hover:text-brand-primary transition-colors cursor-default italic">
              {activeCourse.title}
            </h1>
            
            <p className="text-brand-text/60 mb-8 text-base leading-relaxed font-medium">
              {activeCourse.whyLearn || 'Master prompting techniques to get perfect answers every time.'}
            </p>

            <div className="space-y-3 max-w-sm">
              <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-brand-text/40">
                <span>Course Progress</span>
                <span className="text-brand-primary">{progress}% Complete</span>
              </div>
              <div className="h-4 w-full bg-gray-100 rounded-full overflow-hidden border border-gray-50 p-[3px]">
                <div 
                  className="h-full bg-gradient-to-r from-brand-primary to-brand-secondary rounded-full shadow-[0_0_15px_rgba(107,33,168,0.3)] transition-all duration-1000"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>

          <Link
            to={`/course/${activeCourse._id}`}
            className="relative z-10 mt-10 md:mt-0 flex items-center justify-center gap-3 bg-brand-primary text-white px-10 py-5 rounded-full font-bold tracking-widest text-sm transition-all hover:-translate-y-1 active:scale-95 shadow-[0_4px_14px_0_rgba(107,33,168,0.25)] hover:shadow-[0_6px_20px_rgba(107,33,168,0.23)] group/btn border border-white/20"
          >
            Resume Lesson
            <span className="text-xl group-hover/btn:translate-x-1 transition-transform">➔</span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ContinueLearning;