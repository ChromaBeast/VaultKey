import { useEffect, useState } from 'react';
import { apiFetch } from '../lib/api';

interface TurnstileConfig {
  turnstile_required: boolean;
  turnstile_site_key: string;
}

export const useTurnstileConfig = () => {
  const [config, setConfig] = useState<TurnstileConfig | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    apiFetch<TurnstileConfig>('/v1/auth/config')
      .then((value) => { if (active) setConfig(value); })
      .catch(() => { if (active) setError('Could not load the sign-in security check. Please reload this page.'); });
    return () => { active = false; };
  }, []);

  return {
    siteKey: config?.turnstile_site_key ?? '',
    required: config?.turnstile_required ?? true,
    loading: config === null && !error,
    error,
  };
};
