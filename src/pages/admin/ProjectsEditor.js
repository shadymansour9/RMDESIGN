import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase";
import {
  DEFAULT_PROJECTS,
  PROJECT_CATEGORIES,
  normalizeProjects,
  slugify,
} from "../../data/projectsDefaults";
import { isCloudinaryConfigured, optimizedUrl, uploadMedia } from "../../cloudinary";
import { LocalizedInput, LocalizedTextarea } from "../../components/admin/LocalizedFields";

const PROJECTS_DOC = () => doc(db, "siteContent", "projects");
const clone = (o) => JSON.parse(JSON.stringify(o));
const newId = () => `p-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const blankProject = () => ({
  id: newId(),
  slug: "",
  title: { en: "", he: "" },
  category: "residential",
  year: String(new Date().getFullYear()),
  area: "",
  location: { en: "Haifa, Israel", he: "חיפה, ישראל" },
  description: { en: "", he: "" },
  cover: "",
  gallery: [],
  showOnHome: true,
});

const projectName = (p, i) =>
  (p.title?.he || p.title?.en || "").trim() || `פרויקט ${i + 1}`;

/* ======================================================================= */
export default function ProjectsEditor({ user, onSignOut }) {
  const [projects, setProjects] = useState(null);
  const [savedJson, setSavedJson] = useState("");
  const [activeId, setActiveId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState(null);
  const [error, setError] = useState("");
  const [uploads, setUploads] = useState(0); // number of in-flight uploads
  // Projects whose slug should keep following the English title (new projects until edited by hand)
  const autoSlug = useRef(new Set());

  /* ---------- Load ---------- */
  useEffect(() => {
    let cancelled = false;
    (async () => {
      let list = DEFAULT_PROJECTS;
      try {
        const snap = await getDoc(PROJECTS_DOC());
        const items = snap.exists() ? snap.data()?.items : null;
        if (Array.isArray(items)) list = normalizeProjects(items);
      } catch (err) {
        if (!cancelled) setError(err.message);
      }
      if (cancelled) return;
      const c = clone(list);
      setProjects(c);
      setSavedJson(JSON.stringify(c));
      setActiveId(c[0]?.id ?? null);
    })();
    return () => { cancelled = true; };
  }, []);

  const dirty = projects != null && JSON.stringify(projects) !== savedJson;

  /* Warn before leaving the page with unsaved edits */
  useEffect(() => {
    if (!dirty) return undefined;
    const onBeforeUnload = (e) => { e.preventDefault(); e.returnValue = ""; };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [dirty]);

  /* ---------- Mutations ---------- */
  /* `patchOrFn` is a partial project, or (currentProject) => partial */
  const updateProject = (id, patchOrFn) => {
    setProjects((prev) => prev.map((p) => {
      if (p.id !== id) return p;
      const patch = typeof patchOrFn === "function" ? patchOrFn(p) : patchOrFn;
      const next = { ...p, ...patch };
      if (patch.title && autoSlug.current.has(id)) next.slug = patch.title.en ? slugify(patch.title.en) : "";
      return next;
    }));
  };

  const setSlugManually = (id, slug) => {
    autoSlug.current.delete(id);
    updateProject(id, { slug });
  };

  const addProject = () => {
    const p = blankProject();
    autoSlug.current.add(p.id);
    setProjects((prev) => [...prev, p]);
    setActiveId(p.id);
  };

  const deleteProject = (id) => {
    const idx = projects.findIndex((p) => p.id === id);
    if (!window.confirm(`למחוק את הפרויקט "${projectName(projects[idx], idx)}"? הוא ייעלם מהאתר אחרי שמירה.`)) return;
    const next = projects.filter((p) => p.id !== id);
    setProjects(next);
    setActiveId(next[Math.max(0, idx - 1)]?.id ?? null);
  };

  const moveProject = (id, delta) => {
    setProjects((prev) => {
      const i = prev.findIndex((p) => p.id === id);
      const j = i + delta;
      if (i < 0 || j < 0 || j >= prev.length) return prev;
      const next = [...prev];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  };

  /* ---------- Save ---------- */
  const validate = () => {
    const seen = new Set();
    for (let i = 0; i < projects.length; i += 1) {
      const p = projects[i];
      const name = projectName(p, i);
      if (!p.title.en.trim() && !p.title.he.trim()) return [p.id, `לפרויקט #${i + 1} חסר שם.`];
      if (!SLUG_RE.test(p.slug)) return [p.id, `כתובת ה-URL של "${name}" לא תקינה — רק אותיות באנגלית קטנות, ספרות ומקפים.`];
      if (seen.has(p.slug)) return [p.id, `הכתובת "${p.slug}" כבר בשימוש בפרויקט אחר.`];
      seen.add(p.slug);
    }
    return null;
  };

  const handleSave = async () => {
    setError("");
    setSavedAt(null);
    const problem = validate();
    if (problem) {
      setActiveId(problem[0]);
      setError(problem[1]);
      return;
    }
    setSaving(true);
    try {
      const items = projects.map((p) => ({
        ...p,
        area: p.area === "" ? "" : Number(p.area) || "",
        cover: p.cover || p.gallery.find((g) => g.type === "image")?.src || "",
      }));
      await setDoc(PROJECTS_DOC(), {
        items,
        _updatedAt: serverTimestamp(),
        _updatedBy: user?.email || "unknown",
      });
      setProjects(items);
      setSavedJson(JSON.stringify(items));
      autoSlug.current.clear();
      setSavedAt(new Date());
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleRevert = () => {
    if (!window.confirm("לבטל את כל השינויים שלא נשמרו?")) return;
    const c = JSON.parse(savedJson);
    setProjects(c);
    if (!c.find((p) => p.id === activeId)) setActiveId(c[0]?.id ?? null);
  };

  const trackUpload = useMemo(() => ({
    start: () => setUploads((n) => n + 1),
    end: () => setUploads((n) => Math.max(0, n - 1)),
  }), []);

  if (!projects) return <div className="rm-admin__loading">טוען…</div>;

  const activeIdx = projects.findIndex((p) => p.id === activeId);
  const active = projects[activeIdx];

  return (
    <>
      <header className="rm-admin__header">
        <div>
          <h1 className="rm-admin__title">עורך הפרויקטים</h1>
          <p className="rm-admin__sub">
            מחובר/ת כ-<strong>{user?.email}</strong>{" "}
            · <button className="rm-admin__link" onClick={onSignOut}>התנתק</button>
          </p>
        </div>
        <div className="rm-admin__actions">
          <Link to="/projects" target="_blank" rel="noopener" className="rm-admin__btn rm-admin__btn--ghost">
            צפה בדף ↗
          </Link>
          {dirty && (
            <button className="rm-admin__btn rm-admin__btn--ghost" onClick={handleRevert}>
              בטל שינויים
            </button>
          )}
          <button
            className="rm-admin__btn"
            onClick={handleSave}
            disabled={saving || uploads > 0 || !dirty}
            title={uploads > 0 ? "יש להמתין לסיום ההעלאות" : undefined}
          >
            {saving ? "שומר…" : uploads > 0 ? "מעלה קבצים…" : dirty ? "שמור שינויים" : "הכל נשמר"}
          </button>
        </div>
      </header>

      {error && <div className="rm-admin__error rm-admin__error--top">{error}</div>}
      {savedAt && !dirty && (
        <div className="rm-admin__saved">
          ✓ נשמר ב-{savedAt.toLocaleTimeString("he-IL")} — השינויים חיים באתר.
        </div>
      )}
      {dirty && !error && (
        <div className="rm-admin__unsaved">יש שינויים שלא נשמרו. לחצו "שמור שינויים" כדי לפרסם אותם באתר.</div>
      )}

      <nav className="rm-admin__tabs" role="tablist">
        {projects.map((p, i) => (
          <button
            key={p.id}
            type="button"
            role="tab"
            aria-selected={p.id === activeId}
            onClick={() => setActiveId(p.id)}
            className={`rm-admin__tab rm-admin__tab--course ${p.id === activeId ? "is-active" : ""}`}
          >
            {projectName(p, i)}
          </button>
        ))}
        <button type="button" className="rm-admin__tab rm-admin__tab--add" onClick={addProject}>
          + הוסף פרויקט
        </button>
      </nav>

      <section className="rm-admin__section">
        {active ? (
          <ProjectForm
            key={active.id}
            project={active}
            index={activeIdx}
            total={projects.length}
            onChange={(patch) => updateProject(active.id, patch)}
            onSlugChange={(slug) => setSlugManually(active.id, slug)}
            onDelete={() => deleteProject(active.id)}
            onMove={(d) => moveProject(active.id, d)}
            trackUpload={trackUpload}
          />
        ) : (
          <p className="rm-admin__hint-block">
            אין פרויקטים. לחצו "+ הוסף פרויקט" כדי להתחיל.
          </p>
        )}
      </section>
    </>
  );
}

/* ======================================================================= */
function ProjectForm({ project: p, index, total, onChange, onSlugChange, onDelete, onMove, trackUpload }) {
  const imageItems = p.gallery.filter((g) => g.type === "image");

  // Uploads finish asynchronously (possibly several at once, possibly after switching tabs),
  // so gallery changes are functional updates against the latest project state.
  const addMedia = (items) => {
    onChange((cur) => {
      const patch = { gallery: [...cur.gallery, ...items] };
      const firstImg = items.find((g) => g.type === "image");
      if (!cur.cover && firstImg) patch.cover = firstImg.src;
      return patch;
    });
  };

  const removeItem = (i) => {
    onChange((cur) => {
      const item = cur.gallery[i];
      const gallery = cur.gallery.filter((_, j) => j !== i);
      const patch = { gallery };
      if (item && item.src === cur.cover) patch.cover = gallery.find((g) => g.type === "image")?.src || "";
      return patch;
    });
  };

  const moveItem = (i, delta) => {
    onChange((cur) => {
      const j = i + delta;
      if (j < 0 || j >= cur.gallery.length) return {};
      const gallery = [...cur.gallery];
      [gallery[i], gallery[j]] = [gallery[j], gallery[i]];
      return { gallery };
    });
  };

  return (
    <div className="rm-admin__grid">
      <header className="rm-admin__course-header">
        <div>
          <h2 className="rm-admin__h2 rm-admin__h2--inline">{projectName(p, index)}</h2>
          <p className="rm-admin__hint-block rm-admin__hint-block--inline">
            מיקום {index + 1} מתוך {total} בדף הפרויקטים
          </p>
        </div>
        <div className="rm-admin__actions">
          <button type="button" className="rm-admin__btn rm-admin__btn--ghost" onClick={() => onMove(-1)} disabled={index === 0}>
            → הקדם
          </button>
          <button type="button" className="rm-admin__btn rm-admin__btn--ghost" onClick={() => onMove(1)} disabled={index === total - 1}>
            דחה ←
          </button>
          <button type="button" className="rm-admin__btn rm-admin__btn--danger" onClick={onDelete}>
            מחק פרויקט
          </button>
        </div>
      </header>

      <LocalizedInput
        label="שם הפרויקט"
        value={p.title}
        onChange={(title) => onChange({ title })}
      />

      <label className="rm-admin__field">
        <span>כתובת בדף (URL)</span>
        <div className="rm-admin__slug">
          <code dir="ltr">/projects/</code>
          <input
            type="text"
            dir="ltr"
            value={p.slug}
            placeholder="my-project"
            onChange={(e) => onSlugChange(e.target.value.toLowerCase().replace(/\s+/g, "-"))}
          />
        </div>
        <small>אותיות באנגלית קטנות, ספרות ומקפים. נוצרת אוטומטית מהשם באנגלית בפרויקט חדש.</small>
      </label>

      <div className="rm-admin__row">
        <label className="rm-admin__field">
          <span>קטגוריה</span>
          <select
            className="rm-admin__select"
            value={p.category}
            onChange={(e) => onChange({ category: e.target.value })}
          >
            {PROJECT_CATEGORIES.map((c) => (
              <option key={c.key} value={c.key}>{c.he} · {c.en}</option>
            ))}
          </select>
        </label>
        <label className="rm-admin__field">
          <span>שנה</span>
          <input
            className="rm-admin__input"
            type="text"
            inputMode="numeric"
            dir="ltr"
            value={p.year}
            onChange={(e) => onChange({ year: e.target.value.replace(/[^\d]/g, "").slice(0, 4) })}
          />
        </label>
        <label className="rm-admin__field">
          <span>שטח (מ"ר)</span>
          <input
            className="rm-admin__input"
            type="text"
            inputMode="numeric"
            dir="ltr"
            value={p.area}
            onChange={(e) => onChange({ area: e.target.value.replace(/[^\d]/g, "") })}
          />
        </label>
      </div>

      <LocalizedInput
        label="מיקום"
        value={p.location}
        onChange={(location) => onChange({ location })}
      />

      <LocalizedTextarea
        label="תיאור (אופציונלי)"
        value={p.description}
        onChange={(description) => onChange({ description })}
        hint="מוצג בדף הפרויקט ליד פרטי הפרויקט. אם ריק — יוצג טקסט ברירת מחדל."
      />

      <label className="rm-admin__check">
        <input
          type="checkbox"
          checked={p.showOnHome}
          onChange={(e) => onChange({ showOnHome: e.target.checked })}
        />
        <span>הצג בפס התמונות בדף הבית</span>
      </label>

      {/* ---------- Cover ---------- */}
      <h3 className="rm-admin__h3">תמונה ראשית</h3>
      <div className="rm-admin__cover">
        {p.cover ? (
          <img src={optimizedUrl(p.cover, 900)} alt="" />
        ) : (
          <div className="rm-admin__cover-empty">אין תמונה ראשית</div>
        )}
        <div className="rm-admin__cover-side">
          <p className="rm-admin__hint-block rm-admin__hint-block--inline">
            מוצגת ברשימת הפרויקטים ובראש דף הפרויקט. אפשר להעלות תמונה חדשה, או ללחוץ ★ על תמונה מהגלריה למטה.
          </p>
          <MediaUploader
            label="העלה תמונה ראשית"
            accept="image/*"
            multiple={false}
            compact
            trackUpload={trackUpload}
            onUploaded={([item]) => item && onChange({ cover: item.src })}
          />
        </div>
      </div>

      {/* ---------- Gallery ---------- */}
      <h3 className="rm-admin__h3">גלריה ({p.gallery.length})</h3>
      <MediaUploader
        label="גררו לכאן תמונות או סרטונים, או לחצו לבחירה"
        accept="image/*,video/*"
        multiple
        trackUpload={trackUpload}
        onUploaded={addMedia}
      />

      {p.gallery.length > 0 ? (
        <ul className="rm-admin__gallery">
          {p.gallery.map((g, i) => {
            const isCover = g.type === "image" && g.src === p.cover;
            return (
              <li key={`${g.src}-${i}`} className={`rm-admin__thumb ${isCover ? "is-cover" : ""}`}>
                {g.type === "video" ? (
                  <video src={g.src} muted playsInline preload="metadata" />
                ) : (
                  <img src={optimizedUrl(g.src, 400)} alt="" loading="lazy" />
                )}
                <span className="rm-admin__thumb-num">{i + 1}</span>
                {g.type === "video" && <span className="rm-admin__thumb-badge">וידאו</span>}
                {isCover && <span className="rm-admin__thumb-badge rm-admin__thumb-badge--cover">ראשית</span>}
                <div className="rm-admin__thumb-tools">
                  <button type="button" onClick={() => moveItem(i, -1)} disabled={i === 0} title="הזז קודם" aria-label="הזז קודם">→</button>
                  {g.type === "image" && (
                    <button
                      type="button"
                      onClick={() => onChange({ cover: g.src })}
                      disabled={isCover}
                      title="קבע כתמונה ראשית"
                      aria-label="קבע כתמונה ראשית"
                    >★</button>
                  )}
                  <button type="button" onClick={() => moveItem(i, 1)} disabled={i === p.gallery.length - 1} title="הזז הבא" aria-label="הזז הבא">←</button>
                  <button
                    type="button"
                    className="is-danger"
                    onClick={() => removeItem(i)}
                    title="הסר מהגלריה"
                    aria-label="הסר מהגלריה"
                  >×</button>
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="rm-admin__hint-block">הגלריה ריקה.</p>
      )}
      {imageItems.length === 0 && p.gallery.length > 0 && !p.cover && (
        <p className="rm-admin__hint-block">טיפ: הוסיפו לפחות תמונה אחת כדי שתהיה לפרויקט תמונה ראשית.</p>
      )}
    </div>
  );
}

/* ======================================================================= */
function MediaUploader({ label, accept, multiple, compact, onUploaded, trackUpload }) {
  const inputRef = useRef(null);
  const [jobs, setJobs] = useState([]); // [{ id, name, progress, error }]
  const [over, setOver] = useState(false);

  const handleFiles = async (fileList) => {
    const files = Array.from(fileList || []).filter((f) => {
      const okType = accept.includes("video") ? /^(image|video)\//.test(f.type) : f.type.startsWith("image/");
      return okType;
    });
    if (!files.length) return;

    const batch = files.map((f) => ({ id: newId(), name: f.name, progress: 0, error: "" }));
    setJobs((j) => [...j, ...batch]);

    // Upload up to 3 at a time, but hand results back in the order the files were chosen.
    const results = new Array(files.length).fill(null);
    let cursor = 0;
    const worker = async () => {
      while (cursor < files.length) {
        const i = cursor; cursor += 1;
        const job = batch[i];
        trackUpload.start();
        try {
          results[i] = await uploadMedia(files[i], (fr) =>
            setJobs((js) => js.map((x) => (x.id === job.id ? { ...x, progress: fr } : x)))
          );
          setJobs((js) => js.filter((x) => x.id !== job.id));
        } catch (err) {
          setJobs((js) => js.map((x) => (x.id === job.id ? { ...x, error: err.message } : x)));
        } finally {
          trackUpload.end();
        }
      }
    };
    await Promise.all([worker(), worker(), worker()]);
    const ok = results.filter(Boolean);
    if (ok.length) onUploaded(ok);
  };

  if (!isCloudinaryConfigured) {
    return (
      <div className="rm-admin__error">
        העלאת קבצים עדיין לא מוגדרת — חסרים REACT_APP_CLOUDINARY_CLOUD_NAME ו-REACT_APP_CLOUDINARY_UPLOAD_PRESET. ראו FIREBASE_SETUP.md.
      </div>
    );
  }

  return (
    <div>
      <button
        type="button"
        className={`rm-admin__drop ${compact ? "rm-admin__drop--compact" : ""} ${over ? "is-over" : ""}`}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setOver(true); }}
        onDragLeave={() => setOver(false)}
        onDrop={(e) => { e.preventDefault(); setOver(false); handleFiles(e.dataTransfer.files); }}
      >
        <span aria-hidden>⤒</span> {label}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        hidden
        onChange={(e) => { handleFiles(e.target.files); e.target.value = ""; }}
      />
      {jobs.length > 0 && (
        <ul className="rm-admin__jobs">
          {jobs.map((j) => (
            <li key={j.id} className={j.error ? "is-error" : ""}>
              <span className="rm-admin__job-name" dir="ltr">{j.name}</span>
              {j.error ? (
                <>
                  <span className="rm-admin__job-err">{j.error}</span>
                  <button
                    type="button"
                    className="rm-admin__icon-btn"
                    onClick={() => setJobs((js) => js.filter((x) => x.id !== j.id))}
                    aria-label="סגור"
                  >×</button>
                </>
              ) : (
                <span className="rm-admin__job-bar"><i style={{ width: `${Math.round(j.progress * 100)}%` }} /></span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
