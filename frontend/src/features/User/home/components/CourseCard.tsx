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
    <div className="group relative rounded-3xl border border-brand-primary/10 bg-white overflow-hidden hover:border-brand-primary/30 transition-all duration-500 hover:shadow-2xl hover:shadow-brand-primary/10 flex flex-col h-full shadow-sm">
      <div className="relative h-44 overflow-hidden bg-gradient-to-br from-brand-primary/10 to-brand-secondary/10">
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
        <div className="absolute inset-0 bg-gradient-to-t from-white/80 to-transparent opacity-80" />
        
        <div className="absolute top-4 left-4 flex gap-2">
          <span className="bg-white/80 backdrop-blur-md text-[10px] font-black tracking-widest uppercase px-3 py-1 rounded-full border border-brand-primary/20 text-brand-primary">
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
        <h4 className="font-black text-lg leading-tight mb-4 text-brand-text group-hover:text-brand-primary transition-colors">
          {course.title}
        </h4>
        
        <div className="mt-auto space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-brand-text/40">
              <span>Progress</span>
              <span className={isCompleted ? 'text-green-500' : 'text-brand-primary'}>{progress}%</span>
            </div>
            <div className="h-2 w-full bg-brand-secondary/10 rounded-full overflow-hidden border border-brand-primary/5 p-[1px]">
              <div 
                className={`h-full rounded-full transition-all duration-1000 ${
                  isCompleted ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.3)]' : 'bg-brand-primary shadow-[0_0_10px_rgba(206,56,190,0.3)]'
                }`}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
          
          <div className="flex items-center justify-between text-[10px] font-bold text-brand-text/50 uppercase tracking-widest">
            <span>{course.templates?.length ?? 0} Templates</span>
            <span className="flex items-center gap-1 group-hover:text-brand-primary transition-colors">
              Start <span className="text-lg">➔</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;