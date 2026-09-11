import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, FileQuestion } from 'lucide-react';

export const NotFoundPage: React.FC = () => (
  <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: '24px' }}>
    <div className="glass" style={{ maxWidth: '440px', padding: '40px 36px', textAlign: 'center' }}>
      <FileQuestion size={36} color="var(--vk-accent)" style={{ marginBottom: '16px' }} />
      <div className="code-font" style={{ fontSize: '0.8rem', color: 'var(--vk-accent)', marginBottom: '6px' }}>
        HTTP 404
      </div>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '8px' }}>
        Page not found
      </h1>
      <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '28px' }}>
        The page you are looking for does not exist or has been moved.
      </p>
      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
        <Link to="/" className="btn btn-secondary">
          <ArrowLeft size={15} /> Back to home
        </Link>
        <Link to="/docs" className="btn btn-primary">
          Browse docs
        </Link>
      </div>
    </div>
  </div>
);
