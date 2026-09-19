/**
 * iOS scrolls the page to keep a focused input visible while the on-screen
 * keyboard is up — and sometimes leaves that offset behind after the keyboard
 * closes, which shifts the absolutely-positioned overlays. Snap back to the
 * origin whenever the keyboard goes away.
 */
export function installKeyboardViewportFix() {
  const reset = () => requestAnimationFrame(() => window.scrollTo(0, 0));

  window.visualViewport?.addEventListener("resize", () => {
    const vv = window.visualViewport;
    if (vv && vv.height > window.innerHeight - 60) reset();
  });

  // focus left an input (keyboard dismissed) — give iOS a beat, then snap back
  document.addEventListener("focusout", () => setTimeout(reset, 50));
}
