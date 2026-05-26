import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebase";
import { DEFAULT_CONTENT, COURSE_ORDER } from "../data/formDefaults";
import "../styleSheets/AdminPage.css";

/* Gated by <ProtectedRoute> in App.js — we can assume `auth.currentUser` exists. */
const FORM_DOC = () => doc(db, "siteContent", "formPage");

function clone(o) { return JSON.parse(JSON.stringify(o)); }

function mergeDeep(base, overlay) {
  if (overlay == null) return base;
  if (typeof base !== "object" || Array.isArray(base) || typeof overlay !== "object" || Array.isArray(overlay)) {
    return overlay;
  }
  const out = { ...base };
  for (const k of Object.keys(overlay)) out[k] = mergeDeep(base[k], overlay[k]);
  return out;
}

/* ---------- Page ---------- */
export default function AdminPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(auth?.currentUser ?? null);

  useEffect(() => {
    if (!auth) return undefined;
    return onAuthStateChanged(auth, setUser);
  }, []);

  const handleSignOut = async () => {
    await signOut(auth);
    navigate("/login", { replace: true });
  };

  return (
    <AdminShell>
      <Editor user={user} onSignOut={handleSignOut} />
    </AdminShell>
  );
}

/* ---------- Editor ---------- */
function Editor({ user, onSignOut }) {
  const [content, setContent] = useState(null);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState(null);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("hero");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const snap = await getDoc(FORM_DOC());
        if (cancelled) return;
        setContent(snap.exists()
          ? mergeDeep(clone(DEFAULT_CONTENT), snap.data())
          : clone(DEFAULT_CONTENT));
      } catch (err) {
        if (!cancelled) {
          setError(err.message);
          setContent(clone(DEFAULT_CONTENT));
        }
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const handleSave = async () => {
    if (!content) return;
    setSaving(true);
    setError("");
    try {
      await setDoc(FORM_DOC(), {
        ...content,
        _updatedAt: serverTimestamp(),
        _updatedBy: user?.email || "unknown",
      }, { merge: false });
      setSavedAt(new Date());
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (!window.confirm("לאפס את כל השדות לברירת מחדל? שינויים שלא נשמרו יאבדו.")) return;
    setContent(clone(DEFAULT_CONTENT));
  };

  const update = (path, value) => {
    setContent((prev) => {
      const next = clone(prev);
      const parts = path.split(".");
      let ref = next;
      for (let i = 0; i < parts.length - 1; i += 1) {
        if (ref[parts[i]] == null) ref[parts[i]] = {};
        ref = ref[parts[i]];
      }
      ref[parts[parts.length - 1]] = value;
      return next;
    });
  };

  const tabs = useMemo(() => ([
    { key: "hero", label: "כותרת" },
    ...COURSE_ORDER.map((k) => ({ key: `course:${k}`, label: prettyCourse(k) })),
    { key: "testimonials", label: "עדויות" },
  ]), []);

  if (!content) return <div className="rm-admin__loading">טוען…</div>;

  return (
    <>
      <header className="rm-admin__header">
        <div>
          <h1 className="rm-admin__title">עורך דף ההרשמה</h1>
          <p className="rm-admin__sub">
            מחובר/ת כ-<strong>{user?.email}</strong>{" "}
            · <button className="rm-admin__link" onClick={onSignOut}>התנתק</button>
          </p>
        </div>
        <div className="rm-admin__actions">
          <Link to="/form" target="_blank" rel="noopener" className="rm-admin__btn rm-admin__btn--ghost">
            צפה בדף ↗
          </Link>
          <button className="rm-admin__btn rm-admin__btn--ghost" onClick={handleReset}>
            אפס לברירת מחדל
          </button>
          <button className="rm-admin__btn" onClick={handleSave} disabled={saving}>
            {saving ? "שומר…" : "שמור שינויים"}
          </button>
        </div>
      </header>

      {error && <div className="rm-admin__error rm-admin__error--top">{error}</div>}
      {savedAt && (
        <div className="rm-admin__saved">
          ✓ נשמר ב-{savedAt.toLocaleTimeString("he-IL")} — השינויים חיים באתר.
        </div>
      )}

      <nav className="rm-admin__tabs">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className={`rm-admin__tab ${activeTab === t.key ? "is-active" : ""}`}
            type="button"
          >
            {t.label}
          </button>
        ))}
      </nav>

      <section className="rm-admin__section">
        {activeTab === "hero" && <HeroSection content={content} update={update} />}
        {activeTab === "testimonials" && (
          <TestimonialsSection content={content} update={update} />
        )}
        {activeTab.startsWith("course:") &&
          <CourseSection
            courseKey={activeTab.slice(7)}
            content={content}
            update={update}
          />
        }
      </section>
    </>
  );
}

/* ---------- Sections ---------- */
function HeroSection({ content, update }) {
  return (
    <div className="rm-admin__grid">
      <h2 className="rm-admin__h2">כותרת ראשית</h2>
      <LocalizedInput
        label="כותרת ראשית"
        value={content.hero?.title}
        onChange={(v) => update("hero.title", v)}
      />
      <LocalizedTextarea
        label="כותרת משנה"
        value={content.hero?.subtitle}
        onChange={(v) => update("hero.subtitle", v)}
      />
      <LocalizedInput
        label="כותרת מידע (מעל הטאבים)"
        value={content.infoHeading}
        onChange={(v) => update("infoHeading", v)}
      />
    </div>
  );
}

function CountdownEditor({ value, onChange }) {
  const v = value || {};
  return (
    <>
      <h2 className="rm-admin__h2">טיימר ספירה לאחור</h2>
      <label className="rm-admin__check">
        <input
          type="checkbox"
          checked={Boolean(v.enabled)}
          onChange={(e) => onChange({ ...v, enabled: e.target.checked })}
        />
        <span>הצג טיימר בקורס זה</span>
      </label>
      <label className="rm-admin__field">
        <span>תאריך ושעת יעד</span>
        <input
          type="datetime-local"
          value={isoToLocalInput(v.targetISO)}
          onChange={(e) => onChange({ ...v, targetISO: localInputToISO(e.target.value) })}
        />
        <small>הטיימר נעלם אוטומטית כשהמועד עובר.</small>
      </label>
      <LocalizedInput
        label="תווית הטיימר"
        value={v.label}
        onChange={(label) => onChange({ ...v, label })}
      />
    </>
  );
}

function TestimonialsSection({ content, update }) {
  const list = Array.isArray(content.testimonials) ? content.testimonials : [];

  const writeList = (next) => update("testimonials", next);

  const handleAdd = () => {
    const fresh = {
      id: `t-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`,
      name: "",
      course: "",
      quote: { en: "", he: "" },
    };
    writeList([...list, fresh]);
  };

  const handleRemove = (idx) => {
    if (!window.confirm("למחוק את העדות הזאת?")) return;
    writeList(list.filter((_, i) => i !== idx));
  };

  const handleField = (idx, field, value) => {
    writeList(list.map((item, i) => (i === idx ? { ...item, [field]: value } : item)));
  };

  const handleQuote = (idx, locale, value) => {
    writeList(list.map((item, i) => (
      i === idx
        ? { ...item, quote: { ...(item.quote || {}), [locale]: value } }
        : item
    )));
  };

  return (
    <div className="rm-admin__grid">
      <div className="rm-admin__testimonials-head">
        <h2 className="rm-admin__h2">עדויות</h2>
        <button type="button" className="rm-admin__btn" onClick={handleAdd}>
          + הוסף עדות
        </button>
      </div>

      {list.length === 0 && (
        <p className="rm-admin__hint-block">
          אין עדויות עדיין. לחץ/י "הוסף עדות" כדי להתחיל. אם המערך נשאר ריק, הסקשן באתר יוסתר אוטומטית.
        </p>
      )}

      {list.map((item, idx) => (
        <div key={item.id || idx} className="rm-admin__testimonial">
          <div className="rm-admin__testimonial-head">
            <span className="rm-admin__testimonial-tag">עדות #{idx + 1}</span>
            <button
              type="button"
              className="rm-admin__icon-btn"
              onClick={() => handleRemove(idx)}
              aria-label="מחק עדות"
              title="מחק עדות"
            >
              ×
            </button>
          </div>

          <label className="rm-admin__field">
            <span>שם</span>
            <input
              type="text"
              value={item.name || ""}
              onChange={(e) => handleField(idx, "name", e.target.value)}
              placeholder="לדוגמה: שרה כהן"
            />
          </label>

          <label className="rm-admin__field">
            <span>קורס</span>
            <input
              type="text"
              value={item.course || ""}
              onChange={(e) => handleField(idx, "course", e.target.value)}
              placeholder="לדוגמה: Revit for Careers"
            />
          </label>

          <label className="rm-admin__field">
            <span>ציטוט</span>
            <div className="rm-admin__pair">
              <textarea
                rows={3}
                placeholder="English quote"
                value={item.quote?.en || ""}
                onChange={(e) => handleQuote(idx, "en", e.target.value)}
                dir="ltr"
              />
              <textarea
                rows={3}
                placeholder="ציטוט בעברית"
                value={item.quote?.he || ""}
                onChange={(e) => handleQuote(idx, "he", e.target.value)}
                dir="rtl"
              />
            </div>
          </label>
        </div>
      ))}

      {list.length > 0 && (
        <button type="button" className="rm-admin__btn rm-admin__btn--ghost" onClick={handleAdd}>
          + הוסף עדות נוספת
        </button>
      )}
    </div>
  );
}

function CourseSection({ courseKey, content, update }) {
  const course = content.courses?.[courseKey] || {};
  const path = (sub) => `courses.${courseKey}.${sub}`;

  const fieldsByKey = {
    reality: ["label", "title", "intro", "sessions", "duration",
      "learnHeading", "learn", "audienceHeading", "audience"],
    officeDna: ["label", "title", "intro", "template", "templateHeading",
      "items", "outro"],
    careers: ["label", "title", "intro", "sessions", "duration",
      "learnHeading", "learn", "outro"],
    personal: ["label", "title", "intro", "tracksHeading", "tracks",
      "getHeading", "get", "audienceHeading", "audience"],
  };

  const fields = fieldsByKey[courseKey] || [];

  const TEXT_FIELDS = new Set(["label", "title", "sessions", "duration",
    "learnHeading", "audienceHeading", "templateHeading",
    "tracksHeading", "getHeading"]);
  const TEXTAREA_FIELDS = new Set(["intro", "template", "outro"]);
  const LIST_FIELDS = new Set(["learn", "audience", "items", "tracks", "get"]);

  const LABELS_HE = {
    label: "תווית (שם בטאב)",
    title: "כותרת",
    intro: "פסקת פתיחה",
    sessions: "מפגשים",
    duration: "משך מפגש",
    learnHeading: "כותרת \"מה תלמדו\"",
    audienceHeading: "כותרת \"למי מתאים\"",
    templateHeading: "כותרת \"מה כולל\"",
    tracksHeading: "כותרת \"מסלולים\"",
    getHeading: "כותרת \"מה תקבלו\"",
    template: "תיאור התבנית",
    outro: "פסקת סיום",
    learn: "מה תלמדו (נקודות)",
    audience: "למי מתאים (נקודות)",
    items: "פריטים (נקודות)",
    tracks: "מסלולים (נקודות)",
    get: "מה תקבלו (נקודות)",
  };

  return (
    <div className="rm-admin__grid">
      <h2 className="rm-admin__h2">{prettyCourse(courseKey)}</h2>
      {fields.map((f) => {
        const label = LABELS_HE[f] || f;
        if (TEXT_FIELDS.has(f)) {
          return (
            <LocalizedInput
              key={f}
              label={label}
              value={course[f]}
              onChange={(v) => update(path(f), v)}
            />
          );
        }
        if (TEXTAREA_FIELDS.has(f)) {
          return (
            <LocalizedTextarea
              key={f}
              label={label}
              value={course[f]}
              onChange={(v) => update(path(f), v)}
              hint="ניתן להשתמש ב-HTML: <strong>מודגש</strong>"
            />
          );
        }
        if (LIST_FIELDS.has(f)) {
          return (
            <LocalizedList
              key={f}
              label={label}
              value={course[f]}
              onChange={(v) => update(path(f), v)}
            />
          );
        }
        return null;
      })}

      <CountdownEditor
        value={course.countdown}
        onChange={(next) => update(path("countdown"), next)}
      />
    </div>
  );
}

/* ---------- Reusable inputs ---------- */
function LocalizedInput({ label, value, onChange, hint }) {
  const v = value || {};
  return (
    <label className="rm-admin__field">
      <span>{label}</span>
      <div className="rm-admin__pair">
        <input
          type="text"
          placeholder="English"
          value={v.en || ""}
          onChange={(e) => onChange({ ...v, en: e.target.value })}
          dir="ltr"
        />
        <input
          type="text"
          placeholder="עברית"
          value={v.he || ""}
          onChange={(e) => onChange({ ...v, he: e.target.value })}
          dir="rtl"
        />
      </div>
      {hint && <small>{hint}</small>}
    </label>
  );
}

function LocalizedTextarea({ label, value, onChange, hint }) {
  const v = value || {};
  return (
    <label className="rm-admin__field">
      <span>{label}</span>
      <div className="rm-admin__pair">
        <textarea
          rows={3}
          placeholder="English"
          value={v.en || ""}
          onChange={(e) => onChange({ ...v, en: e.target.value })}
          dir="ltr"
        />
        <textarea
          rows={3}
          placeholder="עברית"
          value={v.he || ""}
          onChange={(e) => onChange({ ...v, he: e.target.value })}
          dir="rtl"
        />
      </div>
      {hint && <small>{hint}</small>}
    </label>
  );
}

function LocalizedList({ label, value, onChange }) {
  const v = value || { en: [], he: [] };
  const toText = (arr) => (Array.isArray(arr) ? arr : []).join("\n");
  const toArr = (txt) =>
    txt.split("\n").map((s) => s.trim()).filter(Boolean);

  return (
    <label className="rm-admin__field">
      <span>{label}</span>
      <div className="rm-admin__pair">
        <textarea
          rows={5}
          placeholder="נקודה אחת בשורה — English"
          value={toText(v.en)}
          onChange={(e) => onChange({ ...v, en: toArr(e.target.value) })}
          dir="ltr"
        />
        <textarea
          rows={5}
          placeholder="נקודה אחת בשורה — עברית"
          value={toText(v.he)}
          onChange={(e) => onChange({ ...v, he: toArr(e.target.value) })}
          dir="rtl"
        />
      </div>
      <small>פריט אחד בכל שורה.</small>
    </label>
  );
}

/* ---------- Helpers ---------- */
function prettyCourse(k) {
  return {
    reality: "Revit Reality",
    officeDna: "Revit Office DNA",
    careers: "Revit for Careers",
    personal: "Revit Personal Project",
  }[k] || k;
}

function isoToLocalInput(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function localInputToISO(local) {
  if (!local) return "";
  const d = new Date(local);
  if (isNaN(d.getTime())) return "";
  return d.toISOString();
}

/* ---------- Shell ---------- */
function AdminShell({ children }) {
  return (
    <div className="rm-admin" dir="rtl" lang="he">
      <div className="rm-admin__container">{children}</div>
    </div>
  );
}
