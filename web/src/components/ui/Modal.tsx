import React, { useEffect, useEffectEvent, useRef } from 'react';
import { createPortal } from 'react-dom';

const FOCUSABLE = 'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';
const modalStack: symbol[] = [];
let originalOverflow = '';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  label: string;
  children: React.ReactNode;
  width?: number;
  align?: 'center' | 'top';
  panelClassName?: string;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, label, children, width = 460, align = 'center', panelClassName = '' }) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const close = useEffectEvent(onClose);

  useEffect(() => {
    if (!isOpen) return;
    const id = Symbol('modal');
    const restore = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const panel = panelRef.current;
    const items = () => Array.from(panel?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? [])
      .filter((element) => element.getClientRects().length > 0 && !element.closest('[hidden], [inert]'));
    if (modalStack.length === 0) {
      originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
    }
    modalStack.push(id);
    (items()[0] ?? panel)?.focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (modalStack.at(-1) !== id) return;
      if (event.key === 'Escape') {
        event.preventDefault();
        event.stopImmediatePropagation();
        close();
      }
      if (event.key !== 'Tab') return;
      const elements = items();
      const first = elements[0];
      const last = elements.at(-1);
      if (!first || !panel?.contains(document.activeElement)) {
        event.preventDefault();
        (first ?? panel)?.focus();
      } else if (event.shiftKey && (document.activeElement === first || document.activeElement === panel)) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    const containFocus = (event: FocusEvent) => {
      if (modalStack.at(-1) === id && !panel?.contains(event.target as Node)) (items()[0] ?? panel)?.focus();
    };
    document.addEventListener('focusin', containFocus);
    document.addEventListener('keydown', handleKeyDown, true);
    return () => {
      document.removeEventListener('focusin', containFocus);
      document.removeEventListener('keydown', handleKeyDown, true);
      const wasTop = modalStack.at(-1) === id;
      modalStack.splice(modalStack.indexOf(id), 1);
      if (modalStack.length === 0) document.body.style.overflow = originalOverflow;
      if (wasTop && restore?.isConnected) restore.focus();
    };
  }, [isOpen]);

  if (!isOpen) return null;
  return createPortal(
    <div className={`modal-overlay${panelClassName === 'mobile-nav-panel' ? ' mobile-nav-overlay' : ''}`}
      style={align === 'top' ? { alignItems: 'flex-start', paddingTop: 'min(12vh, 80px)' } : undefined}
      onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <div ref={panelRef} role="dialog" aria-modal="true" aria-label={label} tabIndex={-1}
        className={`modal-panel ${panelClassName}`} style={{ width: '100%', maxWidth: `${width}px` }}>
        {children}
      </div>
    </div>, document.body
  );
};
