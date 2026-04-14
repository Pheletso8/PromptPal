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
      <div className="md:col-span-2 rounded-[2rem] border border-gray-50 bg-white p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <h3 className="text-xl font-bold mb-6 text-brand-text">Your Progress</h3>
        <div className="space-y-4">
          {/* Assessments Passed */}
          <div className="flex items-center space-x-4 bg-white hover:bg-brand-secondary/5 transition-colors p-5 rounded-2xl border border-gray-100 shadow-sm">
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
          <div className="flex items-center space-x-4 bg-white hover:bg-brand-secondary/5 transition-colors p-5 rounded-2xl border border-gray-100 shadow-sm">
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
      <div className="rounded-[2rem] border border-white/20 bg-gradient-to-br from-brand-primary to-brand-secondary p-8 text-center flex flex-col items-center justify-center shadow-[0_8px_30px_rgba(107,33,168,0.15)] relative overflow-hidden group">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff1a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff1a_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30"></div>
        <div className="text-5xl mb-6 relative z-10 group-hover:scale-110 transition-transform duration-500">🏆</div>
        <h3 className="text-2xl font-bold text-white relative z-10">Leaderboard</h3>
        <p className="text-white/80 text-sm mt-3 relative z-10 font-medium leading-relaxed">
          You have <span className="text-brand-accent font-bold text-base bg-white/20 px-2 py-0.5 rounded-md mx-1">{user?.stars ?? 0}</span> stars.
          See how you rank!
        </p>
        <Link
          to="/leaderboard"
          className="mt-8 w-full py-4 rounded-full bg-white text-brand-primary font-bold text-sm shadow-md hover:shadow-lg hover:-translate-y-1 transition-all relative z-10 group-hover:bg-brand-accent group-hover:text-brand-text shrink-0"
        >
          View Leaderboard
        </Link>
      </div>
    </section>
  );
};

export default StatsWidgets;
