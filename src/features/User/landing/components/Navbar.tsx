export const Navbar = () => (
  <nav className="fixed top-0 w-full z-50 backdrop-blur-md border-b border-white/5">
    <div className="flex items-center justify-end px-8 py-4 max-w-7xl mx-auto space-x-6">
      <button className="text-sm font-medium text-gray-400 hover:text-white transition">Login</button>
      <button className="bg-white text-black px-5 py-2 rounded-full text-sm font-bold hover:scale-105 active:scale-95 transition-all">
        Sign Up
      </button>
    </div>
  </nav>
);
