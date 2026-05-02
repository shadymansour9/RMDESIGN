import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import RevealText from "../components/RevealText";
import MagneticButton from "../components/MagneticButton";
import SEO from "../components/SEO";
import "../styleSheets/Projects.css";

const ease = [0.22, 1, 0.36, 1];

function ProjectsPage() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language?.startsWith("he") ? "he" : "en";

  const projects = useMemo(() => ([
    { id: 3, slug: "engineer-office", title: t("projects.items.engineerOffice"), categoryKey: "office", year: "2024", image: "/images/villa1.jpg" },
    { id: 2, slug: "lawyers-office", title: t("projects.items.lawyerOffice"), categoryKey: "office", year: "2023", image: "/images/office1.jpg" },
    { id: 1, slug: "eh-house", title: t("projects.items.ehHouse"), categoryKey: "residential", year: "2023", image: "/images/E.H.jpg" },
    { id: 6, slug: "lobby-office", title: t("projects.items.lobbyOffice"), categoryKey: "commercial", year: "2024", image: "/images/LobbyOfficeDesign.jpg" },
    { id: 5, slug: "n-restaurant", title: t("projects.items.nRestaurant"), categoryKey: "hospitality", year: "2022", image: "/images/N-restaurant.jpg" },
    { id: 4, slug: "mansour-house", title: t("projects.items.mansourHouse"), categoryKey: "residential", year: "2022", image: "/images/mansour.jpg" },
  ]), [t]);

  const [filter, setFilter] = useState("all");

  const categories = [
    { key: "all", label: lang === "he" ? "הכל" : "All" },
    { key: "residential", label: t("projects.categories.residential") },
    { key: "office", label: t("projects.categories.office") },
    { key: "commercial", label: t("projects.categories.commercial") },
    { key: "hospitality", label: t("projects.categories.hospitality") },
  ];

  const counts = useMemo(() => {
    const out = { all: projects.length };
    projects.forEach((p) => {
      out[p.categoryKey] = (out[p.categoryKey] || 0) + 1;
    });
    return out;
  }, [projects]);

  const filtered = filter === "all"
    ? projects
    : projects.filter((p) => p.categoryKey === filter);

  const categoryLabel = (key) => {
    const map = {
      residential: t("projects.categories.residential"),
      office: t("projects.categories.office"),
      commercial: t("projects.categories.commercial"),
      hospitality: t("projects.categories.hospitality"),
    };
    return map[key] || key || "";
  };

  /* Re-run reveal observers as filter changes the rendered set */
  useEffect(() => {
    const fadeElements = document.querySelectorAll(".fade-in");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("visible");
        });
      },
      { threshold: 0.1 }
    );
    fadeElements.forEach((el) => observer.observe(el));
    return () => fadeElements.forEach((el) => observer.unobserve(el));
  }, [filter]);

  return (
    <div className="rm-projects">
      <SEO
        title={lang === "he" ? "פרויקטים" : "Projects"}
        path="/projects"
      />

      {/* HERO */}
      <section className="rm-projects__hero">
        <motion.div
          className="rm-projects__hero-bg"
          style={{ backgroundImage: "url('/images/hero-bg1.jpg')" }}
          initial={{ scale: 1.15 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.6, ease }}
        />
        <div className="rm-projects__hero-veil" />
        <div className="rm-container rm-projects__hero-inner">
          <motion.span
            className="rm-eyebrow rm-eyebrow--light"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease }}
          >
            {t("projects.heroEyebrow")}
          </motion.span>
          <h1>
            <RevealText delay={0.45}>{t("projects.heroTitle1")}</RevealText>{" "}
            <em>
              <RevealText delay={0.6}>{t("projects.heroTitle2")}</RevealText>
            </em>
          </h1>
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 1.1, ease }}
          >
            {t("projects.heroBody")}
          </motion.p>
        </div>
      </section>

      {/* FILTER BAR */}
      <section className="rm-projects__filter-wrap">
        <div className="rm-container">
          <LayoutGroup>
            <div className="rm-filter">
              {categories.map((c) => {
                const active = filter === c.key;
                const n = counts[c.key] || 0;
                return (
                  <button
                    key={c.key}
                    onClick={() => setFilter(c.key)}
                    className={`rm-filter__btn ${active ? "is-active" : ""}`}
                    type="button"
                  >
                    <span className="rm-filter__label">{c.label}</span>
                    <span className="rm-filter__count">{String(n).padStart(2, "0")}</span>
                    {active && (
                      <motion.span
                        className="rm-filter__indicator"
                        layoutId="rm-filter-indicator"
                        transition={{ type: "spring", stiffness: 380, damping: 32 }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </LayoutGroup>
        </div>
      </section>

      {/* GRID */}
      <section className="rm-projects__list">
        <div className="rm-container">
          {filtered.length === 0 ? (
            <div className="rm-projects__state">
              <p>{lang === "he" ? "אין פרויקטים בקטגוריה הזאת." : "No projects in this category."}</p>
            </div>
          ) : (
            <LayoutGroup>
              <motion.div className="rm-projects__grid" layout>
                <AnimatePresence mode="popLayout">
                  {filtered.map((p, i) => (
                    <motion.div
                      layout
                      key={p.id}
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.7, ease, delay: i * 0.06 }}
                      className="rm-project-wrap"
                    >
                      <Link
                        to={`/projects/${p.slug || p.id}`}
                        className="rm-project"
                        data-cursor="hover"
                      >
                        <div className="rm-project__media">
                          {p.image ? (
                            <img src={p.image} alt={p.title} loading="lazy" />
                          ) : (
                            <div className="rm-project__placeholder" />
                          )}
                          <div className="rm-project__hover-info">
                            <span className="rm-project__hover-cat">
                              {categoryLabel(p.categoryKey)}
                            </span>
                            <span className="rm-project__hover-cta">
                              {t("projects.viewProject")} <i aria-hidden>↗</i>
                            </span>
                          </div>
                        </div>
                        <div className="rm-project__meta">
                          <div className="rm-project__head">
                            <h3>{p.title}</h3>
                            <span className="rm-project__num">
                              {String(i + 1).padStart(2, "0")}
                            </span>
                          </div>
                          <div className="rm-project__sub">
                            <span>{categoryLabel(p.categoryKey)}</span>
                            {p.year && (
                              <>
                                <span className="rm-project__dot" />
                                <span>{p.year}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            </LayoutGroup>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="rm-projects__cta">
        <div className="rm-container rm-projects__cta-inner">
          <span className="rm-eyebrow">{t("projects.ctaEyebrow")}</span>
          <h2>
            <RevealText>{t("projects.ctaTitle1")}</RevealText>{" "}
            <em>
              <RevealText delay={0.15}>{t("projects.ctaTitle2")}</RevealText>
            </em>
          </h2>
          <MagneticButton>
            <Link to="/form" className="rm-btn rm-btn--solid-dark rm-btn--lg">
              {t("projects.ctaBtn")}
            </Link>
          </MagneticButton>
        </div>
      </section>
    </div>
  );
}

export default ProjectsPage;
