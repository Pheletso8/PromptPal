import { Link } from 'react-router-dom';

const StatsWidgets = () => (
  <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
    <div className="md:col-span-2 rounded-3xl border border-white/5 bg-white/2 p-8">
      <h3 className="text-xl font-bold mb-6">Weekly Goals</h3>
      <div className="space-y-4">
        <div className="flex items-center space-x-4 bg-white/5 p-4 rounded-2xl border border-white/5">
           <div className="w-10 h-10 flex items-center justify-center bg-green-500/20 text-green-400 rounded-xl">✓</div>
           <div>
             <p className="font-bold text-sm">Complete NS Practice Quiz</p>
             <p className="text-xs text-gray-500">Earned 50 XP</p>
           </div>
        </div>
        <div className="flex items-center space-x-4 bg-white/5 p-4 rounded-2xl border border-white/5 opacity-50">
           <div className="w-10 h-10 flex items-center justify-center border border-white/10 rounded-xl">2</div>
           <div>
             <p className="font-bold text-sm">Draft History Essay with AI</p>
             <p className="text-xs text-gray-500">Next milestone</p>
           </div>
        </div>
      </div>
    </div>
    
    <div className="rounded-3xl border border-blue-500/20 bg-linear-to-b from-blue-500/5 to-transparent p-8 text-center flex flex-col items-center justify-center">
       <div className="text-4xl mb-4">🔥</div>
       <h3 className="text-2xl font-bold">5 Day Streak!</h3>
       <p className="text-gray-500 text-sm mt-2">You're learning faster than 85% of other Grade 7s.</p>
       <Link to="/leaderboard" className="mt-6 w-full py-3 rounded-xl bg-blue-600 font-bold text-sm">View Leaderboard</Link>
    </div>
  </section>
);

export default StatsWidgets;
