import React, { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';

interface TurnstileAPI {
  render: (container: HTMLElement, options: {
    sitekey: string;
    theme: 'dark';
    callback: (token: string) => void;
    'expired-callback': () => void;
    'error-callback': () => void;
  }) => string;
  reset: (widgetId?: string) => void;
  remove: (widgetId: string) => void;
}

declare global {
  interface Window {
    turnstile?: TurnstileAPI;
  }
}

export interface TurnstileWidgetHandle {
  reset: () => void;
}

interface TurnstileWidgetProps {
  siteKey: string;
  onToken: (token: string) => void;
  onError: () => void;
}

let scriptPromise: Promise<TurnstileAPI> | null = null;

const loadTurnstile = (): Promise<TurnstileAPI> => {
  if (window.turnstile) return Promise.resolve(window.turnstile);
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise<TurnstileAPI>((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
    script.async = true;
    script.defer = true;
    script.dataset.vaultkeyTurnstile = 'true';
    script.onload = () => window.turnstile ? resolve(window.turnstile) : reject(new Error('Turnstile did not initialize'));
    script.onerror = () => reject(new Error('Turnstile failed to load'));
    document.head.appendChild(script);
  }).catch((error: unknown) => {
    scriptPromise = null;
    throw error;
  });

  return scriptPromise;
};

export const TurnstileWidget = forwardRef<TurnstileWidgetHandle, TurnstileWidgetProps>(
  ({ siteKey, onToken, onError }, forwardedRef) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const widgetIdRef = useRef<string | null>(null);

    useImperativeHandle(forwardedRef, () => ({
      reset: () => {
        if (widgetIdRef.current) window.turnstile?.reset(widgetIdRef.current);
        onToken('');
      },
    }), [onToken]);

    useEffect(() => {
      let cancelled = false;
      void loadTurnstile().then((turnstile) => {
        if (cancelled || !containerRef.current) return;
        widgetIdRef.current = turnstile.render(containerRef.current, {
          sitekey: siteKey,
          theme: 'dark',
          callback: onToken,
          'expired-callback': () => onToken(''),
          'error-callback': onError,
        });
      }).catch(() => {
        if (!cancelled) onError();
      });

      return () => {
        cancelled = true;
        if (widgetIdRef.current) window.turnstile?.remove(widgetIdRef.current);
        widgetIdRef.current = null;
      };
    }, [siteKey, onError, onToken]);

    return <div ref={containerRef} role="group" aria-label="Security verification" />;
  }
);

TurnstileWidget.displayName = 'TurnstileWidget';
