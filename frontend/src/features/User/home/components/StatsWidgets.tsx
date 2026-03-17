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
      <div className="md:col-span-2 rounded-3xl border border-white/5 bg-white/2 p-8">
        <h3 className="text-xl font-bold mb-6">Your Progress</h3>
        <div className="space-y-4">
          {/* Assessments Passed */}
          <div className="flex items-center space-x-4 bg-white/5 p-4 rounded-2xl border border-white/5">
            <div className="w-10 h-10 flex items-center justify-center bg-green-500/20 text-green-400 rounded-xl text-lg">
              ✓
            </div>
            <div>
              <p className="font-bold text-sm">Assessments Passed</p>
              <p className="text-xs text-gray-500">
                {user?.assessmentsPassed ?? 0} completed — keep going!
              </p>
            </div>
            <span className="ml-auto text-2xl font-black text-green-400">
              {user?.assessmentsPassed ?? 0}
            </span>
          </div>

          {/* Stars Earned */}
          <div className="flex items-center space-x-4 bg-white/5 p-4 rounded-2xl border border-white/5">
            <div className="w-10 h-10 flex items-center justify-center bg-yellow-500/20 text-yellow-400 rounded-xl text-lg">
              ⭐
            </div>
            <div>
              <p className="font-bold text-sm">Stars Earned</p>
              <p className="text-xs text-gray-500">10 stars per assessment passed</p>
            </div>
            <span className="ml-auto text-2xl font-black text-yellow-400">
              {user?.stars ?? 0}
            </span>
          </div>
        </div>
      </div>

      {/* ── Leaderboard CTA ────────────────────────────────────── */}
      <div className="rounded-3xl border border-blue-500/20 bg-gradient-to-b from-blue-500/5 to-transparent p-8 text-center flex flex-col items-center justify-center">
        <div className="text-4xl mb-4">🏆</div>
        <h3 className="text-2xl font-bold">Leaderboard</h3>
        <p className="text-gray-500 text-sm mt-2">
          You have <span className="text-blue-400 font-bold">{user?.stars ?? 0}</span> stars.
          See how you rank!
        </p>
        <Link
          to="/leaderboard"
          className="mt-6 w-full py-3 rounded-xl bg-blue-600 font-bold text-sm hover:bg-blue-500 transition-all"
        >
          View Leaderboard
        </Link>
      </div>
    </section>
  );
};

export default StatsWidgets;
