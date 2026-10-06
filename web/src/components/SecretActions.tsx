import React, { useEffect, useRef, useState } from 'react';
import { Eye, History, Pencil, Trash2, MoreHorizontal } from 'lucide-react';
import type { SecretItem } from '../lib/api';

interface Props {
  item: SecretItem;
  pending: boolean;
  onReveal: (key: string) => void;
  onHistory: (item: SecretItem) => void;
  onEdit: (item: SecretItem) => void;
  onDelete: (item: SecretItem) => void;
}

export const SecretActions: React.FC<Props> = ({ item, pending, onReveal, onHistory, onEdit, onDelete }) => {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open) return;
    const dismiss = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { setOpen(false); trigger.current?.focus(); }
    };
    document.addEventListener('pointerdown', dismiss);
    document.addEventListener('keydown', escape);
    return () => {
      document.removeEventListener('pointerdown', dismiss);
      document.removeEventListener('keydown', escape);
    };
  }, [open]);
  const act = (callback: (secret: SecretItem) => void) => {
    setOpen(false);
    trigger.current?.focus();
    callback(item);
  };
  return <div ref={root} className="secret-actions">
    <button type="button" className="btn btn-secondary" disabled={pending} onClick={() => onReveal(item.key)} aria-label={`Reveal ${item.key}`}>
      <Eye size={15} /> {pending ? 'Loading…' : 'Reveal'}
    </button>
    <button ref={trigger} type="button" className="btn btn-secondary" aria-label={`More actions for ${item.key}`} aria-expanded={open} onClick={() => setOpen(!open)}><MoreHorizontal size={18} /></button>
    {open && <div className="secret-action-panel" aria-label={`Actions for ${item.key}`}>
      <button type="button" onClick={() => act(onHistory)}><History size={15} /> Version history</button>
      <button type="button" onClick={() => act(onEdit)}><Pencil size={15} /> Edit secret</button>
      <button type="button" className="text-[var(--vk-danger)]" onClick={() => act(onDelete)}><Trash2 size={15} /> Delete secret</button>
    </div>}
  </div>;
};
