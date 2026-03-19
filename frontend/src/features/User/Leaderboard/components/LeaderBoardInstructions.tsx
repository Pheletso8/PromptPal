export const LeaderboardInstructions = () => (
  <div className="bg-brand-primary/5 border border-brand-primary/10 p-6 rounded-3xl mb-12 flex items-start gap-4 shadow-sm">
    <div className="text-2xl">💡</div>
    <div>
      <h4 className="font-bold text-brand-primary text-sm uppercase tracking-widest mb-2">How it works</h4>
      <ul className="text-xs text-brand-text/60 space-y-2 leading-relaxed">
        <li>• <strong className="text-brand-text font-bold">Rank:</strong> Based on the total number of assessments you have passed.</li>
        <li>• <strong className="text-brand-text font-bold">Stars (⭐):</strong> Earned only when you score <span className="text-brand-primary font-bold">100%</span> on a Knowledge Check.</li>
        <li>• <strong className="text-brand-text font-bold">Tie-breaker:</strong> If points are equal, the learner with more Stars takes the lead!</li>
      </ul>
    </div>
  </div>
);