import React, { useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Eye, History, Pencil, Trash2, MoreHorizontal } from 'lucide-react';
import type { SecretItem } from '../lib/api';

interface Props {
  item: SecretItem;
  pending: boolean;
  canWrite: boolean;
  onReveal: (key: string) => void;
  onHistory: (item: SecretItem) => void;
  onEdit: (item: SecretItem) => void;
  onDelete: (item: SecretItem) => void;
}
export const SecretActions: React.FC<Props> = ({ item, pending, canWrite, onReveal, onHistory, onEdit, onDelete }) => {
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const id = useId();
  const open = position !== null;
  const show = () => {
    const rect = trigger.current?.getBoundingClientRect();
    if (!rect) return;
    const height = canWrite ? 148 : 56;
    setPosition({ top: rect.bottom + height < window.innerHeight ? rect.bottom + 6 : Math.max(8, rect.top - height - 6),
      left: Math.max(8, Math.min(rect.right - 190, window.innerWidth - 198)) });
  };
  useEffect(() => {
    if (!open) return;
    panel.current?.querySelector<HTMLButtonElement>('button')?.focus();
    const dismiss = (event: PointerEvent) => {
      if (!panel.current?.contains(event.target as Node) && !trigger.current?.contains(event.target as Node)) setPosition(null);
    };
    const close = () => setPosition(null);
    document.addEventListener('pointerdown', dismiss);
    window.addEventListener('resize', close);
    window.addEventListener('scroll', close, true);
    return () => {
      document.removeEventListener('pointerdown', dismiss);
      window.removeEventListener('resize', close);
      window.removeEventListener('scroll', close, true);
    };
  }, [open]);
  const act = (callback: (secret: SecretItem) => void) => {
    setPosition(null);
    trigger.current?.focus();
    callback(item);
  };
  const onMenuKey = (event: React.KeyboardEvent) => {
    const items = Array.from(panel.current?.querySelectorAll<HTMLButtonElement>('button') ?? []);
    const current = items.indexOf(document.activeElement as HTMLButtonElement);
    if (event.key === 'Escape') { event.preventDefault(); setPosition(null); trigger.current?.focus(); }
    if (event.key === 'Tab') setPosition(null);
    if (['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) {
      event.preventDefault();
      const next = event.key === 'Home' ? 0 : event.key === 'End' ? items.length - 1 :
        (current + (event.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length;
      items[next]?.focus();
    }
  };
  return <div className="secret-actions">
    <button type="button" className="btn btn-secondary" disabled={pending} onClick={() => onReveal(item.key)} aria-label={`Reveal ${item.key}`}>
      <Eye size={15} aria-hidden="true" /> {pending ? 'Loading…' : 'Reveal'}
    </button>
    <button ref={trigger} type="button" className="btn btn-secondary" aria-label={`More actions for ${item.key}`}
      aria-haspopup="menu" aria-controls={open ? id : undefined} aria-expanded={open} onClick={() => open ? setPosition(null) : show()}
      onKeyDown={(event) => { if (event.key === 'ArrowDown' || event.key === 'ArrowUp') { event.preventDefault(); show(); } }}><MoreHorizontal size={18} /></button>
    {position && createPortal(<div id={id} ref={panel} role="menu" className="secret-action-panel" style={position} aria-label={`Actions for ${item.key}`} onKeyDown={onMenuKey}>
      <button role="menuitem" type="button" onClick={() => act(onHistory)}><History size={15} /> Version history</button>
      {canWrite && <><button role="menuitem" type="button" onClick={() => act(onEdit)}><Pencil size={15} /> Edit secret</button>
      <button role="menuitem" type="button" className="text-[var(--vk-danger)]" onClick={() => act(onDelete)}><Trash2 size={15} /> Delete secret</button></>}
    </div>, document.body)}
  </div>;
};
