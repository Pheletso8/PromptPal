import logo from '../../../../assets/promptpal.png';
import { Link } from 'react-router-dom';

export const ChatHeader = () => (
  <nav className="fixed top-0 w-full z-50 backdrop-blur-xl border-b border-brand-primary/10 bg-white/80 px-8 py-4 shadow-sm">
    <div className="max-w-7xl mx-auto flex justify-between items-center">
      
      {/* Brand Section */}
      <Link to="/home" className="flex items-center space-x-3 group">
        <img src={logo} alt="logo" className="w-8 h-8 rounded-lg group-hover:scale-110 transition-transform shadow-sm" />
        <span className="font-black tracking-tighter text-xl italic text-brand-text uppercase">
          AI <span className="text-brand-primary">LAB</span>
        </span>
      </Link>
      
      {/* Actions Section */}
      <div className="flex items-center gap-6">
        {/* Exit Button */}
        <Link 
          to="/home" 
          className="text-[10px] font-black text-brand-text/40 hover:text-brand-primary uppercase tracking-[0.2em] transition-all border border-brand-primary/10 px-5 py-2.5 rounded-full hover:bg-brand-primary/5 bg-white shadow-sm"
        >
          Exit Lab
        </Link>
      </div>
    </div>
  </nav>
);
