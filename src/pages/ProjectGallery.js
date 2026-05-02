import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { client, urlFor } from "../sanityClient";
import RevealText from "../components/RevealText";
import MagneticButton from "../components/MagneticButton";
import SEO from "../components/SEO";
import "../styleSheets/ProjectGallery.css";

const ease = [0.22, 1, 0.36, 1];

/* ---------- Local fallback (used if Sanity not configured) ---------- */
const localGallery = {
  1: ["/images/A1.jpg", "/images/A2.jpg", "/images/A3.jpg", "/images/A4.jpg", "/images/A5.jpg", "/images/A6.jpg", "/images/A7.jpg"],
  2: ["/images/A.jpg", "/images/BB.jpg", "/images/CC.jpg", "/images/DD.jpg"],
  3: [
    "/images/3.jpg", "/images/4.4.jpg", "/images/4.jpg", "/images/44.jpg",
    "/images/444.jpg", "/images/4444.jpg", "/images/44444.jpg", "/images/444444.jpg",
    { type: "video", src: "/videos/123.mp4" }
  ],
  4: ["/images/mansour1.jpg", "/images/mansour2.jpg", "/images/mansour3.jpg"],
  5: ["/images/A.1.jpg", "/images/B.1.jpg", "/images/C.1.jpg", "/images/D.1.jpg", "/images/E.jpg", "/images/F.jpg", "/images/G.jpg", "/images/H.jpg", "/images/I.jpg", "/images/J.jpg"],
  6: ["/images/LobbyOfficeDesign.jpg"]
};
const localMeta = {
  1: { titleKey: "projects.items.ehHouse", category: "residential", year: "2023", area: 180, slug: "eh-house", cover: "/images/E.H.jpg" },
  2: { titleKey: "projects.items.lawyerOffice", category: "office", year: "2023", area: 30, slug: "lawyers-office", cover: "/images/office1.jpg" },
  3: { titleKey: "projects.items.engineerOffice", category: "office", year: "2024", area: 100, slug: "engineer-office", cover: "/images/villa1.jpg" },
  4: { titleKey: "projects.items.mansourHouse", category: "residential", year: "2022", area: 220, slug: "mansour-house", cover: "/images/mansour.jpg" },
  5: { titleKey: "projects.items.nRestaurant", category: "hospitality", year: "2022", area: 200, slug: "n-restaurant", cover: "/images/N-restaurant.jpg" },
  6: { titleKey: "projects.items.lobbyOffice", category: "commercial", year: "2024", area: 400, slug: "lobby-office", cover: "/images/LobbyOfficeDesign.jpg" }
};

function ProjectGallery() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language?.startsWith("he") ? "he" : "en";
  const { id } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [allProjects, setAllProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ---------- Hero parallax ---------- */
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroBgY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const heroBgScale = useTransform(scrollYProgress, [0, 1], [1, 1.18]);

  /* ---------- Load ---------- */
  useEffect(() => {
    let cancelled = false;

    const pickLocale = (val) => {
      if (!val) return "";
      if (typeof val === "string") return val;
      return val[lang] || val.en || val.he || "";
    };

    const buildLocal = () => {
      const numericId = parseInt(id, 10);
      const slugMatch = Object.entries(localMeta).find(([, m]) => m.slug === id);
      const found = slugMatch
        ? { numericId: parseInt(slugMatch[0], 10), meta: slugMatch[1] }
        : (localMeta[numericId] && { numericId, meta: localMeta[numericId] });
      if (!found) return null;

      return {
        id: String(found.numericId),
        slug: found.meta.slug,
        title: t(found.meta.titleKey),
        category: found.meta.category,
        year: found.meta.year,
        area: found.meta.area,
        location: lang === "he" ? "חיפה, ישראל" : "Haifa, Israel",
        coverImage: found.meta.cover,
        gallery: localGallery[found.numericId] || [],
        description: "",
      };
    };

    const buildLocalAll = () =>
      Object.entries(localMeta).map(([nid, m]) => ({
        id: String(nid),
        slug: m.slug,
        title: t(m.titleKey),
      }));

    if (!process.env.REACT_APP_SANITY_PROJECT_ID) {
      const local = buildLocal();
      const allLocal = buildLocalAll();
      if (!cancelled) {
        setProject(local);
        setAllProjects(allLocal);
        setLoading(false);
      }
      return () => {};
    }

    setLoading(true);

    // Try by slug first (preferred), then by _id, then fall back to local.
    const queryBySlug = `*[_type == "project" && slug.current == $key][0]{
      _id, title, description, "slug": slug.current, category, year, area, location,
      coverImage, gallery, videoUrl
    }`;
    const queryById = `*[_type == "project" && _id == $key][0]{
      _id, title, description, "slug": slug.current, category, year, area, location,
      coverImage, gallery, videoUrl
    }`;
    const queryAll = `*[_type == "project"] | order(order asc, _createdAt desc){
      _id, title, "slug": slug.current
    }`;

    Promise.all([
      client.fetch(queryBySlug, { key: id }).then((doc) => doc || client.fetch(queryById, { key: id })),
      client.fetch(queryAll),
    ])
      .then(([doc, all]) => {
        if (cancelled) return;
        if (doc) {
          const galleryArr = Array.isArray(doc.gallery) ? doc.gallery : [];
          const galleryUrls = galleryArr
            .map((item) => (item?.asset ? urlFor(item).width(1600).url() : null))
            .filter(Boolean);
          if (doc.videoUrl) galleryUrls.push({ type: "video", src: doc.videoUrl });

          setProject({
            id: doc._id,
            slug: doc.slug,
            title: pickLocale(doc.title),
            description: pickLocale(doc.description),
            category: doc.category,
            year: doc.year,
            area: doc.area,
            location: pickLocale(doc.location),
            coverImage: doc.coverImage ? urlFor(doc.coverImage).width(2000).url() : null,
            gallery: galleryUrls,
          });
        } else {
          setProject(buildLocal());
        }

        const allMapped = (Array.isArray(all) && all.length > 0)
          ? all.map((p) => ({
              id: p._id,
              slug: p.slug,
              title: pickLocale(p.title),
            }))
          : buildLocalAll();
        setAllProjects(allMapped);
      })
      .catch((err) => {
        console.warn("[Sanity] gallery fetch failed:", err.message);
        if (!cancelled) {
          setProject(buildLocal());
          setAllProjects(buildLocalAll());
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id, lang, t]);

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

  /* ---------- Render states ---------- */
  if (loading) {
    return (
      <div className="rm-pg__loading">
        <span className="rm-pg__spinner" />
        <p>{lang === "he" ? "טוען פרויקט..." : "Loading project..."}</p>
      </div>
    );
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
              <p>{project.description}</p>
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
                const isVideo = typeof item === "object" && item?.type === "video";
                return (
                  <motion.button
                    type="button"
                    key={`${i}-${typeof item === "string" ? item : item.src}`}
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
                      <img src={item} alt={`${project.title} — ${i + 1}`} loading="lazy" />
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
                const isVideo = typeof cur === "object" && cur?.type === "video";
                return isVideo ? (
                  <video src={cur.src} controls autoPlay />
                ) : (
                  <img src={cur} alt={`${project.title} — ${lbIndex + 1}`} />
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
