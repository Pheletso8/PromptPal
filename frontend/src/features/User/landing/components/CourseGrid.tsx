const courses = [
  { title: "AI for Homework", desc: "Explain complex problems and check work without cheating.", icon: "📚", color: "from-blue-500/20" },
  { title: "Smart Research", desc: "Master deep research for projects and summarize long articles.", icon: "🔍", color: "from-purple-500/20" },
  { title: "Classwork Assistant", desc: "Generate practice quizzes and summaries for any Grade 7 topic.", icon: "✍️", color: "from-green-500/20" },
  { title: "Subject Mastery", desc: "Specialized prompts for Maths, NS, EMS, and Social Sciences.", icon: "🇿🇦", color: "from-orange-500/20" }
];

export const CourseGrid = () => (
  <section className="max-w-7xl mx-auto px-8 py-24">
    <div className="mb-16">
      <h2 className="text-4xl font-black italic tracking-tighter mb-4 text-brand-text">Master your syllabus</h2>
      <p className="text-brand-text/60 text-lg">Explore specialized GenAI courses built for your academic journey.</p>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {courses.map((course, idx) => (
        <div key={idx} className="group relative p-8 rounded-3xl border border-brand-primary/10 bg-white hover:border-brand-primary/30 shadow-sm transition-all duration-500 overflow-hidden hover:shadow-md">
          <div className={`absolute inset-0 bg-linear-to-br ${course.color} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
          <div className="relative z-10">
            <div className="text-4xl mb-6 grayscale">{course.icon}</div>
            <h4 className="text-xl font-bold mb-3 text-brand-text group-hover:text-brand-primary transition-colors">{course.title}</h4>
            <p className="text-brand-text/50 text-sm leading-relaxed">{course.desc}</p>
          </div>
        </div>
      ))}
    </div>
  </section>
);