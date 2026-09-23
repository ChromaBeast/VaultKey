const TOKEN_KEY = 'vk_token';

export const getSessionToken = (): string | null => {
  const current = sessionStorage.getItem(TOKEN_KEY);
  if (current) return current;

  const legacy = localStorage.getItem(TOKEN_KEY);
  if (!legacy) return null;
  sessionStorage.setItem(TOKEN_KEY, legacy);
  localStorage.removeItem(TOKEN_KEY);
  return legacy;
};

export const setSessionToken = (token: string): void => {
  sessionStorage.setItem(TOKEN_KEY, token);
  localStorage.removeItem(TOKEN_KEY);
};

export const clearSessionToken = (): void => {
  sessionStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(TOKEN_KEY);
};
