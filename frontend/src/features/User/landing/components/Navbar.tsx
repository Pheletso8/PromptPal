/**
 * Navbar.tsx — Landing page navigation
 *
 * The Login / Sign Up buttons now link to the /auth page.
 */
import { Link } from 'react-router-dom';

export const Navbar = () => (
  <nav className="fixed top-0 w-full z-50 backdrop-blur-md border-b border-brand-primary/10">
    <div className="flex items-center justify-end px-8 py-4 max-w-7xl mx-auto space-x-6">
      <Link
        to="/auth"
        className="text-sm font-medium text-brand-text/60 hover:text-brand-primary transition"
      >
        Login
      </Link>
      <Link
        to="/auth"
        className="bg-brand-primary text-white px-5 py-2 rounded-full text-sm font-bold hover:opacity-90 active:scale-95 transition-all shadow-md"
      >
        Sign Up
      </Link>
    </div>
  </nav>
);
