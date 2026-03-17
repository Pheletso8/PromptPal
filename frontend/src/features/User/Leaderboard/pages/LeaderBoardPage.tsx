/**
 * LeaderBoardPage.tsx
 *
 * Fetches the real leaderboard from the backend API.
 * Highlights the logged-in user's row and shows their live rank.
 */
import { useState, useEffect } from 'react';
import { LeaderboardHeader } from '../components/LeaderBoardHeader';
import { LeaderboardInstructions } from '../components/LeaderBoardInstructions';
import { LeaderboardRow } from '../components/LeaderBoardRow';
import { DetailNav } from '../../chapters/components/DetailNav';
import { api, type LeaderboardEntry } from '../../../../utils/api';
import { useAuth } from '../../../../context/AuthContext';

const LeaderboardPage: React.FC = () => {
  const { user } = useAuth();
  const [learners, setLearners] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.getLeaderboard()
      .then(data => setLearners(data))
      .catch(() => setError('Could not load leaderboard.'))
      .finally(() => setLoading(false));
  }, []);

  // Find the current user's rank in the leaderboard list
  const myRank = learners.findIndex(l => l._id === user?._id) + 1;

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-blue-500/30 pb-20">
      <DetailNav />
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-blue-600/10 blur-[120px] pointer-events-none" />

      <main className="max-w-4xl mx-auto px-8 pt-32 relative z-10">
        <LeaderboardHeader />

        {loading && (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {error && <p className="text-red-400 text-center py-10">{error}</p>}

        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Main ranked list */}
            <div className="md:col-span-2 space-y-3">
              {learners.map((learner, idx) => (
                <LeaderboardRow
                  key={learner._id}
                  rank={idx + 1}
                  name={learner.name}
                  passed={learner.assessmentsPassed}
                  stars={learner.stars}
                  isCurrentUser={learner._id === user?._id}
                />
              ))}
              {learners.length === 0 && (
                <p className="text-gray-500 text-center py-10">No learners yet. Be the first!</p>
              )}
            </div>

            {/* Sidebar */}
            <aside>
              <LeaderboardInstructions />
              <div className="p-8 rounded-3xl border border-white/5 bg-white/2 text-center mt-6">
                <p className="text-gray-500 text-xs font-bold uppercase mb-2">Your World Ranking</p>
                <p className="text-5xl font-black italic tracking-tighter mb-4">
                  {myRank > 0 ? `#${myRank}` : '—'}
                </p>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {myRank > 0 && myRank > 3
                    ? `Pass ${myRank - 3} more assessments to break into the Top 3!`
                    : myRank <= 3 && myRank > 0
                    ? "You're in the Top 3! 🎉 Keep it up!"
                    : 'Complete an assessment to get ranked.'}
                </p>
              </div>
            </aside>
          </div>
        )}
      </main>
    </div>
  );
};

export default LeaderboardPage;