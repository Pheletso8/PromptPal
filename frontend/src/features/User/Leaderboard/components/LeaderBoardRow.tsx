interface LearnerProps {
  rank: number;
  name: string;
  passed: number;
  stars: number;
  isCurrentUser?: boolean;
}

export const LeaderboardRow = ({ rank, name, passed, stars, isCurrentUser }: LearnerProps) => (
  <div className={`flex items-center justify-between p-5 rounded-2xl border transition-all ${
    isCurrentUser ? 'bg-blue-600/20 border-blue-500/40 shadow-[0_0_20px_rgba(37,99,235,0.1)]' : 'bg-white/2 border-white/5 hover:bg-white/5'
  }`}>
    <div className="flex items-center gap-6">
      <span className={`w-8 font-black italic text-xl ${
        rank === 1 ? 'text-yellow-500' : rank === 2 ? 'text-gray-400' : rank === 3 ? 'text-orange-400' : 'text-gray-600'
      }`}>
        #{rank}
      </span>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-linear-to-tr from-gray-700 to-gray-900 border border-white/10" />
        <span className={`font-bold ${isCurrentUser ? 'text-white' : 'text-gray-300'}`}>
          {name} {isCurrentUser && <span className="text-[10px] bg-blue-500 px-2 py-0.5 rounded ml-2 uppercase">You</span>}
        </span>
      </div>
    </div>

    <div className="flex items-center gap-8 md:gap-16">
      <div className="text-center">
        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Passed</p>
        <p className="text-lg font-black">{passed}</p>
      </div>
      <div className="text-center min-w-15">
        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Stars</p>
        <p className="text-lg font-black text-yellow-500">⭐ {stars}</p>
      </div>
    </div>
  </div>
);