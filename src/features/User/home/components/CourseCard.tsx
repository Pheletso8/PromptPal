  interface CourseProps {
  course: {
    id: number;
    title: string;
    tag: string;
    image: string;
    progress: number;
  };
}

const CourseCard = ({ course }: CourseProps) => (
  <div className="group relative rounded-3xl border border-white/5 bg-white/2 overflow-hidden hover:border-white/20 transition-all duration-500">
    <div className="relative h-40 overflow-hidden">
      <img src={course.image} alt={course.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
      <div className="absolute inset-0 bg-linear-to-t from-[#0a0a0a] to-transparent opacity-60" />
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
      </div>
    </div>
  </div>
);

export default CourseCard;