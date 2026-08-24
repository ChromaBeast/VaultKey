import { useCallback, useEffect, useRef, useState } from 'react';
import { pushToast } from '../lib/toast';

const legacyCopy = (text: string): boolean => {
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.setAttribute('readonly', '');
  ta.style.position = 'fixed';
  ta.style.opacity = '0';
  document.body.appendChild(ta);
  ta.select();
  try {
    return document.execCommand('copy');
  } finally {
    document.body.removeChild(ta);
  }
};

export const copyText = async (text: string): Promise<boolean> => {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // fall through to legacy path
  }
  try {
    return legacyCopy(text);
  } catch {
    return false;
  }
};

export const useClipboard = () => {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    },
    []
  );

  const copy = useCallback(async (text: string): Promise<boolean> => {
    const ok = await copyText(text);
    if (!ok) {
      pushToast('Copy failed - select the value manually', 'error');
      return false;
    }
    setCopied(true);
    if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => setCopied(false), 2000);
    return true;
  }, []);

  return { copied, copy };
};
