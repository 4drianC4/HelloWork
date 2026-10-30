import { useRef } from 'react';
import type { PointerEvent } from 'react';
import { useMediaQuery } from './useMediaQuery';

export function useCardDepth() {
  const ref = useRef<HTMLElement>(null);
  const enabled = useMediaQuery('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)');
  function reset() {
    const element = ref.current;
    if (!element) return;
    element.style.removeProperty('--tilt-x');
    element.style.removeProperty('--tilt-y');
    element.style.removeProperty('--light-opacity');
  }
  function onPointerMove(event: PointerEvent<HTMLElement>) {
    if (!enabled || event.pointerType === 'touch') { reset(); return; }
    const element = ref.current;
    if (!element) return;
    const bounds = element.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (event.clientX - bounds.left) / bounds.width));
    const y = Math.max(0, Math.min(1, (event.clientY - bounds.top) / bounds.height));
    element.style.setProperty('--tilt-x', `${(0.5 - y) * 5}deg`);
    element.style.setProperty('--tilt-y', `${(x - 0.5) * 5}deg`);
    element.style.setProperty('--light-x', `${x * 100}%`);
    element.style.setProperty('--light-y', `${y * 100}%`);
    element.style.setProperty('--light-opacity', '1');
  }
  return { ref, onPointerMove, onPointerLeave: reset, onPointerCancel: reset };
}
