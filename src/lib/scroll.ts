/**
 * Register a scroll listener throttled to one requestAnimationFrame per frame.
 * Returns a cleanup function to remove the listener.
 */
export function onThrottledScroll(callback: () => void): () => void {
  let ticking = false;
  const handler = () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        callback();
        ticking = false;
      });
      ticking = true;
    }
  };
  window.addEventListener("scroll", handler, { passive: true });
  return () => window.removeEventListener("scroll", handler);
}
