export const LeaderboardInstructions = () => (
  <div className="bg-blue-600/10 border border-blue-500/20 p-6 rounded-3xl mb-12 flex items-start gap-4">
    <div className="text-2xl">💡</div>
    <div>
      <h4 className="font-bold text-blue-400 text-sm uppercase tracking-widest mb-2">How it works</h4>
      <ul className="text-xs text-gray-400 space-y-2 leading-relaxed">
        <li>• <strong className="text-white">Rank:</strong> Based on the total number of assessments you have passed.</li>
        <li>• <strong className="text-white">Stars (⭐):</strong> Earned only when you score <span className="text-blue-400">100%</span> on a Knowledge Check.</li>
        <li>• <strong className="text-white">Tie-breaker:</strong> If points are equal, the learner with more Stars takes the lead!</li>
      </ul>
    </div>
  </div>
);