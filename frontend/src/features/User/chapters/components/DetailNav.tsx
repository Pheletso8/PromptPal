import logo from '../../../../assets/promptpal.png';
import { useNavigate, Link } from 'react-router-dom';

export const DetailNav = () => {
  const navigate = useNavigate();
  return (
    <nav className="fixed top-0 w-full z-50 backdrop-blur-xl border-b border-white/5 bg-black/40 px-8 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/home" className="flex items-center space-x-3">
          <img src={logo} alt="logo" className="w-8 h-8 rounded-lg" />
          <span className="font-black tracking-tighter text-xl">Prompt<span className="text-blue-500">Pal</span></span>
        </Link>
        <button 
          onClick={() => navigate('/home')}
          className="text-sm font-bold text-gray-400 hover:text-white transition cursor-pointer"
        >
          Back to Dashboard
        </button>
      </div>
    </nav>
  );
};