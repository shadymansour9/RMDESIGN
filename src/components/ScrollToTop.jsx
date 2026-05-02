// src/components/ScrollToTop.jsx
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Reset scroll position on every route change.
 * Works with Lenis smooth-scroll: drives the Lenis instance directly when present,
 * otherwise falls back to native instant scrollTo (no smooth, so it never fights
 * Lenis on first paint of the new page).
 */
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    const goTop = () => {
      const lenis = window.__lenis;
      if (lenis && typeof lenis.scrollTo === "function") {
        lenis.scrollTo(0, { immediate: true, force: true });
      }
      // Native fallback / hard reset for any inner scroll containers.
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      if (document.scrollingElement) {
        document.scrollingElement.scrollTop = 0;
      }
    };

    // Run twice: once immediately (before exit animation finishes)
    // and once on next frame (after the new page mounts), so position
    // is locked at top regardless of AnimatePresence timing.
    goTop();
    const raf = requestAnimationFrame(goTop);
    return () => cancelAnimationFrame(raf);
  }, [pathname]);

  return null;
}

export default ScrollToTop;
