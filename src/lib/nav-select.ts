/**
 * Bind a <select> element to scroll-to-element-by-ID navigation.
 */
export function bindSelectNavigation(selectId: string, smooth = true): void {
  const sel = document.getElementById(selectId) as HTMLSelectElement | null;
  if (!sel) return;
  sel.addEventListener("change", () => {
    const el = document.getElementById(sel.value);
    if (el)
      el.scrollIntoView({
        behavior: smooth ? "smooth" : "auto",
        block: "start",
      });
  });
}
