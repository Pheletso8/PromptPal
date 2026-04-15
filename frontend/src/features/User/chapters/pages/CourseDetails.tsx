import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { DetailNav } from '../components/DetailNav';
import { Copy, CheckCircle2 } from 'lucide-react';
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
  const [answers, setAnswers] = useState<string[]>([]);
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

  // Submit the selected quiz answers to the backend for validation
  const handleSubmitAssessment = async () => {
    if (!id) return;
    const items = (course?.assessments?.length) ? course.assessments : (course?.assessment ? [course.assessment] : []);
    if (items && answers.filter(Boolean).length !== items.length) {
      alert('Please answer all questions before submitting.');
      return;
    }
    setSubmitting(true);
    try {
      const res = await api.submitAssessment(id, answers);
      setResult(res);
      if (res.passed) {
        // Refresh the user profile so stars/assessmentsPassed update in the nav
        await refreshUser();
      }
    } catch (err: any) {
      setResult({ passed: false, score: 0, message: err.message || 'Submission failed', stars: 0 });
    } finally {
      setSubmitting(false);
    }
  };

  const handleSelectAnswer = (qIndex: number, opt: string) => {
    if (result && result.locked) return;
    const newAnswers = [...answers];
    newAnswers[qIndex] = opt;
    setAnswers(newAnswers);
  };

  // ── Loading / Error states ─────────────────────────────────────────────────
  if (loading) return (
    <div className="min-h-screen bg-brand-bg font-sans pb-24 relative overflow-hidden">
      <DetailNav />
      <div className="max-w-5xl mx-auto px-8 pt-32">
        <div className="flex items-center space-x-5 mb-12 bg-white p-6 rounded-3xl border border-brand-primary/10 shadow-lg animate-pulse">
          <div className="w-20 h-6 bg-brand-primary/20 rounded-full" />
          <div className="w-64 h-8 bg-brand-primary/10 rounded-xl" />
        </div>
        <div className="mb-20 rounded-[2.5rem] aspect-video bg-white shadow-xl animate-pulse" />
        <div className="mb-20 p-10 rounded-[2.5rem] border border-brand-primary/10 bg-white animate-pulse">
          <div className="w-1/3 h-8 bg-brand-primary/10 rounded-xl mb-6" />
          <div className="w-full h-32 bg-brand-secondary/10 rounded-2xl" />
        </div>
      </div>
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
          {(course.templates?.length ?? 0) > 0 && (
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
                          className="flex items-center gap-1.5 text-[10px] font-black bg-brand-primary/10 text-brand-primary hover:bg-brand-primary/20 px-3 py-1.5 rounded-full uppercase tracking-widest transition-all"
                        >
                          {copied === key ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Copied!
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              Copy Template
                            </>
                          )}
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
          {((course.assessments?.length ?? 0) > 0 || course.assessment) && (
            <section className="mb-20 pt-16 border-t border-brand-primary/10">
              <div className="flex justify-between items-center mb-10">
                <h3 className="text-3xl font-black italic tracking-tighter text-brand-text">Knowledge Check</h3>
                {result && result.attempts !== undefined && (
                  <div className="bg-brand-secondary/10 px-4 py-2 rounded-full border border-brand-primary/20">
                    <span className="text-xs font-bold text-brand-primary uppercase tracking-widest">
                      Attempts: {result.attempts}/3
                    </span>
                  </div>
                )}
              </div>
              <div className="bg-white p-10 rounded-[2.5rem] border border-brand-primary/10 backdrop-blur-md shadow-sm">
                
                {(course.assessments?.length ? course.assessments : (course.assessment ? [course.assessment] : [])).map((assmt, qIndex) => {
                  
                  // Was this specific question wrong?
                  const correction = result?.corrections?.find(c => c.questionIndex === qIndex);
                  
                  return (
                    <div key={qIndex} className="mb-10 last:mb-0 border-b border-brand-primary/5 last:border-0 pb-10 last:pb-0">
                      <p className="text-xl font-medium mb-6 text-brand-text/80 leading-snug">
                        <span className="text-brand-primary font-black mr-2">{qIndex + 1}.</span> 
                        {assmt.question}
                      </p>

                      <div className="grid gap-4 mb-4">
                        {assmt.options.map((opt: string, i: number) => {
                          const isSelected = answers[qIndex] === opt;
                          const isCorrectionWrong = correction && correction.yourAnswer === opt;
                          
                          let btnClass = isSelected 
                            ? 'border-brand-primary/60 bg-brand-primary/10 text-brand-text'
                            : 'border-brand-primary/10 bg-brand-bg/50 hover:border-brand-primary/40 hover:bg-brand-primary/5';
                            
                          if (isCorrectionWrong) {
                            btnClass = 'border-red-500/60 bg-red-500/10 text-red-600 line-through opacity-70';
                          }

                          return (
                            <button
                              key={i}
                              onClick={() => { if (!result?.passed && !result?.locked) handleSelectAnswer(qIndex, opt); }}
                              disabled={!!result?.passed || !!result?.locked}
                              className={`w-full text-left p-5 rounded-2xl border transition-all text-sm font-medium group ${btnClass} disabled:cursor-default`}
                            >
                              <span className="mr-4 opacity-30 group-hover:opacity-100 transition-opacity">{i + 1}.</span>
                              {opt}
                            </button>
                          );
                        })}
                      </div>
                      
                      {correction && (
                        <div className="bg-brand-secondary/10 p-4 rounded-xl border border-brand-primary/10">
                          <p className="text-xs font-bold text-brand-primary">💡 Hint: The chosen answer was incorrect. Try another option.</p>
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Result feedback */}
                {result && (
                  <div className={`mt-8 p-6 rounded-2xl border mb-6 ${result.passed ? 'border-green-500/40 bg-green-500/10' : (result.locked ? 'border-gray-500/40 bg-gray-500/10' : 'border-red-500/40 bg-red-500/10')}`}>
                    <p className={`font-black text-lg mb-1 ${result.passed ? 'text-green-600' : (result.locked ? 'text-gray-600' : 'text-red-500')}`}>
                      {result.passed ? '🎉 Passed!' : (result.locked ? '🔒 Locked Out' : '❌ Not quite')}
                    </p>
                    <p className="text-sm text-brand-text/70">{result.message} {result.score !== undefined && `(Score: ${result.score.toFixed(0)}%)`}</p>
                    {result.passed && (
                      <p className="text-xs text-brand-text/80 mt-2 font-bold bg-brand-accent/20 px-3 py-1 rounded-full inline-block">⭐ You earned stars! Total: {result.stars}</p>
                    )}
                  </div>
                )}

                {/* Actions */}
                <div className="mt-8 flex items-center gap-4">
                  {(!result || (!result.passed && !result.locked)) && (
                    <button
                      onClick={handleSubmitAssessment}
                      disabled={submitting || answers.filter(Boolean).length < (course.assessments?.length || (course.assessment ? 1 : 0))}
                      className="bg-brand-primary hover:opacity-90 transition-all px-8 py-4 rounded-2xl font-bold text-white shadow-lg shadow-brand-primary/20 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      {submitting ? 'Checking...' : (result ? 'Submit Again' : 'Submit Answers')}
                    </button>
                  )}

                  {result && !result.passed && !result.locked && (
                    <button
                      onClick={() => { setResult(null); setAnswers([]); }}
                      className="text-sm text-brand-primary hover:opacity-70 underline font-bold"
                    >
                      Clear & Try Again
                    </button>
                  )}
                </div>
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