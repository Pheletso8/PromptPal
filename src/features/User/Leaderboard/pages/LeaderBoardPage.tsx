import { LeaderboardHeader } from '../components/LeaderBoardHeader';
import { LeaderboardInstructions } from '../components/LeaderBoardInstructions';
import { LeaderboardRow } from '../components/LeaderBoardRow';
import {DetailNav} from '../../chapters/components/DetailNav';

const MOCK_LEARNERS = [
  { rank: 1, name: "Thabo M.", passed: 12, stars: 10 },
  { rank: 2, name: "Sarah J.", passed: 11, stars: 11 },
  { rank: 3, name: "Zanele K.", passed: 11, stars: 8 },
  { rank: 4, name: "Liam N.", passed: 10, stars: 9, isCurrentUser: true },
  { rank: 5, name: "Pieter S.", passed: 9, stars: 5 },
  { rank: 6, name: "Amara O.", passed: 8, stars: 8 },
];

const LeaderboardPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-blue-500/30 pb-20">
      <DetailNav />
      {/* Background Glow */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-blue-600/10 blur-[120px] pointer-events-none" />

      <main className="max-w-4xl mx-auto px-8 pt-32 relative z-10">
        <LeaderboardHeader />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Main List */}
          <div className="md:col-span-2 space-y-3">
            {MOCK_LEARNERS.map((learner) => (
              <LeaderboardRow key={learner.rank} {...learner} />
            ))}
          </div>

          {/* Sidebar Info */}
          <aside>
            <LeaderboardInstructions />
            
            <div className="p-8 rounded-3xl border border-white/5 bg-white/2 text-center">
              <p className="text-gray-500 text-xs font-bold uppercase mb-2">Your World Ranking</p>
              <p className="text-5xl font-black italic tracking-tighter mb-4">#4</p>
              <p className="text-gray-400 text-sm leading-relaxed">
                Pass 2 more assessments to break into the Top 3!
              </p>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default LeaderboardPage;