interface LearnerProps {
  rank: number;
  name: string;
  passed: number;
  stars: number;
  isCurrentUser?: boolean;
}

export const LeaderboardRow = ({ rank, name, passed, stars, isCurrentUser }: LearnerProps) => (
  <div className={`flex items-center justify-between p-5 rounded-2xl border transition-all ${
    isCurrentUser ? 'bg-brand-primary/10 border-brand-primary/40 shadow-sm shadow-brand-primary/10' : 'bg-white border-brand-primary/10 hover:bg-brand-secondary/5'
  }`}>
    <div className="flex items-center gap-6">
      <span className={`w-8 font-black italic text-xl ${
        rank === 1 ? 'text-brand-primary' : rank === 2 ? 'text-brand-text/50' : rank === 3 ? 'text-brand-secondary' : 'text-brand-text/30'
      }`}>
        #{rank}
      </span>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-linear-to-tr from-brand-secondary/30 to-brand-primary/10 border border-brand-primary/10" />
        <span className={`font-bold ${isCurrentUser ? 'text-brand-primary' : 'text-brand-text'}`}>
          {name} {isCurrentUser && <span className="text-[10px] bg-brand-primary text-white px-2 py-0.5 rounded ml-2 uppercase">You</span>}
        </span>
      </div>
    </div>

    <div className="flex items-center gap-8 md:gap-16">
      <div className="text-center">
        <p className="text-[10px] text-brand-text/40 font-bold uppercase tracking-widest text-center">Passed</p>
        <p className="text-lg font-black text-brand-text text-center">{passed}</p>
      </div>
      <div className="text-center min-w-15">
        <p className="text-[10px] text-brand-text/40 font-bold uppercase tracking-widest text-center">Stars</p>
        <p className="text-lg font-black text-brand-primary text-center">⭐ {stars}</p>
      </div>
    </div>
  </div>
);