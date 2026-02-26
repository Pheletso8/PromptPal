import logo from '../../../../assets/promptpal.png';
import { Link } from 'react-router-dom';

const HomeNav = () => (
  <nav className="fixed top-0 w-full z-50 backdrop-blur-xl border-b border-white/5 bg-black/40 px-8 py-4">
    <div className="max-w-7xl mx-auto flex justify-between items-center">
      <Link to="/home" className="flex items-center space-x-3">
        <img src={logo} alt="logo" className="w-8 h-8 rounded-lg shadow-lg shadow-blue-500/20" />
        <span className="font-black tracking-tighter text-xl">Prompt<span className="text-blue-500">Pal</span></span>
      </Link>
      <div className="flex items-center space-x-4">
         <div className="w-8 h-8 bg-linear-to-tr from-blue-600 to-purple-600 rounded-full border border-white/20" />
         <span className="text-sm font-medium text-gray-300">Grade 7 Learner</span>
      </div>
    </div>
  </nav>
);

export default HomeNav;