import { useEffect, useRef } from 'react';

interface IntersectionObserverOptions {
  enabled?: boolean;
  rootMargin?: string;
}

export function useIntersectionObserver(
  onIntersect: () => void,
  { enabled = true, rootMargin = '400px' }: IntersectionObserverOptions = {}
) {
  const ref = useRef<HTMLDivElement | null>(null);
  const onIntersectRef = useRef(onIntersect);

  // Keep the latest callback ref without triggering re-renders
  useEffect(() => {
    onIntersectRef.current = onIntersect;
  }, [onIntersect]);

  useEffect(() => {
    if (!enabled) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          onIntersectRef.current();
        }
      },
      { rootMargin }
    );

    const el = ref.current;
    if (el) {
      observer.observe(el);
    }

    return () => {
      if (el) {
        observer.unobserve(el);
      }
    };
  }, [enabled, rootMargin]);

  return ref;
}
