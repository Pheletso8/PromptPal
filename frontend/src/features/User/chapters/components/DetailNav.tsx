import logo from '../../../../assets/promptpal.png';
import { useNavigate, Link } from 'react-router-dom';

export const DetailNav = () => {
  const navigate = useNavigate();
  return (
    <nav className="fixed top-0 w-full z-50 backdrop-blur-xl border-b border-brand-primary/10 bg-white/80 px-8 py-4 shadow-sm">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/home" className="flex items-center space-x-3 group">
          <img src={logo} alt="logo" className="w-8 h-8 rounded-lg group-hover:scale-110 transition-transform shadow-sm" />
          <span className="font-black tracking-tighter text-xl italic text-brand-text uppercase">Prompt<span className="text-brand-primary">Pal</span></span>
        </Link>
        <button 
          onClick={() => navigate('/home')}
          className="text-[10px] font-black italic uppercase tracking-widest text-brand-text/40 hover:text-brand-primary transition-all cursor-pointer"
        >
          Back to Dashboard
        </button>
      </div>
    </nav>
  );
};