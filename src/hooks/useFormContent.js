import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db, isFirebaseConfigured } from "../firebase";
import { DEFAULT_CONTENT } from "../data/formDefaults";

/**
 * Live-syncs the registration page content from Firestore.
 * Returns DEFAULT_CONTENT immediately and replaces it with Firestore data
 * when available. If Firebase isn't configured or the doc doesn't exist,
 * defaults are returned (so the page never renders empty).
 *
 * Doc path: siteContent/formPage
 */
export default function useFormContent() {
  const [content, setContent] = useState(DEFAULT_CONTENT);
  const [loading, setLoading] = useState(isFirebaseConfigured);

  useEffect(() => {
    if (!isFirebaseConfigured || !db) {
      setLoading(false);
      return undefined;
    }

    const ref = doc(db, "siteContent", "formPage");
    const unsub = onSnapshot(
      ref,
      (snap) => {
        if (snap.exists()) {
          // Merge with defaults so missing fields fall back gracefully.
          setContent(mergeDeep(DEFAULT_CONTENT, snap.data()));
        } else {
          setContent(DEFAULT_CONTENT);
        }
        setLoading(false);
      },
      (err) => {
        console.warn("[useFormContent] snapshot error:", err.message);
        setContent(DEFAULT_CONTENT);
        setLoading(false);
      }
    );

    return () => unsub();
  }, []);

  return { content, loading };
}

/* Deep-merge plain objects so partial Firestore docs work. Arrays replace, not merge. */
function mergeDeep(base, overlay) {
  if (overlay == null) return base;
  if (typeof base !== "object" || Array.isArray(base) || typeof overlay !== "object" || Array.isArray(overlay)) {
    return overlay;
  }
  const out = { ...base };
  for (const k of Object.keys(overlay)) {
    out[k] = mergeDeep(base[k], overlay[k]);
  }
  return out;
}
