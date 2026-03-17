/**
 * CourseDetails.tsx
 *
 * Fetches a single course by its MongoDB _id from the backend.
 * Submits the user's quiz answer to the backend and shows real feedback.
 * The correct answer is never sent to the client — the backend validates it.
 */
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { DetailNav } from '../components/DetailNav';
import { LearningGuardrails } from '../components/LearningGuardrails';
import { api, type Course, type AssessmentResult } from '../../../../utils/api';
import { useAuth } from '../../../../context/AuthContext';

const CourseDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { refreshUser } = useAuth();

  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Quiz state
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Clipboard state
  const [copied, setCopied] = useState<string | null>(null);

  // Fetch course data from the backend by its MongoDB _id
  useEffect(() => {
    if (!id) return;
    setLoading(true);
    api.getCourseById(id)
      .then(data => setCourse(data))
      .catch(() => setError('Course not found or could not be loaded.'))
      .finally(() => setLoading(false));
  }, [id]);

  const copyToClipboard = (text: string, templateId: string) => {
    navigator.clipboard.writeText(text);
    setCopied(templateId);
    setTimeout(() => setCopied(null), 2000);
  };

  // Submit the selected quiz answer to the backend for validation
  const handleSubmitAssessment = async () => {
    if (!selectedAnswer || !id) return;
    setSubmitting(true);
    try {
      const res = await api.submitAssessment(id, selectedAnswer);
      setResult(res);
      // Refresh the user profile so stars/assessmentsPassed update in the nav
      await refreshUser();
    } catch (err: any) {
      setResult({ passed: false, score: 0, message: err.message || 'Submission failed', stars: 0 });
    } finally {
      setSubmitting(false);
    }
  };

  // ── Loading / Error states ─────────────────────────────────────────────────
  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (error || !course) return (
    <div className="text-white p-20 text-center font-bold">{error || 'Course not found.'}</div>
  );

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-blue-500/30 pb-24 relative overflow-hidden">

      {/* Background Layer */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000"
          style={{ backgroundImage: course.image ? `url(${course.image})` : undefined, filter: 'blur(15px)', transform: 'scale(1.05)', opacity: 0.2 }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/60 to-black" />
      </div>

      {/* Content Layer */}
      <div className="relative z-10">
        <DetailNav />

        <main className="max-w-5xl mx-auto px-8 pt-32">

          {/* Header */}
          <div className="flex items-center justify-between mb-12 bg-white/5 p-6 rounded-3xl border border-white/10 backdrop-blur-xl shadow-2xl">
            <div className="flex items-center space-x-5">
              <span className="bg-blue-600 text-[10px] font-black px-3 py-1 rounded-full tracking-tighter uppercase shadow-lg shadow-blue-600/20">
                {course.tag}
              </span>
              <h1 className="text-2xl font-black tracking-tight italic">{course.title}</h1>
            </div>
          </div>

          {/* Why Learn */}
          {course.whyLearn && (
            <section className="mb-16 max-w-3xl">
              <h2 className="text-blue-500 font-black uppercase tracking-[0.3em] text-[10px] mb-4">Why we learn this</h2>
              <p className="text-gray-300 text-xl leading-relaxed font-light italic">"{course.whyLearn}"</p>
            </section>
          )}

          {/* Video */}
          {course.videoUrl && (
            <section className="mb-20 rounded-[2.5rem] overflow-hidden border border-white/5 aspect-video bg-black/60 shadow-2xl group">
              <iframe
                className="w-full h-full opacity-90 group-hover:opacity-100 transition-opacity duration-700"
                src={course.videoUrl}
                title="Lesson Video"
                frameBorder="0"
                allowFullScreen
              />
            </section>
          )}

          {/* Prompting Lab */}
          {course.templates?.length > 0 && (
            <section className="mb-20 p-10 rounded-[2.5rem] border border-blue-500/20 bg-blue-500/5 backdrop-blur-md">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div className="flex items-center space-x-3">
                  <span className="text-3xl">🧪</span>
                  <div>
                    <h3 className="text-xs font-black text-blue-400 uppercase tracking-widest">Prompting Lab</h3>
                    <p className="text-xl font-bold">{course.lessonTopic}</p>
                  </div>
                </div>
                <Link to="/ai-chatbot" className="bg-blue-600 text-white px-6 py-2 rounded-xl text-xs font-black italic uppercase hover:bg-blue-500 transition-all flex items-center gap-2">
                  🚀 Test in AI Lab
                </Link>
              </div>

              <div className="grid gap-6">
                {course.templates.map((t, idx) => {
                  const key = t._id || String(idx);
                  return (
                    <div key={key} className="p-6 rounded-2xl bg-black/60 border border-white/5 group hover:border-blue-500/30 transition-all duration-300">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center space-x-3">
                          <span className="text-xl">{t.icon}</span>
                          <span className="text-sm font-black text-white/90 uppercase tracking-tighter italic">{t.title}</span>
                        </div>
                        <button
                          onClick={() => copyToClipboard(t.prompt, key)}
                          className="text-[10px] font-black text-blue-500 hover:text-white uppercase tracking-widest transition-all"
                        >
                          {copied === key ? 'Copied!' : 'Copy Template'}
                        </button>
                      </div>
                      <div className="relative p-5 rounded-xl bg-white/2 border border-white/5">
                        <p className="font-mono text-sm text-gray-400 leading-relaxed italic">{t.prompt}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Assessment / Quiz */}
          {course.assessment && (
            <section className="mb-20 pt-16 border-t border-white/10">
              <h3 className="text-3xl font-black italic mb-10 tracking-tighter text-white">Knowledge Check</h3>
              <div className="bg-white/3 p-10 rounded-[2.5rem] border border-white/5 backdrop-blur-md">
                <p className="text-xl font-medium mb-8 text-gray-200 leading-snug">{course.assessment.question}</p>

                <div className="grid gap-4 mb-8">
                  {course.assessment.options.map((opt, i) => (
                    <button
                      key={i}
                      onClick={() => { if (!result) setSelectedAnswer(opt); }}
                      disabled={!!result}
                      className={`w-full text-left p-5 rounded-2xl border transition-all text-sm font-medium group ${
                        selectedAnswer === opt
                          ? 'border-blue-500/60 bg-blue-500/10 text-white'
                          : 'border-white/5 bg-white/5 hover:border-blue-500/40 hover:bg-blue-500/5'
                      } disabled:opacity-70 disabled:cursor-default`}
                    >
                      <span className="mr-4 opacity-30 group-hover:opacity-100 transition-opacity">{i + 1}.</span>
                      {opt}
                    </button>
                  ))}
                </div>

                {/* Result feedback */}
                {result && (
                  <div className={`p-6 rounded-2xl border mb-6 ${result.passed ? 'border-green-500/40 bg-green-500/10' : 'border-red-500/40 bg-red-500/10'}`}>
                    <p className={`font-black text-lg mb-1 ${result.passed ? 'text-green-400' : 'text-red-400'}`}>
                      {result.passed ? '🎉 Correct!' : '❌ Not quite'}
                    </p>
                    <p className="text-sm text-gray-300">{result.message}</p>
                    {result.passed && (
                      <p className="text-xs text-yellow-400 mt-2 font-bold">⭐ You earned stars! Total: {result.stars}</p>
                    )}
                  </div>
                )}

                {/* Submit button */}
                {!result && (
                  <button
                    onClick={handleSubmitAssessment}
                    disabled={!selectedAnswer || submitting}
                    className="bg-blue-600 hover:bg-blue-500 transition-all px-8 py-4 rounded-2xl font-bold disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {submitting ? 'Checking...' : 'Submit Answer'}
                  </button>
                )}

                {/* Retry */}
                {result && !result.passed && (
                  <button
                    onClick={() => { setResult(null); setSelectedAnswer(null); }}
                    className="mt-4 text-sm text-blue-400 hover:text-white underline"
                  >
                    Try Again
                  </button>
                )}
              </div>
            </section>
          )}

          <LearningGuardrails />
        </main>
      </div>
    </div>
  );
};

export default CourseDetail;