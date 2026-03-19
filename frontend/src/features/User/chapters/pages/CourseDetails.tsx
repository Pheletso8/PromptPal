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
    <div className="min-h-screen bg-brand-bg flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-brand-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (error || !course) return (
    <div className="text-brand-text p-20 text-center font-bold">{error || 'Course not found.'}</div>
  );

  return (
    <div className="min-h-screen bg-brand-bg text-brand-text font-sans selection:bg-brand-primary/30 pb-24 relative overflow-hidden">

      {/* Background Layer */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000"
          style={{ backgroundImage: course.image ? `url(${course.image})` : undefined, filter: 'blur(30px)', transform: 'scale(1.1)', opacity: 0.1 }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-brand-bg/20 via-brand-bg/60 to-brand-bg" />
      </div>

      {/* Content Layer */}
      <div className="relative z-10">
        <DetailNav />

        <main className="max-w-5xl mx-auto px-8 pt-32">

          {/* Header */}
          <div className="flex items-center justify-between mb-12 bg-white p-6 rounded-3xl border border-brand-primary/10 backdrop-blur-xl shadow-lg">
            <div className="flex items-center space-x-5">
              <span className="bg-brand-primary text-white text-[10px] font-black px-3 py-1 rounded-full tracking-tighter uppercase shadow-lg shadow-brand-primary/20">
                {course.tag}
              </span>
              <h1 className="text-2xl font-black tracking-tight italic text-brand-text">{course.title}</h1>
            </div>
          </div>

          {/* Why Learn */}
          {course.whyLearn && (
            <section className="mb-16 max-w-3xl">
              <h2 className="text-brand-primary font-black uppercase tracking-[0.3em] text-[10px] mb-4">Why we learn this</h2>
              <p className="text-brand-text/70 text-xl leading-relaxed font-light italic">"{course.whyLearn}"</p>
            </section>
          )}

          {/* Video */}
          {course.videoUrl && (
            <section className="mb-20 rounded-[2.5rem] overflow-hidden border border-brand-primary/10 aspect-video bg-white shadow-xl group">
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
            <section className="mb-20 p-10 rounded-[2.5rem] border border-brand-primary/20 bg-brand-primary/5 backdrop-blur-md">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div className="flex items-center space-x-3">
                  <span className="text-3xl">🧪</span>
                  <div>
                    <h3 className="text-xs font-black text-brand-primary uppercase tracking-widest">Prompting Lab</h3>
                    <p className="text-xl font-bold text-brand-text">{course.lessonTopic}</p>
                  </div>
                </div>
                <Link to="/ai-chatbot" className="bg-brand-primary text-white px-6 py-2 rounded-xl text-xs font-black italic uppercase hover:opacity-90 transition-all flex items-center gap-2 shadow-md shadow-brand-primary/20">
                  🚀 Test in AI Lab
                </Link>
              </div>

              <div className="grid gap-6">
                {course.templates.map((t, idx) => {
                  const key = t._id || String(idx);
                  return (
                    <div key={key} className="p-6 rounded-2xl bg-white border border-brand-primary/10 group hover:border-brand-primary/30 transition-all duration-300 shadow-sm">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center space-x-3">
                          <span className="text-xl">{t.icon}</span>
                          <span className="text-sm font-black text-brand-text/90 uppercase tracking-tighter italic">{t.title}</span>
                        </div>
                        <button
                          onClick={() => copyToClipboard(t.prompt, key)}
                          className="text-[10px] font-black text-brand-primary hover:opacity-70 uppercase tracking-widest transition-all"
                        >
                          {copied === key ? 'Copied!' : 'Copy Template'}
                        </button>
                      </div>
                      <div className="relative p-5 rounded-xl bg-brand-secondary/10 border border-brand-primary/5">
                        <p className="font-mono text-sm text-brand-text/60 leading-relaxed italic">{t.prompt}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Assessment / Quiz */}
          {course.assessment && (
            <section className="mb-20 pt-16 border-t border-brand-primary/10">
              <h3 className="text-3xl font-black italic mb-10 tracking-tighter text-brand-text">Knowledge Check</h3>
              <div className="bg-white p-10 rounded-[2.5rem] border border-brand-primary/10 backdrop-blur-md shadow-sm">
                <p className="text-xl font-medium mb-8 text-brand-text/80 leading-snug">{course.assessment.question}</p>

                <div className="grid gap-4 mb-8">
                  {course.assessment.options.map((opt, i) => (
                    <button
                      key={i}
                      onClick={() => { if (!result) setSelectedAnswer(opt); }}
                      disabled={!!result}
                      className={`w-full text-left p-5 rounded-2xl border transition-all text-sm font-medium group ${
                        selectedAnswer === opt
                          ? 'border-brand-primary/60 bg-brand-primary/10 text-brand-text'
                          : 'border-brand-primary/10 bg-brand-bg/50 hover:border-brand-primary/40 hover:bg-brand-primary/5'
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
                    <p className={`font-black text-lg mb-1 ${result.passed ? 'text-green-600' : 'text-red-500'}`}>
                      {result.passed ? '🎉 Correct!' : '❌ Not quite'}
                    </p>
                    <p className="text-sm text-brand-text/70">{result.message}</p>
                    {result.passed && (
                      <p className="text-xs text-brand-text/80 mt-2 font-bold bg-brand-accent/20 px-3 py-1 rounded-full inline-block">⭐ You earned stars! Total: {result.stars}</p>
                    )}
                  </div>
                )}

                {/* Submit button */}
                {!result && (
                  <button
                    onClick={handleSubmitAssessment}
                    disabled={!selectedAnswer || submitting}
                    className="bg-brand-primary hover:opacity-90 transition-all px-8 py-4 rounded-2xl font-bold text-white shadow-lg shadow-brand-primary/20 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {submitting ? 'Checking...' : 'Submit Answer'}
                  </button>
                )}

                {/* Retry */}
                {result && !result.passed && (
                  <button
                    onClick={() => { setResult(null); setSelectedAnswer(null); }}
                    className="mt-4 text-sm text-brand-primary hover:opacity-70 underline ml-2"
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