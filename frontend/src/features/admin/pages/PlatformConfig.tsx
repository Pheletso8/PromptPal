import { useState, useEffect } from 'react';
import { api } from '../../../utils/api';
import AdminLayout from '../components/AdminLayout';
import {
  Settings, Globe, ShieldCheck, Megaphone, BookOpen,
  Users, BarChart2, Bot, Save, RotateCcw
} from 'lucide-react';

/* ─── helpers ─────────────────────────────────────────────────────────────── */
const SectionCard = ({ icon: Icon, title, children }: {
  icon: any; title: string; children: React.ReactNode;
}) => (
  <div className="bg-white rounded-[2rem] border border-brand-primary/10 shadow-sm overflow-hidden">
    <div className="flex items-center gap-4 px-8 py-5 border-b border-brand-primary/5 bg-brand-secondary/5">
      <div className="w-9 h-9 rounded-xl bg-brand-primary/10 flex items-center justify-center">
        <Icon className="w-4 h-4 text-brand-primary" />
      </div>
      <h3 className="font-black italic text-brand-text text-sm uppercase tracking-widest">{title}</h3>
    </div>
    <div className="p-8 space-y-6">{children}</div>
  </div>
);

const Toggle = ({ label, description, checked, onChange }: {
  label: string; description: string; checked: boolean; onChange: (v: boolean) => void;
}) => (
  <div className="flex items-center justify-between gap-8">
    <div>
      <p className="font-bold text-sm text-brand-text">{label}</p>
      <p className="text-[11px] text-brand-text/40 mt-0.5">{description}</p>
    </div>
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-7 w-12 shrink-0 rounded-full border-2 transition-colors duration-200 ${
        checked ? 'bg-brand-primary border-brand-primary' : 'bg-brand-text/10 border-brand-text/10'
      }`}
    >
      <span className={`inline-block h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
        checked ? 'translate-x-5' : 'translate-x-0.5'
      } mt-0.5`} />
    </button>
  </div>
);

const NumberInput = ({ label, description, value, min, max, onChange }: {
  label: string; description: string; value: number;
  min?: number; max?: number; onChange: (v: number) => void;
}) => (
  <div className="flex items-center justify-between gap-8">
    <div>
      <p className="font-bold text-sm text-brand-text">{label}</p>
      <p className="text-[11px] text-brand-text/40 mt-0.5">{description}</p>
    </div>
    <input
      type="number"
      min={min}
      max={max}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-24 text-center font-black text-brand-text bg-brand-secondary/5 border border-brand-primary/10 rounded-xl px-3 py-2 outline-none focus:border-brand-primary/50 transition-colors"
    />
  </div>
);

/* ─── default shape matches the backend model ─────────────────────────────── */
const DEFAULT_CONFIG = {
  platformName: 'PromptPal',
  tagline: 'Learn AI Prompting. Unlock Your Potential.',
  maintenanceMode: false,
  registrationOpen: true,
  announcementText: '',
  announcementEnabled: false,
  defaultPassingThreshold: 70,
  maxAssessmentAttempts: 3,
  maxCoursesPerStudent: 5,
  allowStudentProfileEdits: true,
  leaderboardEnabled: true,
  aiChatbotEnabled: true,
};

/* ─── Page ────────────────────────────────────────────────────────────────── */
const PlatformConfig = () => {
  const [config, setConfig] = useState(DEFAULT_CONFIG);
  const [saved,  setSaved]  = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    api.getConfig()
      .then((data: any) => setConfig({ ...DEFAULT_CONFIG, ...data }))
      .catch(() => console.error('Failed to load config'))
      .finally(() => setIsLoading(false));
  }, []);

  const set = (key: keyof typeof DEFAULT_CONFIG, value: any) =>
    setConfig(prev => ({ ...prev, [key]: value }));

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const updated = await api.updateConfig(config);
      setConfig({ ...DEFAULT_CONFIG, ...updated });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      alert('Failed to save configuration. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <AdminLayout title="Platform Config" subtitle="System Settings">
        <div className="space-y-6 pt-4">
          {[1,2,3,4].map(i => (
            <div key={i} className="bg-white rounded-[2rem] border border-brand-primary/10 h-48 animate-pulse" />
          ))}
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Platform Config" subtitle="System Settings">
      <form onSubmit={handleSave} className="space-y-8 pb-12">

        {/* ── Save Bar ───────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between">
          <p className="text-[10px] font-black uppercase tracking-widest text-brand-text/30">
            Configure global platform behaviour
          </p>
          <div className="flex items-center gap-4">
            {saved && (
              <span className="px-4 py-2 bg-green-500/10 text-green-600 text-[11px] font-black uppercase rounded-full border border-green-500/20 animate-in fade-in">
                ✓ Saved Successfully
              </span>
            )}
            <button
              type="button"
              onClick={() => setConfig(DEFAULT_CONFIG)}
              className="flex items-center gap-2 px-6 py-3 rounded-xl border border-brand-primary/10 text-brand-text/50 hover:text-brand-primary hover:border-brand-primary/30 font-black uppercase tracking-widest text-[10px] transition-all"
            >
              <RotateCcw className="w-4 h-4" /> Reset
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-2 px-8 py-3 bg-brand-primary hover:opacity-90 disabled:opacity-50 text-white rounded-xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-brand-primary/20 transition-all"
            >
              <Save className="w-4 h-4" />
              {isSaving ? 'Saving...' : 'Save Config'}
            </button>
          </div>
        </div>

        {/* ── General ───────────────────────────────────────────────────── */}
        <SectionCard icon={Globe} title="General">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-text/40 px-1">Platform Name</label>
            <input
              value={config.platformName}
              onChange={e => set('platformName', e.target.value)}
              className="w-full bg-brand-secondary/5 border border-brand-primary/10 rounded-xl px-4 py-3 outline-none focus:border-brand-primary/50 text-brand-text font-bold transition-colors"
              placeholder="PromptPal"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-text/40 px-1">Platform Tagline</label>
            <input
              value={config.tagline}
              onChange={e => set('tagline', e.target.value)}
              className="w-full bg-brand-secondary/5 border border-brand-primary/10 rounded-xl px-4 py-3 outline-none focus:border-brand-primary/50 text-brand-text font-bold transition-colors"
              placeholder="Learn AI Prompting. Unlock Your Potential."
            />
          </div>
        </SectionCard>

        {/* ── Access Control ────────────────────────────────────────────── */}
        <SectionCard icon={ShieldCheck} title="Access Control">
          <Toggle
            label="Maintenance Mode"
            description="Blocks all student access & shows a maintenance notice"
            checked={config.maintenanceMode}
            onChange={v => set('maintenanceMode', v)}
          />
          <div className="border-t border-brand-primary/5 pt-6" />
          <Toggle
            label="Open Registration"
            description="Allow new students to self-register accounts"
            checked={config.registrationOpen}
            onChange={v => set('registrationOpen', v)}
          />
          <div className="border-t border-brand-primary/5 pt-6" />
          <Toggle
            label="Student Profile Edits"
            description="Allow students to update their name, email, and profile image"
            checked={config.allowStudentProfileEdits}
            onChange={v => set('allowStudentProfileEdits', v)}
          />
        </SectionCard>

        {/* ── Announcement Banner ───────────────────────────────────────── */}
        <SectionCard icon={Megaphone} title="Announcement Banner">
          <Toggle
            label="Enable Announcement"
            description="Show a platform-wide banner to all students on the home screen"
            checked={config.announcementEnabled}
            onChange={v => set('announcementEnabled', v)}
          />
          {config.announcementEnabled && (
            <div className="space-y-2 mt-4">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-text/40 px-1">Announcement Message</label>
              <textarea
                rows={3}
                value={config.announcementText}
                onChange={e => set('announcementText', e.target.value)}
                className="w-full bg-brand-secondary/5 border border-brand-primary/10 rounded-xl px-4 py-3 outline-none focus:border-brand-primary/50 text-brand-text font-bold resize-none transition-colors text-sm leading-relaxed"
                placeholder="e.g. 🎉 New course available this Friday — stay tuned!"
              />
            </div>
          )}
        </SectionCard>

        {/* ── Assessment Rules ──────────────────────────────────────────── */}
        <SectionCard icon={BookOpen} title="Assessment Rules">
          <NumberInput
            label="Default Passing Threshold"
            description="Minimum score (%) required to pass any assessment"
            value={config.defaultPassingThreshold}
            min={1}
            max={100}
            onChange={v => set('defaultPassingThreshold', v)}
          />
          <div className="border-t border-brand-primary/5 pt-6" />
          <NumberInput
            label="Max Assessment Attempts"
            description="How many times a student may retry a failed assessment"
            value={config.maxAssessmentAttempts}
            min={1}
            max={10}
            onChange={v => set('maxAssessmentAttempts', v)}
          />
        </SectionCard>

        {/* ── Student Limits ────────────────────────────────────────────── */}
        <SectionCard icon={Users} title="Student Limits">
          <NumberInput
            label="Max Courses Per Student"
            description="Maximum number of courses an admin can assign to one student"
            value={config.maxCoursesPerStudent}
            min={1}
            max={20}
            onChange={v => set('maxCoursesPerStudent', v)}
          />
        </SectionCard>

        {/* ── Features ──────────────────────────────────────────────────── */}
        <SectionCard icon={Settings} title="Feature Flags">
          <Toggle
            label="Leaderboard"
            description="Show the student leaderboard on the home dashboard"
            checked={config.leaderboardEnabled}
            onChange={v => set('leaderboardEnabled', v)}
          />
          <div className="border-t border-brand-primary/5 pt-6" />
          <Toggle
            label="AI Chatbot Lab"
            description="Enable the AI chat lab feature for students"
            checked={config.aiChatbotEnabled}
            onChange={v => set('aiChatbotEnabled', v)}
          />
        </SectionCard>

      </form>
    </AdminLayout>
  );
};

export default PlatformConfig;
