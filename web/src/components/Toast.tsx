import React, { useEffect, useState } from 'react';
import { CircleCheck, Info, TriangleAlert, X } from 'lucide-react';
import type { ToastItem, ToastType } from '../lib/toast';
import { IconTile, type Tone } from './ui/IconTile';
import { TOAST_EVENT } from '../lib/toast';

const TONES: Record<ToastType, Tone> = { error: 'red', success: 'green', info: 'blue' };

const ICONS: Record<ToastType, React.ReactNode> = {
  error: <TriangleAlert size={16} />,
  success: <CircleCheck size={16} />,
  info: <Info size={16} />,
};

const ToastCard: React.FC<{ item: ToastItem; onDismiss: (id: number) => void }> = ({
  item,
  onDismiss,
}) => {
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const timer = window.setTimeout(() => onDismiss(item.id), 4200);
    return () => window.clearTimeout(timer);
  }, [paused, item.id, onDismiss]);

  return (
    <div
      className={`toast-card toast-${item.type} tone-${TONES[item.type]}`}
      role="status"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <IconTile tone={TONES[item.type]} size="sm" className="toast-icon">{ICONS[item.type]}</IconTile>
      <span className="toast-message">{item.message}</span>
      <button className="toast-close" onClick={() => onDismiss(item.id)} aria-label="Dismiss notification">
        <X size={14} />
      </button>
    </div>
  );
};

export const ToastHost: React.FC = () => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    const handle = (e: Event) => {
      const detail = (e as CustomEvent<ToastItem>).detail;
      setToasts((prev) => [...prev.slice(-3), detail]);
    };
    window.addEventListener(TOAST_EVENT, handle);
    return () => window.removeEventListener(TOAST_EVENT, handle);
  }, []);

  const dismiss = (id: number) => setToasts((prev) => prev.filter((t) => t.id !== id));

  return (
    <div className="toast-stack" aria-live="assertive" aria-atomic="false">
      {toasts.map((t) => (
        <ToastCard key={t.id} item={t} onDismiss={dismiss} />
      ))}
    </div>
  );
};
