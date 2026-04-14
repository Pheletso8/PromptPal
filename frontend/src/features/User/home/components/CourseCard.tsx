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
    <div className="group relative rounded-[2rem] bg-white transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-brand-primary/20 flex flex-col h-full shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-50">
      <div className="relative h-48 m-3 overflow-hidden rounded-[1.5rem] bg-gradient-to-br from-brand-primary/10 to-brand-secondary/10">
        {course.image ? (
          <img
            src={course.image}
            alt={course.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl opacity-40 group-hover:scale-125 transition-transform duration-700 ease-out">
            {course.tag === 'Mathematics' ? '🔢' : course.tag === 'Science' ? '🧪' : '📚'}
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-brand-text/5 to-transparent opacity-50" />
        
        <div className="absolute top-3 left-3 flex gap-2">
          <span className="bg-white/95 backdrop-blur-md text-xs font-semibold tracking-wide px-3.5 py-1.5 rounded-full text-brand-primary shadow-sm">
            {course.tag}
          </span>
          {isCompleted && (
            <span className="bg-green-500/90 backdrop-blur-md text-xs font-semibold tracking-wide px-3.5 py-1.5 rounded-full text-white shadow-sm">
              Mastered
            </span>
          )}
        </div>
      </div>

      <div className="px-6 pb-6 pt-2 flex flex-col flex-grow">
        <h4 className="font-bold text-[1.35rem] leading-snug mb-4 text-brand-text group-hover:text-brand-primary transition-colors line-clamp-2">
          {course.title}
        </h4>
        
        <div className="mt-auto space-y-5">
          <div className="space-y-2.5">
            <div className="flex justify-between items-center text-[13px] font-semibold text-brand-text/50">
              <span>Course Progress</span>
              <span className={isCompleted ? 'text-green-500 font-bold' : 'text-brand-primary font-bold'}>{progress}%</span>
            </div>
            <div className="h-2.5 w-full bg-gray-100 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-1000 ${
                  isCompleted ? 'bg-green-500' : 'bg-gradient-to-r from-brand-primary to-brand-secondary'
                }`}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
          
          <div className="flex items-center justify-between pt-3 border-t border-gray-50">
            <span className="text-sm font-semibold text-brand-text/40">
              {course.templates?.length ?? 0} Modules
            </span>
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-brand-primary/10 text-brand-primary group-hover:bg-brand-primary group-hover:text-white transition-all duration-300 cursor-pointer shadow-sm group-hover:shadow-md group-hover:-translate-y-0.5">
              <span className="text-sm font-bold">➔</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;