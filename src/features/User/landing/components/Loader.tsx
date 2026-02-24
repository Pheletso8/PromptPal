import logo from '../../../../assets/promptpal.png';

export const Loader = () => (
  <div className="min-h-screen bg-black flex items-center justify-center">
    <div className="relative flex items-center justify-center">
      <div className="w-24 h-24 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
      <img src={logo} alt="Loading..." className="absolute w-12 h-12 rounded-lg animate-pulse" />
    </div>
  </div>
);
