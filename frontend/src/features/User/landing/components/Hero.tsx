import logo from '../../../../assets/promptpal.png';
import { Link } from 'react-router-dom';
import { MoveUpRight } from 'lucide-react';

export const Hero = () => (
  <header className="relative flex flex-col items-center text-center pt-32 pb-20 px-4 min-h-[90vh] justify-center">
    <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-125 h-125 bg-blue-600/20 rounded-full blur-[120px] -z-10" />
    <div className="flex items-center space-x-3 mb-8">
      <img src={logo} alt="logo" className="w-12 h-12 rounded-xl shadow-lg shadow-blue-500/20" />
      <div className="text-2xl font-black tracking-tighter">
        <span className="text-blue-500">Prompt</span>
        <span className="text-white">Pal</span>
      </div>
    </div>
    <h1 className="text-6xl md:text-8xl font-extrabold tracking-tight mb-8 bg-clip-text text-transparent bg-linear-to-b from-white to-white/50">
      Modern Learning <br /> 
      <span className="text-blue-500">GenAI</span> Reimagined
    </h1>
    <p className="max-w-2xl mx-auto text-gray-400 text-lg md:text-xl leading-relaxed mb-12 font-light">
      Designed to help you learn faster and with deeper understanding. 
      Master <span className="text-white font-medium">Prompt Engineering</span> and 
      turn AI into your ultimate advantage.
    </p>
    <div className="flex flex-col items-center space-y-6">
      <Link to="/home" className="bg-blue-600 text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-blue-500 hover:shadow-[0_0_20px_rgba(37,99,235,0.4)] transition-all">
        Start Learning Now <MoveUpRight className="inline-block ml-2" />
      </Link>
      <div className="inline-flex items-center px-4 py-2 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-sm font-medium backdrop-blur-sm">
        <span className="mr-2">🇿🇦</span> Grade 7 Learners: Use This Opportunity!
      </div>
    </div>
  </header>
);
