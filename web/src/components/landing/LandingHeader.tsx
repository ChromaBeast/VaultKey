import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { KeyRound } from 'lucide-react';

export const LandingHeader: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full h-16 transition-all duration-200 ${
        scrolled
          ? 'bg-background/85 backdrop-blur-md border-b border-border shadow-md shadow-black/20'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-[var(--container-max)] h-full mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/25 flex items-center justify-center text-primary group-hover:scale-105 transition-transform">
            <KeyRound size={16} />
          </div>
          <span className="brand-text text-lg font-extrabold tracking-tight text-foreground">
            VaultKey
          </span>
        </Link>

        {/* Center Nav */}
        <nav className="hidden md:flex items-center gap-7">
          <a
            href="#workflow"
            className="text-xs uppercase font-mono font-medium text-muted-foreground hover:text-foreground tracking-wider transition-colors"
          >
            Workflows
          </a>
          <a
            href="#comparison"
            className="text-xs uppercase font-mono font-medium text-muted-foreground hover:text-foreground tracking-wider transition-colors"
          >
            Comparison
          </a>
          <a
            href="#pricing"
            className="text-xs uppercase font-mono font-medium text-muted-foreground hover:text-foreground tracking-wider transition-colors"
          >
            Pricing
          </a>
          <Link
            to="/docs"
            className="text-xs uppercase font-mono font-medium text-muted-foreground hover:text-foreground tracking-wider transition-colors"
          >
            Docs
          </Link>
        </nav>

        {/* Right Auth */}
        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="text-xs font-semibold text-muted-foreground hover:text-foreground px-3 py-2 transition-colors"
          >
            Sign in
          </Link>
          <Link
            to="/signup"
            className="btn btn-primary text-xs font-semibold px-4 py-2"
          >
            Get Started
          </Link>
        </div>
      </div>
    </header>
  );
};
