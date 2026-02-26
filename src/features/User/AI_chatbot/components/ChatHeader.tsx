import logo from '../../../../assets/promptpal.png';
import { Link } from 'react-router-dom';

export const ChatHeader = () => (
  <nav className="fixed top-0 w-full z-50 backdrop-blur-xl border-b border-white/5 bg-black/40 px-8 py-4">
    <div className="max-w-7xl mx-auto flex justify-between items-center">
      <Link to="/home" className="flex items-center space-x-3">
        <img src={logo} alt="logo" className="w-8 h-8 rounded-lg" />
        <span className="font-black tracking-tighter text-xl italic">AI <span className="text-blue-500">LAB</span></span>
      </Link>
      <Link to="/home" className="text-xs font-bold text-gray-500 hover:text-white uppercase tracking-widest transition-all">
        Exit Lab
      </Link>
    </div>
  </nav>
);