import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { useTranslation, Trans } from "react-i18next";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion";

import RevealText from "../components/RevealText";
import Marquee from "../components/Marquee";
import MagneticButton from "../components/MagneticButton";
import Stats from "../components/Stats";
import ImageMarquee from "../components/ImageMarquee";
import Process from "../components/Process";
import SEO from "../components/SEO";

import "../styleSheets/HomePage.css";

const ease = [0.22, 1, 0.36, 1];

function HomePage() {
  const { t } = useTranslation();
  const reduced = useReducedMotion();

  /* ---------- Hero parallax ---------- */
  const heroRef = useRef(null);
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroBgY = useTransform(heroProgress, [0, 1], ["0%", reduced ? "0%" : "20%"]);
  const heroBgScale = useTransform(heroProgress, [0, 1], [1, reduced ? 1 : 1.18]);
  const heroFade = useTransform(heroProgress, [0, 1], [1, 0.35]);
  const heroVeil = useTransform(heroProgress, [0, 1], [0.4, 0.85]);

  /* ---------- Showcase + stats ---------- */
  const showcase = [
    { id: 3, title: t("projects.items.engineerOffice"), caption: t("projects.categories.office"), image: "/images/villa1.jpg", to: "/projects/3" },
    { id: 1, title: t("projects.items.ehHouse"), caption: t("projects.categories.residential"), image: "/images/E.H.jpg", to: "/projects/1" },
    { id: 5, title: t("projects.items.nRestaurant"), caption: t("projects.categories.hospitality"), image: "/images/N-restaurant.jpg", to: "/projects/5" },
    { id: 6, title: t("projects.items.lobbyOffice"), caption: t("projects.categories.commercial"), image: "/images/LobbyOfficeDesign.jpg", to: "/projects/6" },
    { id: 4, title: t("projects.items.mansourHouse"), caption: t("projects.categories.residential"), image: "/images/mansour.jpg", to: "/projects/4" },
    { id: 2, title: t("projects.items.lawyerOffice"), caption: t("projects.categories.office"), image: "/images/office1.jpg", to: "/projects/2" },
  ];

  const statsItems = [
    { value: 6, suffix: "+", label: t("home.statYearsLabel"), caption: t("home.statYearsCaption") },
    { value: 30, suffix: "+", label: t("home.statProjectsLabel"), caption: t("home.statProjectsCaption") },
    { value: 4, suffix: "", label: t("home.statDisciplinesLabel"), caption: t("home.statDisciplinesCaption") },
    { value: 100, suffix: "%", label: t("home.statHandcraftedLabel"), caption: t("home.statHandcraftedCaption") },
  ];

  const statsTitle = (
    <Trans i18nKey="home.statsTitle" components={{ em: <em /> }} />
  );

  return (
    <div className="rm-home">
      <SEO path="/" />
      {/* ============== HERO ============== */}
      <section ref={heroRef} className="rm-hero">
        <motion.div
          className="rm-hero__bg"
          style={{
            y: heroBgY,
            scale: heroBgScale,
            backgroundImage: "url('/images/hero-bg1.jpg')",
          }}
        />
        <motion.div className="rm-hero__veil" style={{ opacity: heroVeil }} />

        <motion.div className="rm-hero__inner" style={{ opacity: heroFade }}>
          <motion.span
            className="rm-hero__eyebrow"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease, delay: 0.4 }}
          >
            {t("home.heroEyebrow")}
          </motion.span>

          <h1 className="rm-hero__title">
            <RevealText delay={0.55} stagger={0.1}>{t("home.heroTitle1")}</RevealText>
            <RevealText
              as="span"
              className="is-italic"
              delay={0.7}
              stagger={0.1}
            >
              {t("home.heroTitle2")}
            </RevealText>
            <RevealText delay={0.85} stagger={0.1}>{t("home.heroTitle3")}</RevealText>
          </h1>

          <motion.p
            className="rm-hero__sub"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease, delay: 1.2 }}
          >
            {t("home.heroSubtitle")}
          </motion.p>

          <motion.div
            className="rm-hero__actions"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease, delay: 1.45 }}
          >
            <MagneticButton>
              <Link to="/projects" className="rm-btn rm-btn--ghost-light">
                <span>{t("home.heroProjectsBtn")}</span>
                <i aria-hidden>↗</i>
              </Link>
            </MagneticButton>
            <MagneticButton>
              <Link to="/form" className="rm-btn rm-btn--solid-light">
                <span>{t("home.heroBookBtn")}</span>
              </Link>
            </MagneticButton>
          </motion.div>
        </motion.div>

        <div className="rm-hero__bottom-marquee">
          <Marquee speed={45}>
            <span>Interior Architecture</span>
            <span className="rm-marquee__dot">●</span>
            <span>Residential</span>
            <span className="rm-marquee__dot">●</span>
            <span>Commercial</span>
            <span className="rm-marquee__dot">●</span>
            <span>Hospitality</span>
            <span className="rm-marquee__dot">●</span>
            <span>Revit Studio</span>
            <span className="rm-marquee__dot">●</span>
          </Marquee>
        </div>

        <motion.div
          className="rm-hero__meta"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.7 }}
        >
          <div className="rm-hero__signature">
            <span>RM</span>
            <em>Design Studio</em>
          </div>
          <div className="rm-hero__scroll">
            <span></span>
            {t("home.scroll")}
          </div>
        </motion.div>
      </section>

      {/* ============== MANIFESTO ============== */}
      <section className="rm-section rm-manifesto">
        <div className="rm-container">
          <div className="rm-manifesto__grid">
            <motion.div
              className="rm-manifesto__label"
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.9, ease }}
            >
              <span className="rm-eyebrow">{t("home.manifestoEyebrow")}</span>
              <p className="rm-manifesto__caption">{t("home.manifestoCaption")}</p>
            </motion.div>

            <h2 className="rm-manifesto__title">
              <RevealText mode="words" stagger={0.06}>
                {t("home.manifestoTitleText", {
                  defaultValue:
                    "Design is a connection between people, light and matter — where function meets emotion.",
                })}
              </RevealText>
            </h2>
          </div>
        </div>
      </section>

      {/* ============== PILLARS ============== */}
      <section className="rm-section rm-pillars">
        <div className="rm-container rm-pillars__grid">
          {[
            {
              num: "01",
              title: t("home.pillar1Title"),
              body: t("home.pillar1Body"),
              cta: t("home.pillar1Cta"),
              to: "/projects",
            },
            {
              num: "02",
              title: t("home.pillar2Title"),
              body: t("home.pillar2Body"),
              cta: t("home.pillar2Cta"),
              to: "/form",
            },
          ].map((p, i) => (
            <motion.article
              key={p.num}
              className="rm-pillar"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.9, ease, delay: i * 0.1 }}
            >
              <span className="rm-pillar__num">{p.num}</span>
              <h3>{p.title}</h3>
              <p>{p.body}</p>
              <Link to={p.to} className="rm-link-arrow">
                {p.cta} <span>→</span>
              </Link>
            </motion.article>
          ))}
        </div>
      </section>

      {/* ============== STATS ============== */}
      <Stats
        eyebrow={t("home.statsEyebrow")}
        title={statsTitle}
        items={statsItems}
      />

      {/* ============== IMAGE MARQUEE SHOWCASE ============== */}
      <section className="rm-section rm-showcase">
        <div className="rm-container rm-showcase__head">
          <span className="rm-eyebrow">{t("home.showcaseEyebrow")}</span>
          <h2 className="rm-showcase__title">{t("home.showcaseTitle")}</h2>
        </div>
        <ImageMarquee items={showcase} speed={55} />
      </section>

      {/* ============== PROCESS ============== */}
      <Process />

      {/* ============== CTA ============== */}
      <CtaSection t={t} />

      {/* ============== FOOTER ============== */}
      <footer className="rm-footer">
        <div className="rm-container rm-footer__inner">
          <div className="rm-footer__brand">
            <span className="rm-footer__mark">RM</span>
            <div>
              <h4>Rasha Mansour</h4>
              <p>{t("footer.founderRole")}</p>
            </div>
          </div>

          <div className="rm-footer__links">
            <Link to="/about">{t("footer.links.about")}</Link>
            <Link to="/projects">{t("footer.links.projects")}</Link>
            <Link to="/form">{t("footer.links.courses")}</Link>
            <Link to="/competition">{t("footer.links.competition")}</Link>
          </div>

          <div className="rm-footer__social">
            <a href="https://www.instagram.com/rmdesignstudio0" target="_blank" rel="noopener noreferrer">Instagram</a>
            <a href="https://www.linkedin.com/in/rasha-mansour-731184204" target="_blank" rel="noopener noreferrer">LinkedIn</a>
          </div>
        </div>
        <div className="rm-footer__base">
          <span>© {new Date().getFullYear()} {t("footer.rights")}</span>
          <span>{t("footer.location")}</span>
        </div>
      </footer>
    </div>
  );
}

function CtaSection({ t }) {
  const ref = useRef(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ["-10%", reduced ? "-10%" : "12%"]);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1.15, reduced ? 1.15 : 1]);

  return (
    <section ref={ref} className="rm-cta">
      <motion.div
        className="rm-cta__bg"
        style={{
          y: bgY,
          scale: bgScale,
          backgroundImage: "url('/images/cta-bg.jpg')",
        }}
      />
      <div className="rm-cta__veil" />
      <motion.div
        className="rm-container rm-cta__inner"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 1, ease }}
      >
        <span className="rm-eyebrow rm-cta__eyebrow">{t("home.ctaEyebrow")}</span>
        <h2>
          <RevealText>{t("home.ctaTitle1")}</RevealText>
          <br />
          <em>
            <RevealText delay={0.15}>{t("home.ctaTitle2")}</RevealText>
          </em>
        </h2>
        <p>{t("home.ctaBody")}</p>
        <div className="rm-cta__actions">
          <MagneticButton>
            <Link to="/form" className="rm-btn rm-btn--solid-light rm-btn--lg">
              {t("home.ctaBtn")}
            </Link>
          </MagneticButton>
        </div>
      </motion.div>
    </section>
  );
}

export default HomePage;
