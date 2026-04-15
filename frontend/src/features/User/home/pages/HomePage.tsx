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
import CourseCardSkeleton from '../components/CourseCardSkeleton';
import StatsWidgets from '../components/StatsWidgets';
import { PromptIntroduction } from '../components/PromptIntroduction';
import { VideoPlayer } from '../../chapters/components/VideoPlayer';
import { api, type Course } from '../../../../utils/api';
import { MessageSquare, Search } from 'lucide-react';

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
    <div className="min-h-screen bg-brand-bg text-brand-text font-sans selection:bg-brand-primary/30 pb-20">
      <HomeNav />

      {/* Floating AI Lab CTA */}
      <Link
        to="/ai-chatbot"
        className="fixed bottom-8 right-8 z-50 group flex items-center gap-3 bg-brand-primary hover:bg-brand-secondary text-white px-6 py-4 rounded-full font-bold shadow-[0_8px_30px_rgb(107,33,168,0.3)] transition-all hover:-translate-y-1 active:scale-95 border border-white/20"
      >
        <MessageSquare className="w-5 h-5" />
        <span className="hidden md:block uppercase tracking-wider text-sm">Open AI Lab</span>
      </Link>

      <main className="max-w-7xl mx-auto px-8 pt-28">
        <PromptIntroduction />
        <VideoPlayer videoUrl="https://www.youtube.com/embed/dtSpw9xVo2k" />
        <ContinueLearning courses={courses} />

        {/* AI Tutor promo */}
        <section className="mb-14 p-8 md:p-10 rounded-[2rem] bg-gradient-to-br from-brand-primary/10 via-brand-secondary/5 to-transparent border border-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 hidden sm:flex items-center justify-center bg-white rounded-full shadow-sm text-3xl">✨</div>
            <div>
              <h3 className="text-[1.75rem] font-bold mb-2 text-brand-text">Stuck on a problem?</h3>
              <p className="text-brand-text/60 font-medium text-base">Our AI Tutor is ready to explain concepts clearly, step by step.</p>
            </div>
          </div>
          <Link to="/ai-chatbot" className="bg-white text-brand-primary border border-gray-100 px-8 py-3.5 rounded-full font-bold shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all whitespace-nowrap">
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
                className="w-full bg-white border border-gray-100 rounded-full px-14 py-4 focus:outline-none focus:border-brand-primary/40 focus:ring-4 focus:ring-brand-primary/10 transition-all text-brand-text placeholder:text-brand-text/40 shadow-sm"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 opacity-40 text-xl grayscale contrast-200">
                <Search className="w-5 h-5" />
              </span>
            </div>
            <div className="flex items-center space-x-3 overflow-x-auto pb-2 scrollbar-hide px-1">
              {TAGS.map(tag => (
                <button
                  key={tag}
                  onClick={() => setActiveTag(tag)}
                  className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all whitespace-nowrap border ${
                    activeTag === tag
                      ? 'bg-brand-primary text-white border-transparent shadow-[0_4px_14px_0_rgba(107,33,168,0.25)] hover:-translate-y-0.5'
                      : 'bg-white border-gray-100 text-brand-text/70 hover:shadow-md hover:-translate-y-0.5'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Course Grid */}
          {loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <CourseCardSkeleton key={i} />
              ))}
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