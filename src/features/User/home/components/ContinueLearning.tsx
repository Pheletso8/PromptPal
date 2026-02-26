import { Link } from 'react-router-dom';
import { COURSES } from '../../../../data/courseData';

const ContinueLearning = () => {
  // Find the course with id: 1 (or whichever one the user is currently on)
  const activeCourse = COURSES.find(c => c.id === 1) || COURSES[0];

  return (
    <section className="mb-12">
      <h2 className="text-sm font-bold text-blue-500 uppercase tracking-[0.2em] mb-4">Welcome back!</h2>
      <div className="relative group overflow-hidden rounded-3xl border border-blue-500/30 bg-blue-500/5 p-8 md:flex items-center justify-between">
        <div className="relative z-10 max-w-xl">
           <span className="bg-blue-500/20 text-blue-400 text-[10px] font-bold px-2 py-1 rounded mb-4 inline-block uppercase tracking-wider">
             Continue Learning
           </span>
           {/* Use dynamic title from the active course */}
           <h1 className="text-3xl font-black italic tracking-tighter mb-2">{activeCourse.title}</h1>
           <p className="text-gray-400 mb-6 text-sm">Master the "Role, Task, Context" framework to get perfect answers every time.</p>
           
           <div className="flex items-center space-x-4">
             <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                {/* Use dynamic progress from the active course */}
                <div className="h-full bg-blue-500 transition-all duration-1000" style={{ width: `${activeCourse.progress}%` }} />
             </div>
             <span className="text-sm font-bold text-blue-400">{activeCourse.progress}%</span>
           </div>
        </div>

        {/* Fixed Link: Points to the specific active course ID */}
        <Link 
          to={`/course/${activeCourse.id}`} 
          className="relative z-10 mt-6 md:mt-0 bg-white text-black px-8 py-3 rounded-xl font-bold hover:bg-blue-50 transition-all shadow-xl shadow-white/5"
        >
          Resume Lesson
        </Link>

        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 blur-[100px] z-0 pointer-events-none" />
      </div>
    </section>
  );
};

export default ContinueLearning;