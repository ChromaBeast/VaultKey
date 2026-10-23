import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, FileQuestion } from 'lucide-react';

export const NotFoundPage: React.FC = () => (
  <div className="min-h-screen grid place-items-center p-6 bg-background text-foreground">
    <div className="glass max-w-md p-9 text-center rounded-xl border border-border">
      <FileQuestion size={36} className="text-primary mx-auto mb-4" />
      <div className="code-font text-xs text-primary mb-1.5 font-bold">
        HTTP 404
      </div>
      <h1 className="text-2xl font-extrabold tracking-tight mb-2">
        Page not found
      </h1>
      <p className="text-sm text-muted-foreground mb-7">
        The page you are looking for does not exist or has been moved.
      </p>
      <div className="flex gap-2.5 justify-center">
        <Link to="/" className="btn btn-secondary text-sm">
          <ArrowLeft size={15} /> Back to home
        </Link>
        <Link to="/docs" className="btn btn-primary text-sm">
          Browse docs
        </Link>
      </div>
    </div>
  </div>
);
