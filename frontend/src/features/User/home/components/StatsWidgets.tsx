/**
 * StatsWidgets.tsx
 *
 * Shows the user's live stats (stars earned, assessments passed) and 
 * streak widget at the bottom of the home page.
 */
import { Link } from 'react-router-dom';
import { useAuth } from '../../../../context/AuthContext';

const StatsWidgets = () => {
  const { user } = useAuth();

  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
      {/* ── Your Progress ──────────────────────────────────────── */}
      <div className="md:col-span-2 rounded-3xl border border-brand-primary/10 bg-white p-8 shadow-sm">
        <h3 className="text-xl font-bold mb-6">Your Progress</h3>
        <div className="space-y-4">
          {/* Assessments Passed */}
          <div className="flex items-center space-x-4 bg-brand-secondary/10 p-4 rounded-2xl border border-brand-primary/5">
            <div className="w-10 h-10 flex items-center justify-center bg-green-500/20 text-green-400 rounded-xl text-lg">
              ✓
            </div>
            <div>
              <p className="font-bold text-sm text-brand-text">Assessments Passed</p>
              <p className="text-xs text-brand-text/50">
                {user?.assessmentsPassed ?? 0} completed — keep going!
              </p>
            </div>
            <span className="ml-auto text-2xl font-black text-green-400">
              {user?.assessmentsPassed ?? 0}
            </span>
          </div>

          {/* Stars Earned */}
          <div className="flex items-center space-x-4 bg-brand-secondary/10 p-4 rounded-2xl border border-brand-primary/5">
            <div className="w-10 h-10 flex items-center justify-center bg-yellow-500/20 text-yellow-400 rounded-xl text-lg">
              ⭐
            </div>
            <div>
              <p className="font-bold text-sm text-brand-text">Stars Earned</p>
              <p className="text-xs text-brand-text/50">10 stars per assessment passed</p>
            </div>
            <span className="ml-auto text-2xl font-black text-yellow-400">
              {user?.stars ?? 0}
            </span>
          </div>
        </div>
      </div>

      {/* ── Leaderboard CTA ────────────────────────────────────── */}
      <div className="rounded-3xl border border-brand-primary/20 bg-gradient-to-b from-brand-primary/10 to-brand-bg p-8 text-center flex flex-col items-center justify-center shadow-sm">
        <div className="text-4xl mb-4">🏆</div>
        <h3 className="text-2xl font-bold text-brand-text">Leaderboard</h3>
        <p className="text-brand-text/50 text-sm mt-2">
          You have <span className="text-brand-primary font-bold">{user?.stars ?? 0}</span> stars.
          See how you rank!
        </p>
        <Link
          to="/leaderboard"
          className="mt-6 w-full py-3 rounded-xl bg-brand-primary text-white font-bold text-sm hover:opacity-90 transition-all shadow-md"
        >
          View Leaderboard
        </Link>
      </div>
    </section>
  );
};

export default StatsWidgets;
