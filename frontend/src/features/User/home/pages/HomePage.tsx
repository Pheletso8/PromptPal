/**
 * HomePage.tsx
 *
 * The main student dashboard.
 * - Fetches all available courses from the backend via /api/courses.
 * - Supports local search + tag filter on top of the live API data.
 */
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import HomeNav from '../components/HomeNav';
import ContinueLearning from '../components/ContinueLearning';
import CourseCard from '../components/CourseCard';
import StatsWidgets from '../components/StatsWidgets';
import { PromptIntroduction } from '../components/PromptIntroduction';
import { VideoPlayer } from '../../chapters/components/VideoPlayer';
import { api, type Course } from '../../../../utils/api';

const TAGS = ['All', 'Maths', 'Research', 'Science', 'EMS', 'English'];

const HomePage: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [search, setSearch] = useState('');
  const [activeTag, setActiveTag] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch all courses from the backend on mount
  useEffect(() => {
    api.getAllCourses()
      .then(data => setCourses(data))
      .catch(() => setError('Could not load courses. Please try again.'))
      .finally(() => setLoading(false));
  }, []);

  // Client-side filter by tag and search term
  const filteredCourses = courses.filter(c =>
    (activeTag === 'All' || c.tag === activeTag) &&
    c.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-blue-500/30 pb-20">
      <HomeNav />

      {/* Floating AI Lab CTA */}
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
        <ContinueLearning courses={courses} />

        {/* AI Tutor promo */}
        <section className="mb-12 p-8 rounded-3xl border border-blue-500/20 bg-blue-500/5 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl font-black italic mb-2 tracking-tighter">Stuck on a problem?</h3>
            <p className="text-gray-400 text-sm">Our PromptPal AI is ready to help you with your Grade 7 homework right now.</p>
          </div>
          <Link to="/ai-chatbot" className="bg-white text-black px-8 py-3 rounded-xl font-bold text-sm hover:bg-blue-50 transition-all">
            Chat with AI Tutor
          </Link>
        </section>

        {/* Course Catalog */}
        <section className="mb-12">
          {/* Search & Filter */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                placeholder="Search subjects or topics..."
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-12 py-4 focus:outline-none focus:border-blue-500/50 transition-all"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 opacity-40 text-xl">🔍</span>
            </div>
            <div className="flex items-center space-x-2 overflow-x-auto pb-2">
              {TAGS.map(tag => (
                <button
                  key={tag}
                  onClick={() => setActiveTag(tag)}
                  className={`px-5 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                    activeTag === tag
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                      : 'bg-white/5 text-gray-500 hover:bg-white/10'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Course Grid */}
          {loading && (
            <div className="flex justify-center py-20">
              <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
          )}
          {error && <p className="text-red-400 text-center py-10">{error}</p>}
          {!loading && !error && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredCourses.map(course => (
                <Link to={`/course/${course._id}`} key={course._id}>
                  <CourseCard course={course} />
                </Link>
              ))}
              {filteredCourses.length === 0 && (
                <p className="col-span-4 text-center text-gray-500 py-10">No courses match your search.</p>
              )}
            </div>
          )}
        </section>

        <StatsWidgets />
      </main>
    </div>
  );
};

export default HomePage;