/**
 * Observe sectioned content and call `onActive` with the ID of the most
 * visible section. Falls back gracefully when IntersectionObserver is absent.
 * Returns a cleanup function to disconnect the observer, or undefined if
 * the observer could not be created.
 */
export function trackVisibleSection(
  selector: string,
  onActive: (id: string) => void,
  options?: IntersectionObserverInit,
): (() => void) | undefined {
  if (!("IntersectionObserver" in window)) return undefined;
  const els = document.querySelectorAll<HTMLElement>(selector);
  if (!els.length) return undefined;
  const obs = new IntersectionObserver((entries) => {
    const best = entries
      .filter((e) => e.isIntersecting)
      .sort((a, b) => {
        const d = b.intersectionRatio - a.intersectionRatio;
        return d !== 0
          ? d
          : a.boundingClientRect.top - b.boundingClientRect.top;
      })[0];
    if (best?.target.id) onActive(best.target.id);
  }, options);
  for (const el of els) obs.observe(el);
  return () => obs.disconnect();
}
