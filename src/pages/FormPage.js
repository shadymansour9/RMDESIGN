import React, { useEffect, useRef, useState } from "react";
import emailjs from "emailjs-com";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import RevealText from "../components/RevealText";
import MagneticButton from "../components/MagneticButton";
import SEO from "../components/SEO";
import CountdownTimer from "../components/CountdownTimer";
import useFormContent from "../hooks/useFormContent";
import { pickLocale } from "../data/formDefaults";
import "../styleSheets/FormPage.css";

const ease = [0.22, 1, 0.36, 1];

/* ---------- Floating-label inputs ---------- */
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

/* ---------- Main page ---------- */
function FormPage() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language?.startsWith("he") ? "he" : "en";
  const form = useRef();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [registrantName, setRegistrantName] = useState("");

  const { content } = useFormContent();
  const courses = Array.isArray(content.courses) ? content.courses : [];

  // Selected course id — kept in sync with the courses array.
  const [selectedId, setSelectedId] = useState(courses[0]?.id || "");

  useEffect(() => {
    if (courses.length === 0) {
      if (selectedId) setSelectedId("");
      return;
    }
    if (!courses.find((c) => c.id === selectedId)) {
      setSelectedId(courses[0].id);
    }
  }, [courses, selectedId]);

  const selectedCourse = courses.find((c) => c.id === selectedId) || null;
  const courseLabel = pickLocale(selectedCourse?.label, lang) || selectedId;

  const subjectLine = registrantName
    ? `🎓 הרשמה חדשה: ${registrantName} — ${courseLabel}`
    : `🎓 הרשמה חדשה לקורס: ${courseLabel}`;

  /* =========================================
     EmailJS + Google Apps Script — DO NOT MODIFY
     ========================================= */
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
  /* ========================================= */

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
            <RevealText delay={0.45}>{pickLocale(content.hero?.title, lang)}</RevealText>
          </h1>
          <motion.p
            className="rm-form__hero-sub"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 1.1, ease }}
          >
            {pickLocale(content.hero?.subtitle, lang)}
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
            <span className="rm-eyebrow">
              {courses.length > 0
                ? (lang === "he" ? `${courses.length} מסלולים` : `${courses.length} tracks`)
                : (lang === "he" ? "מסלולים" : "Tracks")}
            </span>
            <h2>{pickLocale(content.infoHeading, lang)}</h2>
          </motion.div>

          {courses.length === 0 ? (
            <div className="rm-tab-panel">
              <p>
                {lang === "he"
                  ? "אין קורסים זמינים כרגע. ניצור איתך קשר כשהמחזור הבא ייפתח."
                  : "No courses available right now. We'll be in touch when the next cohort opens."}
              </p>
            </div>
          ) : (
            <>
              {/* Tabs — dynamic from courses array */}
              <LayoutGroup>
                <div className="rm-tabs" role="tablist">
                  {courses.map((c, i) => {
                    const active = selectedId === c.id;
                    return (
                      <button
                        key={c.id}
                        type="button"
                        role="tab"
                        aria-selected={active}
                        onClick={() => setSelectedId(c.id)}
                        className={`rm-tab ${active ? "is-active" : ""}`}
                      >
                        <span className="rm-tab__num">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="rm-tab__label">
                          {pickLocale(c.label, lang)}
                        </span>
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

              {/* Panel — generic renderer */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedId}
                  className="rm-tab-panel"
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.5, ease }}
                >
                  <CoursePanel course={selectedCourse} lang={lang} />
                </motion.div>
              </AnimatePresence>
            </>
          )}
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
              {lang === "he" ? "לקבלת כל הפרטים על הקורס " : "To receive all the details about the course"}
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
            {courses.length > 0 && (
              <FloatingSelect
                id="course"
                name="course"
                value={selectedId}
                onChange={(e) => setSelectedId(e.target.value)}
                label={t("form.labels.course")}
                lang={lang}
                options={courses.map((c) => ({
                  value: c.id,
                  label: pickLocale(c.label, lang),
                }))}
              />
            )}
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

      {/* TESTIMONIALS */}
      <TestimonialsSection items={content.testimonials} lang={lang} t={t} />

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
            <a href="https://www.instagram.com/rasha_designstudio_?igsh=aW9kNHV0Z3RkajNu" target="_blank" rel="noopener noreferrer">Instagram ↗</a>
            <a href="https://www.linkedin.com/in/rasha-mansour-731184204" target="_blank" rel="noopener noreferrer">LinkedIn ↗</a>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Testimonials section ---------- */
function TestimonialsSection({ items, lang, t }) {
  const list = Array.isArray(items) ? items.filter(Boolean) : [];
  if (list.length === 0) return null;

  return (
    <section className="rm-testimonials">
      <div className="rm-container">
        <motion.header
          className="rm-testimonials__head"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8, ease }}
        >
          <span className="rm-eyebrow">{t("form.testimonials.eyebrow")}</span>
          <h2 className="rm-testimonials__title">
            <RevealText>{t("form.testimonials.title")}</RevealText>
          </h2>
        </motion.header>

        <div className="rm-testimonials__grid">
          {list.map((tst, i) => {
            const quote = pickLocale(tst?.quote, lang);
            if (!quote && !tst?.name) return null;
            return (
              <motion.figure
                key={tst.id || i}
                className="rm-testimonial"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.8, ease, delay: i * 0.08 }}
              >
                <div className="rm-testimonial__mark" aria-hidden>"</div>
                {quote && <blockquote className="rm-testimonial__quote">{quote}</blockquote>}
                <figcaption className="rm-testimonial__author">
                  {tst.name && <span className="rm-testimonial__name">{tst.name}</span>}
                  {tst.course && <span className="rm-testimonial__course">{tst.course}</span>}
                </figcaption>
              </motion.figure>
            );
          })}
        </div>
      </div>
    </section>
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

/* ---------- Generic course panel ---------- */
function CourseCountdown({ countdown, lang }) {
  if (!countdown) return null;
  return (
    <CountdownTimer
      variant="panel"
      enabled={Boolean(countdown.enabled)}
      targetISO={countdown.targetISO}
      label={pickLocale(countdown.label, lang)}
      lang={lang}
    />
  );
}

function CoursePanel({ course, lang }) {
  if (!course) return null;

  const pl = (v) => pickLocale(v, lang);
  const introText = pl(course.intro);
  const introParagraphs = introText
    ? introText.split(/\n\s*\n+/).map((s) => s.trim()).filter(Boolean)
    : [];

  const sessions = pl(course.sessions);
  const duration = pl(course.duration);
  const hasMeta = Boolean(sessions || duration);

  const sections = Array.isArray(course.sections) ? course.sections : [];

  return (
    <>
      <CourseCountdown countdown={course.countdown} lang={lang} />

      <h3>{pl(course.title)}</h3>

      {introParagraphs.map((para, i) => (
        // HTML allowed in intro for inline emphasis (e.g. <strong>)
        // eslint-disable-next-line react/no-danger
        <p key={i} dangerouslySetInnerHTML={{ __html: para }} />
      ))}

      {hasMeta && (
        <div className="rm-tab-panel__meta">
          {sessions && <span>📆 {sessions}</span>}
          {duration && <span>🕐 {duration}</span>}
        </div>
      )}

      {sections.map((section, idx) => {
        const heading = pl(section?.heading);
        const items = Array.isArray(section?.items?.[lang])
          ? section.items[lang]
          : (Array.isArray(section?.items?.en) ? section.items.en : []);

        if (!heading && items.length === 0) return null;
        return (
          <React.Fragment key={idx}>
            {heading && <h4>{heading}</h4>}
            {items.length > 0 && (
              <ul>
                {items.map((it, i) => <li key={i}>{it}</li>)}
              </ul>
            )}
          </React.Fragment>
        );
      })}
    </>
  );
}

export default FormPage;
