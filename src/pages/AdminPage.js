import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebase";
import { DEFAULT_CONTENT, migrateCoursesShape } from "../data/formDefaults";
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

const newId = (prefix) =>
  `${prefix}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;

const blankCourse = () => ({
  id: newId("course"),
  label: { en: "New course", he: "קורס חדש" },
  title: { en: "", he: "" },
  intro: { en: "", he: "" },
  sessions: { en: "", he: "" },
  duration: { en: "", he: "" },
  sections: [],
  countdown: {
    enabled: false,
    targetISO: "",
    label: { en: "Next cohort starts in", he: "המחזור הבא מתחיל בעוד" },
  },
});

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
        const base = clone(DEFAULT_CONTENT);
        if (snap.exists()) {
          const migrated = migrateCoursesShape(snap.data());
          setContent(mergeDeep(base, migrated));
        } else {
          setContent(base);
        }
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
    setActiveTab("hero");
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

  const handleAddCourse = () => {
    const course = blankCourse();
    setContent((prev) => ({
      ...prev,
      courses: [...(Array.isArray(prev?.courses) ? prev.courses : []), course],
    }));
    setActiveTab(`course:${course.id}`);
  };

  /* Build the tab row dynamically. Order:
     הכותרת → כל הקורסים → עדויות → "+ הוסף קורס" pseudo-tab */
  const courses = Array.isArray(content?.courses) ? content.courses : [];
  const tabs = useMemo(() => {
    const courseTabs = courses.map((c, i) => {
      const labelText =
        (c.label?.he || c.label?.en || `קורס ${i + 1}`).trim() || `קורס ${i + 1}`;
      return {
        key: `course:${c.id}`,
        label: labelText,
        type: "course",
      };
    });
    return [
      { key: "hero", label: "כותרת", type: "section" },
      ...courseTabs,
      { key: "testimonials", label: "עדויות", type: "section" },
      { key: "__add", label: "+ הוסף קורס", type: "action" },
    ];
  }, [courses]);

  // If the active course got deleted, fall back to hero.
  useEffect(() => {
    if (!activeTab.startsWith("course:")) return;
    const id = activeTab.slice(7);
    if (!courses.find((c) => c.id === id)) {
      setActiveTab("hero");
    }
  }, [activeTab, courses]);

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

      <nav className="rm-admin__tabs" role="tablist">
        {tabs.map((t) => {
          const isAction = t.type === "action";
          const isActive = !isAction && activeTab === t.key;
          return (
            <button
              key={t.key}
              type="button"
              role={isAction ? "button" : "tab"}
              aria-selected={!isAction ? isActive : undefined}
              onClick={() => (isAction ? handleAddCourse() : setActiveTab(t.key))}
              className={[
                "rm-admin__tab",
                isActive ? "is-active" : "",
                isAction ? "rm-admin__tab--add" : "",
                t.type === "course" ? "rm-admin__tab--course" : "",
              ].filter(Boolean).join(" ")}
              title={isAction ? "הוסף קורס חדש" : t.label}
            >
              {t.label}
            </button>
          );
        })}
      </nav>

      <section className="rm-admin__section">
        {activeTab === "hero" && <HeroSection content={content} update={update} />}
        {activeTab === "testimonials" && <TestimonialsSection content={content} update={update} />}
        {activeTab.startsWith("course:") && (
          <CourseSingleEditor
            content={content}
            update={update}
            courseId={activeTab.slice(7)}
            onDeleted={() => setActiveTab("hero")}
          />
        )}
      </section>
    </>
  );
}

/* ---------- Hero ---------- */
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

/* ---------- Countdown editor ---------- */
function CountdownEditor({ value, onChange }) {
  const v = value || {};
  return (
    <div className="rm-admin__countdown-block">
      <h3 className="rm-admin__h3">טיימר ספירה לאחור</h3>
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
    </div>
  );
}

/* ---------- Single-course editor (one tab = one course) ---------- */
function CourseSingleEditor({ content, update, courseId, onDeleted }) {
  const list = Array.isArray(content.courses) ? content.courses : [];
  const idx = list.findIndex((c) => c.id === courseId);

  if (idx < 0) {
    return <p className="rm-admin__hint-block">הקורס לא נמצא.</p>;
  }

  const course = list[idx];
  const writeList = (next) => update("courses", next);

  const handleField = (field, value) => {
    writeList(list.map((c, i) => (i === idx ? { ...c, [field]: value } : c)));
  };

  const handleDelete = () => {
    const name = course.label?.he || course.label?.en || `קורס #${idx + 1}`;
    if (!window.confirm(`למחוק את הקורס "${name}"? פעולה זו לא הפיכה.`)) return;
    writeList(list.filter((_, i) => i !== idx));
    onDeleted();
  };

  const handleSectionField = (sIdx, field, value) => {
    writeList(list.map((c, i) => {
      if (i !== idx) return c;
      const sections = [...(c.sections || [])];
      sections[sIdx] = { ...sections[sIdx], [field]: value };
      return { ...c, sections };
    }));
  };

  const addSection = () => {
    writeList(list.map((c, i) => {
      if (i !== idx) return c;
      const sections = [
        ...(c.sections || []),
        { heading: { en: "", he: "" }, items: { en: [], he: [] } },
      ];
      return { ...c, sections };
    }));
  };

  const removeSection = (sIdx) => {
    if (!window.confirm("למחוק את הסקשן הזה?")) return;
    writeList(list.map((c, i) => {
      if (i !== idx) return c;
      return { ...c, sections: (c.sections || []).filter((_, j) => j !== sIdx) };
    }));
  };

  return (
    <div className="rm-admin__grid">
      <header className="rm-admin__course-header">
        <div>
          <h2 className="rm-admin__h2 rm-admin__h2--inline">
            {course.label?.he || course.label?.en || `קורס #${idx + 1}`}
          </h2>
          <p className="rm-admin__hint-block rm-admin__hint-block--inline">
            עורך/ת את הקורס הזה. שדה "תווית" קובע את שם הטאב למעלה.
          </p>
        </div>
        <button
          type="button"
          className="rm-admin__btn rm-admin__btn--danger"
          onClick={handleDelete}
        >
          מחק קורס
        </button>
      </header>

      <LocalizedInput
        label="תווית (שם בטאב)"
        value={course.label}
        onChange={(v) => handleField("label", v)}
      />
      <LocalizedInput
        label="כותרת"
        value={course.title}
        onChange={(v) => handleField("title", v)}
      />
      <LocalizedTextarea
        label="פסקת פתיחה"
        value={course.intro}
        onChange={(v) => handleField("intro", v)}
        hint='שורת רווח כפולה (Enter פעמיים) תיצור פסקה חדשה. ניתן להשתמש ב-HTML פנימי: <strong>מודגש</strong>'
      />
      <LocalizedInput
        label="מפגשים (אופציונלי)"
        value={course.sessions}
        onChange={(v) => handleField("sessions", v)}
      />
      <LocalizedInput
        label="משך מפגש (אופציונלי)"
        value={course.duration}
        onChange={(v) => handleField("duration", v)}
      />

      <div className="rm-admin__sections-block">
        <div className="rm-admin__sections-head">
          <h3 className="rm-admin__h3">סקשנים</h3>
          <button
            type="button"
            className="rm-admin__btn rm-admin__btn--ghost"
            onClick={addSection}
          >
            + הוסף סקשן
          </button>
        </div>

        {(course.sections || []).length === 0 && (
          <p className="rm-admin__hint-block">
            אין סקשנים. סקשן הוא כותרת + רשימת פריטים (לדוגמה: "מה תלמדו" עם נקודות).
          </p>
        )}

        {(course.sections || []).map((section, sIdx) => (
          <div key={sIdx} className="rm-admin__section-card">
            <div className="rm-admin__testimonial-head">
              <span className="rm-admin__testimonial-tag">סקשן #{sIdx + 1}</span>
              <button
                type="button"
                className="rm-admin__icon-btn"
                onClick={() => removeSection(sIdx)}
                aria-label="מחק סקשן"
                title="מחק סקשן"
              >
                ×
              </button>
            </div>
            <LocalizedInput
              label="כותרת הסקשן"
              value={section.heading}
              onChange={(v) => handleSectionField(sIdx, "heading", v)}
            />
            <LocalizedList
              label="פריטים (נקודות)"
              value={section.items}
              onChange={(v) => handleSectionField(sIdx, "items", v)}
            />
          </div>
        ))}
      </div>

      <CountdownEditor
        value={course.countdown}
        onChange={(next) => handleField("countdown", next)}
      />
    </div>
  );
}

/* ---------- Testimonials ---------- */
function TestimonialsSection({ content, update }) {
  const list = Array.isArray(content.testimonials) ? content.testimonials : [];
  const writeList = (next) => update("testimonials", next);

  const handleAdd = () => {
    writeList([
      ...list,
      { id: newId("t"), name: "", course: "", quote: { en: "", he: "" } },
    ]);
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
          rows={4}
          placeholder="English"
          value={v.en || ""}
          onChange={(e) => onChange({ ...v, en: e.target.value })}
          dir="ltr"
        />
        <textarea
          rows={4}
          placeholder="עברית"
          value={v.he || ""}
          onChange={(e) => onChange({ ...v, he: e.target.value })}
          dir="rtl"
        />
      </div>
      {hint && <small dangerouslySetInnerHTML={{ __html: hint }} />}
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
