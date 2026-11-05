import { useCallback, useEffect, useRef, useState } from 'react';

const TYPE_MS = 26;
const FIRST_LINE_DELAY_MS = 450;
const FALLBACK_START_MS = 1500;

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Plays a terminal session once: the command types out, then `lineCount` output lines appear in turn.
 * Starts when the element scrolls into view, never loops, and jumps straight to the finished state
 * when the user prefers reduced motion. `replay` restarts it on request.
 */
export function useTerminalPlayback(command: string, lineCount: number) {
  const [reduced] = useState(prefersReducedMotion);
  const [typed, setTyped] = useState(reduced ? command.length : 0);
  const [shown, setShown] = useState(reduced ? lineCount : 0);
  const [started, setStarted] = useState(reduced);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const element = useRef<HTMLElement | null>(null);

  const clear = useCallback(() => { timers.current.forEach(clearTimeout); timers.current = []; }, []);
  const at = useCallback((ms: number, fn: () => void) => { timers.current.push(setTimeout(fn, ms)); }, []);

  const play = useCallback(() => {
    clear();
    setTyped(0);
    setShown(0);
    const reveal = (n: number) => {
      setShown(n);
      if (n < lineCount) at(n < 2 ? 420 : 210, () => reveal(n + 1));
    };
    let i = 0;
    const typeNext = () => {
      i += 1;
      setTyped(i);
      if (i < command.length) at(TYPE_MS, typeNext);
      else at(FIRST_LINE_DELAY_MS, () => reveal(1));
    };
    at(350, typeNext);
  }, [at, clear, command.length, lineCount]);

  // Start once, when the terminal is first on screen. If the observer never reports (hidden tab,
  // unusual embedded browsers), a fallback timer still plays it so the content never stays blank.
  useEffect(() => {
    if (reduced || started) return;
    const node = element.current;
    const begin = () => { setStarted(true); play(); };
    if (!node || typeof IntersectionObserver === 'undefined') { begin(); return; }
    const stop = () => { observer.disconnect(); clearTimeout(fallback); };
    const observer = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) { stop(); begin(); }
    }, { threshold: 0.35 });
    const fallback = setTimeout(() => { stop(); begin(); }, FALLBACK_START_MS);
    observer.observe(node);
    return stop;
  }, [play, reduced, started]);

  useEffect(() => clear, [clear]);

  const finished = typed >= command.length && shown >= lineCount;
  const replay = useCallback(() => { setStarted(true); play(); }, [play]);

  return { element, typed, shown, finished, typing: started && typed < command.length, canReplay: !reduced, replay };
}
