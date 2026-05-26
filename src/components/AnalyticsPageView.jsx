import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { logEvent, setCurrentScreen } from "firebase/analytics";
import { getAnalyticsInstance } from "../firebase";

/**
 * Logs a `page_view` to Firebase Analytics on every react-router navigation.
 * Mount once near the root (inside <Router>).
 *
 * Skips silently if analytics isn't supported (e.g. in tests or when GA is
 * blocked by an extension) — never throws.
 */
export default function AnalyticsPageView() {
  const location = useLocation();

  useEffect(() => {
    let cancelled = false;
    getAnalyticsInstance().then((analytics) => {
      if (cancelled || !analytics) return;
      const path = location.pathname + location.search;
      try {
        logEvent(analytics, "page_view", {
          page_path: path,
          page_title: document.title,
          page_location: window.location.href,
        });
        // Optional: also tag screen for funnel analysis.
        if (typeof setCurrentScreen === "function") {
          setCurrentScreen(analytics, location.pathname);
        }
      } catch (err) {
        // Swallow — analytics must never break the app.
        // eslint-disable-next-line no-console
        console.warn("[analytics] logEvent failed:", err?.message);
      }
    });
    return () => { cancelled = true; };
  }, [location.pathname, location.search]);

  return null;
}
