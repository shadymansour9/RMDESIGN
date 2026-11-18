import React from "react";

/* Bilingual (EN + HE) form fields shared by the admin editors. */

export function LocalizedInput({ label, value, onChange, hint }) {
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

export function LocalizedTextarea({ label, value, onChange, hint }) {
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

export function LocalizedList({ label, value, onChange }) {
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

