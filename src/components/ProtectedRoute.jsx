import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth, isFirebaseConfigured } from "../firebase";

/**
 * Renders children only if a Firebase user is signed in.
 * Otherwise redirects to /login (preserving the original destination
 * so LoginPage can send the user back after a successful sign-in).
 */
export default function ProtectedRoute({ children }) {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(isFirebaseConfigured);
  const location = useLocation();

  useEffect(() => {
    if (!isFirebaseConfigured || !auth) {
      setChecking(false);
      return undefined;
    }
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setChecking(false);
    });
    return () => unsub();
  }, []);

  if (checking) {
    return (
      <div className="rm-admin" dir="rtl" lang="he">
        <div className="rm-admin__container">
          <div className="rm-admin__loading">בודק חיבור…</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}
