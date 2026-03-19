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
    <nav className="fixed top-0 w-full z-50 backdrop-blur-xl border-b border-brand-primary/10 bg-brand-bg/80 px-8 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/home" className="flex items-center space-x-3">
          <img src={logo} alt="logo" className="w-8 h-8 rounded-lg shadow-lg shadow-brand-primary/10" />
          <span className="font-black tracking-tighter text-xl text-brand-text">
            Prompt<span className="text-brand-primary">Pal</span>
          </span>
        </Link>

        <div className="flex items-center space-x-4">
          {/* Live user stats */}
          {user && (
            <div className="hidden md:flex items-center gap-4 text-xs">
              <span className="text-brand-accent brightness-75 font-bold">⭐ {user.stars} stars</span>
              <span className="text-brand-primary font-bold">✅ {user.assessmentsPassed} passed</span>
            </div>
          )}
          
          {user?.role === 'admin' && (
            <Link 
              to="/admin" 
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg border transition-all ${
                location.pathname.startsWith('/admin') 
                  ? 'bg-brand-primary/10 border-brand-primary/50 text-brand-text' 
                  : 'border-brand-primary/10 text-brand-text/60 hover:border-brand-primary/30 hover:bg-brand-primary/5'
              }`}
            >
              <Shield className="w-4 h-4 text-brand-primary" />
              <span className="hidden sm:inline text-sm font-medium">Admin</span>
            </Link>
          )}

          <Link 
            to="/profile" 
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg border transition-all ${
              location.pathname === '/profile' 
                ? 'bg-brand-primary/10 border-brand-primary/50 text-brand-text' 
                : 'border-brand-primary/10 text-brand-text/60 hover:border-brand-primary/30 hover:bg-brand-primary/5'
            }`}
          >
            <div className="w-6 h-6 rounded-full overflow-hidden border border-brand-primary/20 bg-brand-secondary/20 flex items-center justify-center">
              {user?.profileImage ? (
                <img src={user.profileImage} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <User className="w-4 h-4 text-brand-text/60" />
              )}
            </div>
            <span className="hidden sm:inline text-sm font-medium">{user?.name?.split(' ')[0]}</span>
          </Link>

          <button
            onClick={handleLogout}
            className="text-gray-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-red-500/10 hover:text-red-400 border border-transparent hover:border-red-500/20"
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default HomeNav;