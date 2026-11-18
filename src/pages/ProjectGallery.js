import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import RevealText from "../components/RevealText";
import MagneticButton from "../components/MagneticButton";
import SEO from "../components/SEO";
import useProjects, { findProject } from "../hooks/useProjects";
import { pickLang } from "../data/projectsDefaults";
import { optimizedUrl } from "../cloudinary";
import "../styleSheets/ProjectGallery.css";

const ease = [0.22, 1, 0.36, 1];

function ProjectGallery() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language?.startsWith("he") ? "he" : "en";
  const { id } = useParams();
  const navigate = useNavigate();

  /* ---------- Hero parallax ---------- */
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroBgY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const heroBgScale = useTransform(scrollYProgress, [0, 1], [1, 1.18]);

  /* ---------- Resolve project (by slug, or legacy numeric id) ---------- */
  const { projects: source, loading } = useProjects();
  const project = useMemo(() => {
    const p = findProject(source, id);
    if (!p) return null;
    return {
      id: p.id,
      slug: p.slug,
      title: pickLang(p.title, lang),
      category: p.category,
      year: p.year,
      area: p.area,
      location: pickLang(p.location, lang),
      coverImage: optimizedUrl(p.cover, 2400),
      gallery: p.gallery.map((g) =>
        g.type === "video"
          ? { type: "video", src: optimizedUrl(g.src) }
          : { type: "image", src: optimizedUrl(g.src, 1600), full: optimizedUrl(g.src, 2600) }
      ),
      description: pickLang(p.description, lang),
    };
  }, [source, id, lang]);

  const allProjects = useMemo(
    () => source.map((p) => ({ id: p.id, slug: p.slug, title: pickLang(p.title, lang) })),
    [source, lang]
  );

  /* ---------- Lightbox ---------- */
  const [lbIndex, setLbIndex] = useState(-1);
  const lightboxOpen = lbIndex >= 0;
  const galleryItems = project?.gallery || [];

  const openLb = (i) => setLbIndex(i);
  const closeLb = () => setLbIndex(-1);
  const nextLb = () => setLbIndex((i) => (i + 1) % galleryItems.length);
  const prevLb = () => setLbIndex((i) => (i - 1 + galleryItems.length) % galleryItems.length);

  useEffect(() => {
    if (!lightboxOpen) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") closeLb();
      if (e.key === "ArrowRight") nextLb();
      if (e.key === "ArrowLeft") prevLb();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lightboxOpen, galleryItems.length]);

  const categoryLabel = useMemo(() => {
    if (!project?.category) return "";
    const map = {
      residential: t("projects.categories.residential"),
      office: t("projects.categories.office"),
      commercial: t("projects.categories.commercial"),
      hospitality: t("projects.categories.hospitality"),
    };
    return map[project.category] || project.category;
  }, [project?.category, t]);

  /* ---------- Next project link ---------- */
  const nextProject = useMemo(() => {
    if (!project || allProjects.length === 0) return null;
    const idx = allProjects.findIndex((p) => p.id === project.id || p.slug === project.slug);
    if (idx < 0) return null;
    return allProjects[(idx + 1) % allProjects.length];
  }, [project, allProjects]);

  if (!project && loading) {
    return <div className="rm-pg__empty" aria-busy="true" />;
  }

  if (!project) {
    return (
      <div className="rm-pg__empty">
        <h2>{lang === "he" ? "פרויקט לא נמצא" : "Project not found"}</h2>
        <Link to="/projects" className="rm-link-arrow">
          {lang === "he" ? "חזרה לפרויקטים" : "Back to projects"} <span>→</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="rm-pg">
      <SEO
        title={project.title}
        path={`/projects/${project.slug || project.id}`}
        description={project.description}
        image={project.coverImage}
        type="article"
      />

      {/* HERO */}
      <section ref={heroRef} className="rm-pg__hero">
        {project.coverImage && (
          <motion.div
            className="rm-pg__hero-bg"
            style={{
              y: heroBgY,
              scale: heroBgScale,
              backgroundImage: `url(${project.coverImage})`,
            }}
          />
        )}
        <div className="rm-pg__hero-veil" />
        <div className="rm-container rm-pg__hero-inner">
          <motion.span
            className="rm-eyebrow rm-eyebrow--light"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease }}
          >
            {categoryLabel || t("projects.heroEyebrow")}
          </motion.span>
          <h1 className="rm-pg__title">
            <RevealText delay={0.45}>{project.title}</RevealText>
          </h1>
          <motion.div
            className="rm-pg__hero-meta"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 1.1, ease }}
          >
            {project.year && <span>{project.year}</span>}
            {project.location && <><span className="rm-pg__sep">·</span><span>{project.location}</span></>}
            {project.area && <><span className="rm-pg__sep">·</span><span>{project.area} m²</span></>}
          </motion.div>
        </div>
      </section>

      {/* OVERVIEW (sticky meta + description) */}
      <section className="rm-pg__overview">
        <div className="rm-container rm-pg__overview-grid">
          <aside className="rm-pg__aside">
            <dl className="rm-pg__meta">
              {categoryLabel && (
                <div>
                  <dt>{lang === "he" ? "קטגוריה" : "Category"}</dt>
                  <dd>{categoryLabel}</dd>
                </div>
              )}
              {project.year && (
                <div>
                  <dt>{lang === "he" ? "שנה" : "Year"}</dt>
                  <dd>{project.year}</dd>
                </div>
              )}
              {project.area && (
                <div>
                  <dt>{lang === "he" ? "שטח" : "Area"}</dt>
                  <dd>{project.area} m²</dd>
                </div>
              )}
              {project.location && (
                <div>
                  <dt>{lang === "he" ? "מיקום" : "Location"}</dt>
                  <dd>{project.location}</dd>
                </div>
              )}
            </dl>
          </aside>

          <motion.div
            className="rm-pg__description"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.9, ease }}
          >
            {project.description ? (
              project.description
                .split(/\n{2,}/)
                .map((para, i) => <p key={i}>{para}</p>)
            ) : (
              <p className="rm-pg__description--placeholder">
                {lang === "he"
                  ? "סדרה אדיטוריאלית של תמונות מהפרויקט. לחיצה על כל תמונה פותחת תצוגה מלאה."
                  : "An editorial series of photographs from the project. Click any image to view full-screen."}
              </p>
            )}
          </motion.div>
        </div>
      </section>

      {/* GALLERY MIXED GRID */}
      {galleryItems.length > 0 && (
        <section className="rm-pg__gallery">
          <div className="rm-container">
            <div className="rm-pg__grid">
              {galleryItems.map((item, i) => {
                const layoutClass = `rm-pg__tile rm-pg__tile--${i % 5}`;
                const isVideo = item.type === "video";
                return (
                  <motion.button
                    type="button"
                    key={`${i}-${item.src}`}
                    className={layoutClass}
                    onClick={() => openLb(i)}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.15 }}
                    transition={{ duration: 0.85, ease, delay: (i % 6) * 0.05 }}
                    data-cursor="hover"
                  >
                    {isVideo ? (
                      <>
                        <video src={item.src} muted playsInline preload="metadata" />
                        <span className="rm-pg__play" aria-hidden>▶</span>
                      </>
                    ) : (
                      <img src={item.src} alt={`${project.title} — ${i + 1}`} loading="lazy" />
                    )}
                  </motion.button>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* NEXT PROJECT */}
      {nextProject && (
        <section className="rm-pg__next">
          <div className="rm-container rm-pg__next-inner">
            <span className="rm-eyebrow">{lang === "he" ? "הפרויקט הבא" : "Next project"}</span>
            <Link
              to={`/projects/${nextProject.slug || nextProject.id}`}
              className="rm-pg__next-link"
            >
              <RevealText>{nextProject.title}</RevealText>
              <span className="rm-pg__next-arrow" aria-hidden>→</span>
            </Link>
            <div className="rm-pg__next-cta">
              <MagneticButton>
                <button
                  type="button"
                  onClick={() => navigate("/projects")}
                  className="rm-btn rm-btn--ghost-dark"
                >
                  {lang === "he" ? "כל הפרויקטים" : "All projects"}
                </button>
              </MagneticButton>
            </div>
          </div>
        </section>
      )}

      {/* LIGHTBOX */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            className="rm-lb"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            onClick={closeLb}
          >
            <button
              type="button"
              className="rm-lb__close"
              onClick={closeLb}
              aria-label={lang === "he" ? "סגירה" : "Close"}
            >×</button>
            <button
              type="button"
              className="rm-lb__nav rm-lb__nav--prev"
              onClick={(e) => { e.stopPropagation(); prevLb(); }}
              aria-label="Previous"
            >‹</button>
            <button
              type="button"
              className="rm-lb__nav rm-lb__nav--next"
              onClick={(e) => { e.stopPropagation(); nextLb(); }}
              aria-label="Next"
            >›</button>
            <span className="rm-lb__counter">
              {String(lbIndex + 1).padStart(2, "0")} / {String(galleryItems.length).padStart(2, "0")}
            </span>
            <motion.div
              key={lbIndex}
              className="rm-lb__media"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.45, ease }}
              onClick={(e) => e.stopPropagation()}
            >
              {(() => {
                const cur = galleryItems[lbIndex];
                if (!cur) return null;
                const isVideo = cur.type === "video";
                return isVideo ? (
                  <video src={cur.src} controls autoPlay />
                ) : (
                  <img src={cur.full || cur.src} alt={`${project.title} — ${lbIndex + 1}`} />
                );
              })()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default ProjectGallery;
