import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Users, BookOpen, Settings,
  LogOut
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';

interface AdminLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, title, subtitle }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  const navItemClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
      isActive 
        ? 'bg-brand-primary/10 text-brand-primary' 
        : 'text-brand-text/50 hover:bg-brand-secondary/5 hover:text-brand-text'
    }`;

  return (
    <div className="min-h-screen bg-brand-bg text-brand-text flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-brand-primary/10 flex flex-col fixed inset-y-0 z-20">
        <div className="p-6 border-b border-brand-primary/5">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold tracking-tight text-brand-text">
              Prompt<span className="text-brand-primary">Pal</span>
            </h1>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-8">
          {/* Core Operations */}
          <div>
            <p className="px-4 text-[10px] font-black uppercase tracking-widest text-brand-text/30 mb-3">Core Operations</p>
            <div className="space-y-1">
              <NavLink to="/admin" end className={navItemClass}>
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </NavLink>
              <NavLink to="/admin/courses" className={navItemClass}>
                <BookOpen className="w-4 h-4" />
                Manage Courses
              </NavLink>
            </div>
          </div>

          {/* Identity Control */}
          <div>
            <p className="px-4 text-[10px] font-black uppercase tracking-widest text-brand-text/30 mb-3">Identity Control</p>
            <div className="space-y-1">
              <NavLink to="/admin/users" className={navItemClass}>
                <Users className="w-4 h-4" />
                User Directory
              </NavLink>
            </div>
          </div>

          {/* System Settings */}
          <div>
            <p className="px-4 text-[10px] font-black uppercase tracking-widest text-brand-text/30 mb-3">System Settings</p>
            <div className="space-y-1">
              <NavLink to="/admin/config" className={navItemClass}>
                <Settings className="w-4 h-4" />
                Platform Config
              </NavLink>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-brand-primary/5">
          <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold w-full text-red-500/70 hover:bg-red-500/10 hover:text-red-500 transition-all">
            <LogOut className="w-4 h-4" />
            Log Out
          </button>
        </div>
      </aside>

      {/* Main Container */}
      <main className="flex-1 ml-64 flex flex-col min-h-screen">
        {/* Top Header */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-brand-primary/5 flex items-center justify-between px-8 sticky top-0 z-10">
          <div>
            {title && <h2 className="text-xl font-black italic text-brand-text">{title}</h2>}
            {subtitle && <p className="text-[10px] text-brand-text/50 font-black uppercase tracking-widest">{subtitle}</p>}
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3 pl-6">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-brand-text">{user?.name}</p>
                <p className="text-[10px] text-brand-primary font-black uppercase tracking-widest">{user?.role}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-brand-primary text-white flex items-center justify-center font-black">
                {user?.name?.charAt(0) || 'A'}
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-8 pb-20 max-w-7xl mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
