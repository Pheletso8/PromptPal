import { useState, useEffect } from 'react';
import { api } from '../../../utils/api';
import HomeNav from '../../User/home/components/HomeNav';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, Cell, ScatterChart, Scatter, ZAxis
} from 'recharts';
import { 
  Users, BookOpen, TrendingUp, Award, Activity, 
  ChevronRight, LayoutGrid, ListChecks, PlusCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AdminDashboardSkeleton from '../components/AdminDashboardSkeleton';

const AdminDashboard = () => {
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await api.getAdminStats();
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <>
        <HomeNav />
        <AdminDashboardSkeleton />
      </>
    );
  }

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <HomeNav />
      
      <main className="max-w-7xl mx-auto pt-32 px-6 pb-20">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h1 className="text-4xl font-black tracking-tight mb-2">Admin <span className="text-blue-500">Dashboard</span></h1>
            <p className="text-gray-400">Real-time platform pulse and student success metrics</p>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={() => navigate('/admin/courses')}
              className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all flex items-center gap-2 font-bold"
            >
              <ListChecks className="w-5 h-5" />
              Manage Courses
            </button>
            <button 
              className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-all flex items-center gap-2 font-bold shadow-lg shadow-blue-600/20"
            >
              <PlusCircle className="w-5 h-5" />
              New User
            </button>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            { label: 'Total Learners', value: stats.totalUsers, icon: Users, color: 'text-blue-400', bg: 'bg-blue-400/10' },
            { label: 'Active Today', value: stats.activeUsers, icon: Activity, color: 'text-green-400', bg: 'bg-green-400/10' },
            { label: 'Courses Live', value: stats.totalCourses, icon: BookOpen, color: 'text-purple-400', bg: 'bg-purple-400/10' },
            { label: 'Avg. Mastery', value: '78%', icon: Award, color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
          ].map((stat, idx) => (
            <div key={idx} className="bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-sm group hover:border-blue-500/30 transition-all">
              <div className={`${stat.bg} ${stat.color} w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <p className="text-gray-400 text-sm font-medium">{stat.label}</p>
              <h3 className="text-2xl font-black mt-1">{stat.value}</h3>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Live Pulse Chart */}
          <div className="bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-sm shadow-xl">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-500" />
                Live Pulse (Activity)
              </h2>
              <span className="text-xs font-bold px-2 py-1 bg-blue-500/10 text-blue-400 rounded-lg">LIVE</span>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stats.livePulse}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                  <XAxis dataKey="name" stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '12px' }}
                    itemStyle={{ color: '#3b82f6' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#3b82f6" 
                    strokeWidth={4} 
                    dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 8, strokeWidth: 0 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Course Success Metrics */}
          <div className="bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-sm shadow-xl">
            <h2 className="text-xl font-bold mb-8 flex items-center gap-2">
              <Award className="w-5 h-5 text-yellow-500" />
              Passing vs. Progressing
            </h2>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.successMetrics}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                  <XAxis dataKey="name" stroke="#666" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    cursor={{ fill: '#ffffff05' }}
                    contentStyle={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '12px' }}
                  />
                  <Bar dataKey="passing" fill="#10b981" radius={[4, 4, 0, 0]} name="Passing" />
                  <Bar dataKey="progressing" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Progressing" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Enrollment Distribution (Bubble Chart Mock) */}
          <div className="bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-sm shadow-xl lg:col-span-2">
            <h2 className="text-xl font-bold mb-8 flex items-center gap-2">
              <LayoutGrid className="w-5 h-5 text-purple-500" />
              Course Enrollment Distribution
            </h2>
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                  <CartesianGrid stroke="#ffffff05" />
                  <XAxis type="category" dataKey="name" name="Course" stroke="#666" fontSize={12} />
                  <YAxis type="number" dataKey="value" name="Students" stroke="#666" fontSize={12} hide />
                  <ZAxis type="number" dataKey="value" range={[1000, 5000]} name="Students" />
                  <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '12px' }} />
                  <Scatter name="Courses" data={stats.courseDistribution} fill="#8884d8">
                    {stats.courseDistribution.map((_: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Mastery Matrix (Simplified Table) */}
        <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-sm">
          <div className="p-8 border-b border-white/10 flex justify-between items-center">
            <h2 className="text-xl font-bold">Student Mastery Matrix</h2>
            <button className="text-blue-500 hover:text-blue-400 text-sm font-bold flex items-center gap-1 group">
              View Detailed Report
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-white/5 text-gray-400 text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-8 py-4 px-8 font-bold">Student</th>
                  <th className="px-8 py-4 font-bold">EMS</th>
                  <th className="px-8 py-4 font-bold">Math</th>
                  <th className="px-8 py-4 font-bold">Science</th>
                  <th className="px-8 py-4 font-bold">Tech</th>
                  <th className="px-8 py-4 font-bold">Overall</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {[1, 2, 3, 4, 5].map((i) => (
                  <tr key={i} className="hover:bg-white/5 transition-colors">
                    <td className="px-8 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs font-bold">S{i}</div>
                        <span className="font-medium">Student User {i}</span>
                      </div>
                    </td>
                    {[0, 1, 2, 3].map((j) => (
                      <td key={j} className="px-8 py-4">
                        <div className={`w-3 h-3 rounded-full ${Math.random() > 0.3 ? 'bg-green-500 shadow-lg shadow-green-500/50' : 'bg-gray-700'}`} />
                      </td>
                    ))}
                    <td className="px-8 py-4">
                      <span className="px-2 py-1 bg-green-500/10 text-green-400 text-xs font-bold rounded-lg">Passing</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
