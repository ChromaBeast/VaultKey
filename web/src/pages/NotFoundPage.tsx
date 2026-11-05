import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export const NotFoundPage: React.FC = () => (
  <div className="notfound-v2 vk-glow bg-background text-foreground">
    <div className="glass notfound-card">
      <img src="/vaultkey-logo.png" alt="" width={56} height={56} />
      <div className="vk-eyebrow" style={{ color: 'var(--cyan)' }}>HTTP 404</div>
      <div className="notfound-code" aria-hidden="true">404</div>
      <h1 className="text-[1.75rem] font-extrabold tracking-tight">Page not found</h1>
      <p className="max-w-[24rem] text-[15px] leading-relaxed text-muted-foreground">
        The page you are looking for does not exist or has been moved.
      </p>
      <div className="mt-2 flex flex-wrap justify-center gap-2.5">
        <Link to="/" className="btn btn-secondary btn-lg"><ArrowLeft size={16} /> Back to home</Link>
        <Link to="/docs" className="btn btn-primary btn-lg">Browse docs</Link>
      </div>
    </div>
  </div>
);
