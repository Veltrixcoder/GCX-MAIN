import React, { useEffect } from 'react';
import logoImg from '../assets/logo.png';

// Mock TanStack Link for single-page scrolling support
const Link = ({ to, children, className, ...props }) => {
  const href = to === '/' ? '#' : to;
  return (
    <a href={href} className={className} {...props}>
      {children}
    </a>
  );
};

export function Navbar() {
  useEffect(() => {
    const root = document.documentElement;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: light)');
    
    const applyTheme = () => {
      if (mediaQuery.matches) {
        root.classList.add('light');
      } else {
        root.classList.remove('light');
      }
    };

    applyTheme();
    mediaQuery.addEventListener('change', applyTheme);
    return () => mediaQuery.removeEventListener('change', applyTheme);
  }, []);

  return (
    <header className="fixed top-0 inset-x-0 z-50">
      <div className="mx-auto mt-4 max-w-6xl px-4">
        <nav className="liquid-glass flex items-center justify-between rounded-full px-6 py-2.5">
          <Link to="/" className="flex items-center gap-2">
            <img src={logoImg} alt="GCX Logo" className="h-8 w-auto object-contain" />
            <span className="text-lg font-bold tracking-wide font-display">GCX</span>
          </Link>
          <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
            <a href="#brands" className="hover:text-foreground transition">Cards</a>
            <a href="#how" className="hover:text-foreground transition">How it works</a>
            <a href="#payouts" className="hover:text-foreground transition">Payouts</a>
            <a href="#testimonials" className="hover:text-foreground transition">Reviews</a>
            <a href="#faq" className="hover:text-foreground transition">FAQ</a>
          </div>
          <a
            href="#start"
            className="rounded-full bg-[image:var(--gradient-brand)] animate-gradient px-5 py-2 text-sm font-semibold text-background hover:opacity-90 transition"
          >
            Sell card
          </a>
        </nav>
      </div>
    </header>
  );
}
export default Navbar;
