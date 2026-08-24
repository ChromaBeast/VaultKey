import React from 'react';
import { RefreshCw, TriangleAlert } from 'lucide-react';

interface State {
  hasError: boolean;
  message: string | null;
}

export class ErrorBoundary extends React.Component<{ children: React.ReactNode }, State> {
  state: State = { hasError: false, message: null };

  static getDerivedStateFromError(error: unknown): State {
    return {
      hasError: true,
      message: error instanceof Error ? error.message : 'Unexpected application error',
    };
  }

  componentDidCatch(error: unknown) {
    console.error(error);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: '24px' }}>
        <div className="glass" style={{ maxWidth: '460px', padding: '36px 32px', textAlign: 'center' }}>
          <TriangleAlert size={34} color="#f59e0b" style={{ marginBottom: '14px' }} />
          <h1 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '8px' }}>
            Something went wrong
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '24px' }}>
            {this.state.message || 'The interface hit an unexpected error.'}
          </p>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
            <button className="btn btn-secondary" onClick={() => window.location.assign('/')}>
              Go home
            </button>
            <button className="btn btn-primary" onClick={() => window.location.reload()}>
              <RefreshCw size={15} /> Reload
            </button>
          </div>
        </div>
      </div>
    );
  }
}
