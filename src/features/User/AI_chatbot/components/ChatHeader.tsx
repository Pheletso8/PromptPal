import logo from '../../../../assets/promptpal.png';
import { Link } from 'react-router-dom';

// Define the interface for the props
interface HeaderProps {
  isMuted: boolean;
  onToggleMute: () => void;
}

export const ChatHeader = ({ isMuted, onToggleMute }: HeaderProps) => (
  <nav className="fixed top-0 w-full z-50 backdrop-blur-xl border-b border-white/5 bg-black/40 px-8 py-4">
    <div className="max-w-7xl mx-auto flex justify-between items-center">
      
      {/* Brand Section */}
      <Link to="/home" className="flex items-center space-x-3 group">
        <img src={logo} alt="logo" className="w-8 h-8 rounded-lg group-hover:scale-110 transition-transform" />
        <span className="font-black tracking-tighter text-xl italic text-white">
          AI <span className="text-blue-500">LAB</span>
        </span>
      </Link>
      
      {/* Actions Section */}
      <div className="flex items-center gap-6">
        {/* Voice Toggle Button */}
        <button 
          onClick={onToggleMute}
          title={isMuted ? "Unmute Coach Pal" : "Mute Coach Pal"}
          className={`text-xl p-2 rounded-xl transition-all ${
            isMuted 
            ? "bg-red-500/10 text-red-500 border border-red-500/20" 
            : "bg-blue-500/10 text-blue-500 border border-blue-500/20"
          } hover:scale-105 active:scale-95`}
        >
          {isMuted ? "🔇" : "🔊"}
        </button>

        {/* Exit Button */}
        <Link 
          to="/home" 
          className="text-[10px] font-black text-gray-500 hover:text-white uppercase tracking-[0.2em] transition-all border border-white/5 px-4 py-2 rounded-full hover:bg-white/5"
        >
          Exit Lab
        </Link>
      </div>
    </div>
  </nav>
);
