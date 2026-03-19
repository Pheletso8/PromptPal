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

  const COLORS = ['#ce38be', '#d7da6a', '#e5bf98', '#120410', '#ce38be80'];

  return (
    <div className="min-h-screen bg-brand-bg text-brand-text font-sans">
      <HomeNav />
      
      <main className="max-w-7xl mx-auto pt-32 px-6 pb-20">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div>
            <h1 className="text-4xl font-black tracking-tight mb-2 text-brand-text italic">Admin <span className="text-brand-primary">Dashboard</span></h1>
            <p className="text-brand-text/50 font-medium">Real-time platform pulse and student success metrics</p>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={() => navigate('/admin/courses')}
              className="px-6 py-3 bg-white hover:bg-brand-secondary/5 border border-brand-primary/10 rounded-xl transition-all flex items-center gap-2 font-bold text-brand-text shadow-sm"
            >
              <ListChecks className="w-5 h-5" />
              Manage Courses
            </button>
            <button 
              className="px-6 py-3 bg-brand-primary hover:opacity-90 text-white rounded-xl transition-all flex items-center gap-2 font-bold shadow-lg shadow-brand-primary/20"
            >
              <PlusCircle className="w-5 h-5" />
              New User
            </button>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            { label: 'Total Learners', value: stats.totalUsers, icon: Users, color: 'text-brand-primary', bg: 'bg-brand-primary/10' },
            { label: 'Active Today', value: stats.activeUsers, icon: Activity, color: 'text-green-500', bg: 'bg-green-500/10' },
            { label: 'Courses Live', value: stats.totalCourses, icon: BookOpen, color: 'text-brand-secondary', bg: 'bg-brand-secondary/10' },
            { label: 'Avg. Mastery', value: '78%', icon: Award, color: 'text-brand-accent', bg: 'bg-brand-accent/10' },
          ].map((stat, idx) => (
            <div key={idx} className="bg-white border border-brand-primary/10 p-6 rounded-2xl group hover:border-brand-primary/30 transition-all shadow-sm">
              <div className={`${stat.bg} ${stat.color} w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <p className="text-brand-text/50 text-sm font-black uppercase tracking-widest">{stat.label}</p>
              <h3 className="text-2xl font-black mt-1 text-brand-text">{stat.value}</h3>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Live Pulse Chart */}
          <div className="bg-white border border-brand-primary/10 p-8 rounded-3xl shadow-sm">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-black italic flex items-center gap-2 text-brand-text">
                <TrendingUp className="w-5 h-5 text-brand-primary" />
                Live Pulse (Activity)
              </h2>
              <span className="text-[10px] font-black px-3 py-1 bg-brand-primary/10 text-brand-primary rounded-full tracking-widest uppercase">LIVE</span>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stats.livePulse}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#00000008" vertical={false} />
                  <XAxis dataKey="name" stroke="#12041060" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="#12041060" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #ce38be20', borderRadius: '16px', boxShadow: '0 10px 30px -10px rgba(206,56,190,0.1)' }}
                    itemStyle={{ color: '#ce38be', fontWeight: 'bold' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#ce38be" 
                    strokeWidth={4} 
                    dot={{ fill: '#ce38be', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 8, strokeWidth: 0, fill: '#ce38be' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Course Success Metrics */}
          <div className="bg-white border border-brand-primary/10 p-8 rounded-3xl shadow-sm">
            <h2 className="text-xl font-black italic mb-8 flex items-center gap-2 text-brand-text">
              <Award className="w-5 h-5 text-brand-accent" />
              Passing vs. Progressing
            </h2>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.successMetrics}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#00000008" vertical={false} />
                  <XAxis dataKey="name" stroke="#12041060" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="#12041060" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip 
                    cursor={{ fill: '#ce38be05' }}
                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #ce38be20', borderRadius: '16px' }}
                  />
                  <Bar dataKey="passing" fill="#10b981" radius={[6, 6, 0, 0]} name="Passing" />
                  <Bar dataKey="progressing" fill="#ce38be" radius={[6, 6, 0, 0]} name="Progressing" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Enrollment Distribution */}
          <div className="bg-white border border-brand-primary/10 p-8 rounded-3xl shadow-sm lg:col-span-2">
            <h2 className="text-xl font-black italic mb-8 flex items-center gap-2 text-brand-text">
              <LayoutGrid className="w-5 h-5 text-brand-secondary" />
              Course Enrollment Distribution
            </h2>
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                  <CartesianGrid stroke="#00000005" />
                  <XAxis type="category" dataKey="name" name="Course" stroke="#12041060" fontSize={10} />
                  <YAxis type="number" dataKey="value" name="Students" stroke="#12041060" fontSize={10} hide />
                  <ZAxis type="number" dataKey="value" range={[1000, 5000]} name="Students" />
                  <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ backgroundColor: '#fff', border: '1px solid #ce38be20', borderRadius: '16px' }} />
                  <Scatter name="Courses" data={stats.courseDistribution} fill="#ce38be">
                    {stats.courseDistribution.map((_: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Mastery Matrix */}
        <div className="bg-white border border-brand-primary/10 rounded-3xl overflow-hidden shadow-sm">
          <div className="p-8 border-b border-brand-primary/5 flex justify-between items-center bg-brand-secondary/5">
            <h2 className="text-xl font-black italic text-brand-text">Student Mastery Matrix</h2>
            <button className="text-brand-primary hover:opacity-70 text-sm font-black italic uppercase tracking-widest flex items-center gap-1 group">
              View Detailed Report
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-brand-secondary/10 text-brand-text/50 text-[10px] uppercase font-black tracking-[0.2em]">
                <tr>
                  <th className="px-8 py-5">Student</th>
                  <th className="px-8 py-5">EMS</th>
                  <th className="px-8 py-5">Math</th>
                  <th className="px-8 py-5">Science</th>
                  <th className="px-8 py-5">Tech</th>
                  <th className="px-8 py-5">Overall</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-primary/5">
                {[1, 2, 3, 4, 5].map((i) => (
                  <tr key={i} className="hover:bg-brand-secondary/5 transition-colors">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-brand-primary/10 text-brand-primary flex items-center justify-center text-xs font-black">S{i}</div>
                        <span className="font-bold text-brand-text">Student User {i}</span>
                      </div>
                    </td>
                    {[0, 1, 2, 3].map((j) => (
                      <td key={j} className="px-8 py-5">
                        <div className={`w-3.5 h-3.5 rounded-full ${Math.random() > 0.3 ? 'bg-green-500 shadow-md shadow-green-500/20' : 'bg-brand-text/10'}`} />
                      </td>
                    ))}
                    <td className="px-8 py-5">
                      <span className="px-3 py-1 bg-green-500/10 text-green-600 text-[10px] font-black uppercase rounded-full tracking-widest">Passing</span>
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
