import { RefObject, useEffect } from 'react';

/**
 * Calls `handler` when a pointer press or focus lands outside `ref`.
 *
 * More robust than the `setTimeout(blur)` pattern: it also reacts to keyboard
 * focus moving away (`focusin`), so dropdowns dismiss correctly for keyboard
 * and screen-reader users, and there's no race against click handlers.
 */
export function useClickOutside<T extends HTMLElement>(
  ref: RefObject<T | null>,
  handler: () => void,
  enabled = true
): void {
  useEffect(() => {
    if (!enabled) return;

    const onOutside = (event: Event) => {
      const el = ref.current;
      if (!el || el.contains(event.target as Node)) return;
      handler();
    };

    document.addEventListener('mousedown', onOutside);
    document.addEventListener('touchstart', onOutside);
    document.addEventListener('focusin', onOutside);
    return () => {
      document.removeEventListener('mousedown', onOutside);
      document.removeEventListener('touchstart', onOutside);
      document.removeEventListener('focusin', onOutside);
    };
  }, [ref, handler, enabled]);
}
