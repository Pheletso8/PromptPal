/**
 * CourseCard.tsx
 *
 * Card component for displaying a course in the grid.
 * Updated to accept the API Course type (uses _id and optional image URL).
 */
import type { Course } from '../../../../utils/api';

interface CourseProps {
  course: Course;
}

const CourseCard = ({ course }: CourseProps) => {
  // Mock progress for now - in a real app, this would come from a progress record
  const progress = Math.floor(Math.random() * 101);
  const isCompleted = progress === 100;

  return (
    <div className="group relative rounded-3xl border border-white/5 bg-white/2 overflow-hidden hover:border-blue-500/30 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/10 flex flex-col h-full">
      <div className="relative h-44 overflow-hidden bg-gradient-to-br from-blue-900/30 to-purple-900/30">
        {course.image ? (
          <img
            src={course.image}
            alt={course.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl opacity-40 group-hover:scale-125 transition-transform duration-500">
            {course.tag === 'Mathematics' ? '🔢' : course.tag === 'Science' ? '🧪' : '📚'}
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] to-transparent opacity-80" />
        
        <div className="absolute top-4 left-4 flex gap-2">
          <span className="bg-black/60 backdrop-blur-md text-[10px] font-black tracking-widest uppercase px-3 py-1 rounded-full border border-white/10 text-blue-400">
            {course.tag}
          </span>
          {isCompleted && (
            <span className="bg-green-500/20 backdrop-blur-md text-[10px] font-black tracking-widest uppercase px-3 py-1 rounded-full border border-green-500/30 text-green-400">
              Mastered
            </span>
          )}
        </div>
      </div>

      <div className="p-6 flex flex-col flex-grow">
        <h4 className="font-black text-lg leading-tight mb-4 group-hover:text-blue-400 transition-colors">
          {course.title}
        </h4>
        
        <div className="mt-auto space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-gray-500">
              <span>Progress</span>
              <span className={isCompleted ? 'text-green-400' : 'text-blue-400'}>{progress}%</span>
            </div>
            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5 p-[1px]">
              <div 
                className={`h-full rounded-full transition-all duration-1000 ${
                  isCompleted ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.5)]'
                }`}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
          
          <div className="flex items-center justify-between text-[10px] font-bold text-gray-600 uppercase tracking-widest">
            <span>{course.templates?.length ?? 0} Templates</span>
            <span className="flex items-center gap-1">
              Start <span className="text-lg">➔</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;