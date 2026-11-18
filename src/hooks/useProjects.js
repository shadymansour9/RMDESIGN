import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db, isFirebaseConfigured } from "../firebase";
import { DEFAULT_PROJECTS, normalizeProjects } from "../data/projectsDefaults";

/**
 * Live-syncs the project list from Firestore (doc: siteContent/projects → { items: [...] }).
 * Returns DEFAULT_PROJECTS until the doc loads, or if it doesn't exist yet.
 */
export default function useProjects() {
  const [projects, setProjects] = useState(DEFAULT_PROJECTS);
  const [loading, setLoading] = useState(isFirebaseConfigured);

  useEffect(() => {
    if (!isFirebaseConfigured || !db) {
      setLoading(false);
      return undefined;
    }

    const unsub = onSnapshot(
      doc(db, "siteContent", "projects"),
      (snap) => {
        const items = snap.exists() ? snap.data()?.items : null;
        setProjects(Array.isArray(items) ? normalizeProjects(items) : DEFAULT_PROJECTS);
        setLoading(false);
      },
      (err) => {
        console.warn("[useProjects] snapshot error:", err.message);
        setProjects(DEFAULT_PROJECTS);
        setLoading(false);
      }
    );
    return () => unsub();
  }, []);

  return { projects, loading };
}

/** Find a project by slug, falling back to id (keeps old /projects/3 links working). */
export function findProject(projects, idOrSlug) {
  const key = String(idOrSlug || "");
  return projects.find((p) => p.slug === key) || projects.find((p) => p.id === key) || null;
}
