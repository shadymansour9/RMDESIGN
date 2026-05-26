import React, { useEffect, useState } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth, isFirebaseConfigured } from "../firebase";
import "../styleSheets/AdminPage.css";

export default function LoginPage() {
  const [user, setUser] = useState(null);
  const [authChecking, setAuthChecking] = useState(isFirebaseConfigured);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const location = useLocation();

  // Where to send the user after successful login (default /admin).
  const redirectTo = location.state?.from?.pathname || "/admin";

  useEffect(() => {
    if (!isFirebaseConfigured || !auth) {
      setAuthChecking(false);
      return undefined;
    }
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setAuthChecking(false);
    });
    return () => unsub();
  }, []);

  if (!isFirebaseConfigured) {
    return (
      <div className="rm-admin" dir="rtl" lang="he">
        <div className="rm-admin__container">
          <div className="rm-admin__missing">
            <h1>Firebase לא מוגדר</h1>
            <p>
              הוסף את פרטי Firebase לקובץ <code>.env.local</code> ואז הפעל מחדש את{" "}
              <code>npm start</code>.
            </p>
            <Link to="/" className="rm-admin__back">→ חזרה לאתר</Link>
          </div>
        </div>
      </div>
    );
  }

  if (authChecking) {
    return (
      <div className="rm-admin" dir="rtl" lang="he">
        <div className="rm-admin__container">
          <div className="rm-admin__loading">בודק חיבור…</div>
        </div>
      </div>
    );
  }

  // Already signed in → bounce to the protected page (or /admin).
  if (user) return <Navigate to={redirectTo} replace />;

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // The onAuthStateChanged listener will set user and trigger redirect.
    } catch (err) {
      setError(
        err.code === "auth/invalid-credential"
          ? "אימייל או סיסמה שגויים."
          : err.message
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="rm-admin" dir="rtl" lang="he">
      <div className="rm-admin__container">
        <div className="rm-admin__login">
          <h1 className="rm-admin__title">אדמין · כניסה</h1>
          <p className="rm-admin__sub">RM Design Studio · עורך תוכן</p>
          <form onSubmit={submit} className="rm-admin__form">
            <label>
              <span>אימייל</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
                autoComplete="email"
                dir="ltr"
              />
            </label>
            <label>
              <span>סיסמה</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                dir="ltr"
              />
            </label>
            {error && <div className="rm-admin__error">{error}</div>}
            <button type="submit" className="rm-admin__btn" disabled={busy}>
              {busy ? "מתחבר…" : "התחבר"}
            </button>
          </form>
          <Link to="/" className="rm-admin__back">→ חזרה לאתר</Link>
        </div>
      </div>
    </div>
  );
}
