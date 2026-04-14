/**
 * HomeNav.tsx
 *
 * Top navigation bar for the dashboard.
 * Shows the logged-in user's name and a Logout button.
 */
import logo from '../../../../assets/promptpal.png';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../../context/AuthContext';
import { User, LogOut, Shield } from 'lucide-react';

const HomeNav = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  return (
    <nav className="fixed top-0 w-full z-50 backdrop-blur-2xl border-b border-brand-primary/5 bg-white/70 px-8 py-4 shadow-[0_4px_30px_rgb(0,0,0,0.02)]">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/home" className="flex items-center space-x-3">
          <img src={logo} alt="logo" className="w-8 h-8 rounded-lg shadow-lg shadow-brand-primary/10" />
          <span className="font-black tracking-tighter text-xl text-brand-text">
            Prompt<span className="text-brand-primary">Pal</span>
          </span>
        </Link>

        <div className="flex items-center space-x-4">
          {/* Live user stats */}
          {/* Live user stats */}
          {user && (
            <div className="hidden md:flex items-center gap-3 text-xs mr-2">
              <span className="bg-yellow-400/10 text-yellow-600 font-bold px-3.5 py-1.5 rounded-full flex items-center gap-1.5 border border-yellow-400/20 shadow-sm">
                <span>⭐</span> {user.stars}
              </span>
              <span className="bg-green-500/10 text-green-600 font-bold px-3.5 py-1.5 rounded-full flex items-center gap-1.5 border border-green-500/20 shadow-sm">
                <span>🏆</span> {user.assessmentsPassed}
              </span>
            </div>
          )}
          
          {user?.role === 'admin' && (
            <Link 
              to="/admin" 
              className={`flex items-center space-x-2 px-4 py-2 rounded-full border transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5 ${
                location.pathname.startsWith('/admin') 
                  ? 'bg-brand-primary text-white border-transparent' 
                  : 'bg-white border-gray-100 text-brand-text/70 hover:border-transparent hover:bg-brand-primary hover:text-white'
              }`}
            >
              <Shield className="w-4 h-4" />
              <span className="hidden sm:inline text-sm font-bold">Admin</span>
            </Link>
          )}

          <Link 
            to="/profile" 
            className={`flex items-center space-x-2 px-4 py-2 rounded-full border transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5 ${
              location.pathname === '/profile' 
                ? 'bg-brand-primary text-white border-transparent' 
                : 'bg-white border-gray-100 text-brand-text/70 hover:border-transparent hover:bg-brand-primary hover:text-white'
            }`}
          >
            <div className="w-6 h-6 rounded-full overflow-hidden border border-white/20 bg-brand-secondary/20 flex items-center justify-center">
              {user?.profileImage ? (
                <img src={user.profileImage} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <User className="w-4 h-4" />
              )}
            </div>
            <span className="hidden sm:inline text-sm font-bold">{user?.name?.split(' ')[0]}</span>
          </Link>

          <button
            onClick={handleLogout}
            className="text-gray-400 hover:text-white transition-colors p-2.5 rounded-full hover:bg-red-500 hover:shadow-md hover:-translate-y-0.5 border border-transparent hover:border-red-500/20 bg-white shadow-sm ml-1"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default HomeNav;