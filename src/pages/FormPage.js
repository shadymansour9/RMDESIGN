import React, { useRef, useState, useEffect } from "react";
import emailjs from "emailjs-com";
import { useTranslation, Trans } from "react-i18next";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import RevealText from "../components/RevealText";
import MagneticButton from "../components/MagneticButton";
import SEO from "../components/SEO";
import "../styleSheets/FormPage.css";

const ease = [0.22, 1, 0.36, 1];

function FloatingField({ id, name, type = "text", required, lang, label, multiline = false, onChange }) {
  const [focused, setFocused] = useState(false);
  const [hasValue, setHasValue] = useState(false);
  const isFloating = focused || hasValue;

  const handleChange = (e) => {
    setHasValue(Boolean(e.target.value));
    if (onChange) onChange(e);
  };

  const Tag = multiline ? "textarea" : "input";
  return (
    <div className={`rm-field ${isFloating ? "is-floating" : ""}`}>
      <label htmlFor={id} className="rm-field__label">{label}</label>
      <Tag
        id={id}
        name={name}
        type={multiline ? undefined : type}
        rows={multiline ? 4 : undefined}
        required={required}
        className="rm-field__input"
        onFocus={() => setFocused(true)}
        onBlur={(e) => {
          setFocused(false);
          setHasValue(Boolean(e.target.value));
        }}
        onChange={handleChange}
        dir={lang === "he" ? "rtl" : "ltr"}
      />
      <span className="rm-field__line" />
    </div>
  );
}

function FloatingSelect({ id, name, value, onChange, options, label, lang }) {
  return (
    <div className="rm-field rm-field--select is-floating">
      <label htmlFor={id} className="rm-field__label">{label}</label>
      <select
        id={id}
        name={name}
        className="rm-field__input"
        value={value}
        onChange={onChange}
        required
        dir={lang === "he" ? "rtl" : "ltr"}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      <span className="rm-field__line" />
      <span className="rm-field__caret" aria-hidden>↓</span>
    </div>
  );
}

function FormPage() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language?.startsWith("he") ? "he" : "en";
  const form = useRef();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [registrantName, setRegistrantName] = useState("");

  const courses = [
    { id: "revit-reality", key: "reality" },
    { id: "revit-office-dna", key: "officeDna" },
    { id: "revit-careers", key: "careers" },
    { id: "revit-personal-project", key: "personal" },
  ];

  const [selectedCourse, setSelectedCourse] = useState(courses[0].id);

  const courseLabel = (() => {
    const found = courses.find((c) => c.id === selectedCourse);
    return found ? t(`form.courses.${found.key}.label`) : selectedCourse;
  })();

  const subjectLine = registrantName
    ? `🎓 הרשמה חדשה: ${registrantName} — ${courseLabel}`
    : `🎓 הרשמה חדשה לקורס: ${courseLabel}`;

  const sendEmail = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    emailjs
      .sendForm("service_9mrmmoh", "template_geaa5dw", form.current, "0-GZndZldpzAWnM2X")
      .then(() => {
        setSubmitStatus("success");
        emailjs.sendForm("service_9mrmmoh", "template_140wet8", form.current, "0-GZndZldpzAWnM2X");

        const formData = new FormData(form.current);
        fetch(
          "https://script.google.com/macros/s/AKfycbxzEmofjEwPOj0Zgll_Sfz7VNGQgjSxUQ2LANeS8InikL5FGoZJKvpyVWqJOMjnaYUXjw/exec",
          { method: "POST", mode: "no-cors", body: formData }
        );

        form.current.reset();
      })
      .catch((error) => {
        setSubmitStatus("error");
        console.error("Error:", error);
      })
      .finally(() => {
        setIsSubmitting(false);
        setTimeout(() => setSubmitStatus(null), 6000);
      });
  };

  const renderArr = (k) => {
    const arr = t(k, { returnObjects: true });
    return Array.isArray(arr) ? arr : [];
  };

  const selectedKey = courses.find((c) => c.id === selectedCourse)?.key || "reality";

  return (
    <div className="rm-form-page">
      <SEO
        title={lang === "he" ? "קורסי Revit" : "Revit Courses"}
        path="/form"
      />
      {/* HERO */}
      <section className="rm-form__hero">
        <motion.div
          className="rm-form__hero-bg"
          style={{ backgroundImage: "url('/images/hero-bg1.jpg')" }}
          initial={{ scale: 1.15 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.6, ease }}
        />
        <div className="rm-form__hero-veil" />
        <div className="rm-container rm-form__hero-inner">
          <motion.span
            className="rm-eyebrow rm-eyebrow--light"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease }}
          >
            Revit · {lang === "he" ? "קורסים מקצועיים" : "Professional Courses"}
          </motion.span>
          <h1 className="rm-form__hero-title">
            <RevealText delay={0.45}>{t("form.heroTitle")}</RevealText>
          </h1>
          <motion.p
            className="rm-form__hero-sub"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 1.1, ease }}
          >
            {t("form.heroSubtitle")}
          </motion.p>
        </div>
      </section>

      {/* CONTENT */}
      <div className="rm-form__content">
        {/* COURSE INFO */}
        <div className="rm-course-info">
          <motion.div
            className="rm-course-info__head"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.8, ease }}
          >
            <span className="rm-eyebrow">{lang === "he" ? "ארבעה מסלולים" : "Four Tracks"}</span>
            <h2>{t("form.infoHeading")}</h2>
          </motion.div>

          {/* Tabs */}
          <LayoutGroup>
            <div className="rm-tabs" role="tablist">
              {courses.map((c) => {
                const active = selectedCourse === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setSelectedCourse(c.id)}
                    className={`rm-tab ${active ? "is-active" : ""}`}
                  >
                    <span className="rm-tab__num">0{courses.indexOf(c) + 1}</span>
                    <span className="rm-tab__label">{t(`form.courses.${c.key}.label`)}</span>
                    {active && (
                      <motion.span
                        className="rm-tab__indicator"
                        layoutId="rm-tab-indicator"
                        transition={{ type: "spring", stiffness: 380, damping: 32 }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </LayoutGroup>

          {/* Panels */}
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedKey}
              className="rm-tab-panel"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5, ease }}
            >
              <CoursePanel courseKey={selectedKey} t={t} renderArr={renderArr} />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* FORM */}
        <motion.div
          className="rm-form-card"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.9, ease }}
        >
          <div className="rm-form-card__head">
            <span className="rm-form-card__step">01 / 01</span>
            <h3 className="rm-form-card__title">
              {lang === "he" ? "טופס הרשמה" : "Registration"}
            </h3>
            <p className="rm-form-card__sub">
              {lang === "he"
                ? "ניצור איתך קשר תוך 24 שעות לתאום שיחה."
                : "We'll be in touch within 24 hours to set up a call."}
            </p>
          </div>

          <form ref={form} onSubmit={sendEmail} className="rm-form">
            {/* Hidden fields populated automatically — used by EmailJS template */}
            <input type="hidden" name="subject" value={subjectLine} />
            <input type="hidden" name="course_label" value={courseLabel} />
            <input type="hidden" name="title" value={subjectLine} />
            <input type="hidden" name="from_name" value={registrantName || "RM Studio Site"} />
            <input type="hidden" name="reply_to" value="" id="reply_to_hidden" />

            <FloatingField
              id="name"
              name="name"
              required
              label={t("form.labels.name")}
              lang={lang}
              onChange={(e) => setRegistrantName(e.target.value)}
            />
            <div className="rm-form__row">
              <FloatingField id="email" name="email" type="email" required label={t("form.labels.email")} lang={lang} />
              <FloatingField id="phone" name="phone" type="tel" required label={t("form.labels.phone")} lang={lang} />
            </div>
            <FloatingSelect
              id="course"
              name="course"
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              label={t("form.labels.course")}
              lang={lang}
              options={courses.map((c) => ({
                value: c.id,
                label: t(`form.courses.${c.key}.label`),
              }))}
            />
            <FloatingField id="message" name="message" multiline label={t("form.labels.message")} lang={lang} />

            <MagneticButton>
              <button type="submit" className="rm-form__submit" disabled={isSubmitting}>
                <span>{isSubmitting ? t("form.submitting") : t("form.submit")}</span>
                <i aria-hidden>{isSubmitting ? "" : "→"}</i>
              </button>
            </MagneticButton>

            <AnimatePresence>
              {submitStatus === "success" && (
                <motion.div
                  className="rm-form__status rm-form__status--success"
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <SuccessCheck />
                  <span>{t("form.success")}</span>
                </motion.div>
              )}
              {submitStatus === "error" && (
                <motion.div
                  className="rm-form__status rm-form__status--error"
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <span>✗</span>
                  <span>{t("form.error")}</span>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </motion.div>
      </div>

      {/* FOOTER */}
      <div className="rm-form-page__footer">
        <div className="rm-container rm-form-page__footer-inner">
          <div className="rm-form-page__founder">
            <img src="/images/rasha.jpg" alt="Rasha Mansour" />
            <div>
              <h4>Rasha Mansour</h4>
              <p>{lang === "he" ? "מייסדת · RM Design Studio" : "Founder · RM Design Studio"}</p>
            </div>
          </div>
          <div className="rm-form-page__social">
            <a href="https://www.instagram.com/rmdesignstudio0" target="_blank" rel="noopener noreferrer">Instagram ↗</a>
            <a href="https://www.linkedin.com/in/rasha-mansour-731184204" target="_blank" rel="noopener noreferrer">LinkedIn ↗</a>
          </div>
        </div>
      </div>
    </div>
  );
}

function SuccessCheck() {
  return (
    <motion.svg
      className="rm-form__check"
      viewBox="0 0 52 52"
      initial="hidden"
      animate="visible"
    >
      <motion.circle
        cx="26" cy="26" r="24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        variants={{ hidden: { pathLength: 0 }, visible: { pathLength: 1 } }}
        transition={{ duration: 0.7, ease }}
      />
      <motion.path
        d="M14 27 l8 8 l16 -16"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        variants={{ hidden: { pathLength: 0 }, visible: { pathLength: 1 } }}
        transition={{ duration: 0.5, ease, delay: 0.5 }}
      />
    </motion.svg>
  );
}

function CoursePanel({ courseKey, t, renderArr }) {
  if (courseKey === "reality") {
    return (
      <>
        <h3>{t("form.courses.reality.title")}</h3>
        <p>{t("form.courses.reality.intro")}</p>
        <div className="rm-tab-panel__meta">
          <span>📆 {t("form.courses.reality.sessions")}</span>
          <span>🕐 {t("form.courses.reality.duration")}</span>
        </div>
        <h4>{t("form.courses.reality.learnHeading")}</h4>
        <ul>{renderArr("form.courses.reality.learn").map((it, i) => <li key={i}>{it}</li>)}</ul>
        <h4>{t("form.courses.reality.audienceHeading")}</h4>
        <ul>{renderArr("form.courses.reality.audience").map((it, i) => <li key={i}>{it}</li>)}</ul>
      </>
    );
  }
  if (courseKey === "officeDna") {
    return (
      <>
        <h3>{t("form.courses.officeDna.title")}</h3>
        <p><Trans i18nKey="form.courses.officeDna.intro" components={{ strong: <strong /> }} /></p>
        <p><Trans i18nKey="form.courses.officeDna.template" components={{ strong: <strong /> }} /></p>
        <h4>{t("form.courses.officeDna.templateHeading")}</h4>
        <ul>{renderArr("form.courses.officeDna.items").map((it, i) => <li key={i}>{it}</li>)}</ul>
        <p><Trans i18nKey="form.courses.officeDna.outro" components={{ strong: <strong /> }} /></p>
      </>
    );
  }
  if (courseKey === "careers") {
    return (
      <>
        <h3>{t("form.courses.careers.title")}</h3>
        <p>{t("form.courses.careers.intro")}</p>
        <div className="rm-tab-panel__meta">
          <span>📆 {t("form.courses.careers.sessions")}</span>
          <span>🕐 {t("form.courses.careers.duration")}</span>
        </div>
        <h4>{t("form.courses.careers.learnHeading")}</h4>
        <ul>{renderArr("form.courses.careers.learn").map((it, i) => <li key={i}>{it}</li>)}</ul>
        <p><Trans i18nKey="form.courses.careers.outro" components={{ strong: <strong /> }} /></p>
      </>
    );
  }
  return (
    <>
      <h3>{t("form.courses.personal.title")}</h3>
      <p>{t("form.courses.personal.intro")}</p>
      <h4>{t("form.courses.personal.tracksHeading")}</h4>
      <ul>{renderArr("form.courses.personal.tracks").map((it, i) => <li key={i}>{it}</li>)}</ul>
      <h4>{t("form.courses.personal.getHeading")}</h4>
      <ul>{renderArr("form.courses.personal.get").map((it, i) => <li key={i}>{it}</li>)}</ul>
      <h4>{t("form.courses.personal.audienceHeading")}</h4>
      <ul>{renderArr("form.courses.personal.audience").map((it, i) => <li key={i}>{it}</li>)}</ul>
    </>
  );
}

export default FormPage;
