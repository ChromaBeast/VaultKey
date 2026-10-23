import React from 'react';

interface PageLoaderProps {
  message?: string;
}

export const PageLoader: React.FC<PageLoaderProps> = ({ message }) => {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={message || 'Loading page'}
      className="fixed inset-0 z-50 flex min-h-screen w-full flex-col items-center justify-center bg-[#08090d] text-slate-200 select-none"
    >
      <div className="relative flex items-center justify-center">
        {/* Soft radial glow */}
        <div className="absolute -inset-3 rounded-full bg-sky-500/15 blur-lg animate-pulse" />

        {/* Smooth spinner ring */}
        <div className="h-14 w-14 rounded-full border-2 border-slate-800 border-t-sky-500 animate-spin" />

        {/* VaultKey Logo centered */}
        <img
          src="/vaultkey-logo.png"
          alt="VaultKey"
          className="absolute h-7 w-7 object-contain"
        />
      </div>

      {/* Centered status message with animated dots */}
      <div className="mt-5 flex items-center gap-1.5 text-xs font-mono text-slate-400 tracking-wider uppercase">
        <span>{message || 'Loading'}</span>
        <span className="inline-flex tracking-normal">
          <span className="animate-bounce" style={{ animationDelay: '0ms' }}>.</span>
          <span className="animate-bounce" style={{ animationDelay: '150ms' }}>.</span>
          <span className="animate-bounce" style={{ animationDelay: '300ms' }}>.</span>
        </span>
      </div>
    </div>
  );
};
