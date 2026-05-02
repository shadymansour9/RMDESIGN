import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { useTranslation, Trans } from "react-i18next";
import { motion, useScroll, useTransform } from "framer-motion";
import RevealText from "../components/RevealText";
import MagneticButton from "../components/MagneticButton";
import SEO from "../components/SEO";
import "../styleSheets/AboutPage.css";

const ease = [0.22, 1, 0.36, 1];

function AboutPage() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language?.startsWith("he") ? "he" : "en";

  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroBgY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const heroBgScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);

  const disciplines = [
    { num: "01", title: t("about.disc1Title"), body: t("about.disc1Body") },
    { num: "02", title: t("about.disc2Title"), body: t("about.disc2Body") },
    { num: "03", title: t("about.disc3Title"), body: t("about.disc3Body") },
    { num: "04", title: t("about.disc4Title"), body: t("about.disc4Body") },
  ];

  return (
    <div className="rm-about">
      <SEO
        title={lang === "he" ? "אודות הסטודיו" : "About the Studio"}
        path="/about"
        description={
          lang === "he"
            ? "RM Design Studio – סטודיו לעיצוב פנים ואדריכלות בחיפה. רשא מנסור, מעצבת פנים."
            : "RM Design Studio — interior design and architecture studio in Haifa. Founded by Rasha Mansour."
        }
      />

      {/* HERO */}
      <section ref={heroRef} className="rm-about__hero">
        <motion.div
          className="rm-about__hero-bg"
          style={{
            y: heroBgY,
            scale: heroBgScale,
            backgroundImage: "url('/images/hero-bg1.jpg')",
          }}
        />
        <div className="rm-about__hero-veil" />
        <div className="rm-container rm-about__hero-inner">
          <motion.span
            className="rm-eyebrow rm-eyebrow--light"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease }}
          >
            {t("about.heroEyebrow")}
          </motion.span>
          <h1>
            <RevealText delay={0.45}>{t("about.heroTitle1")}</RevealText>{" "}
            <em>
              <RevealText delay={0.6}>{t("about.heroTitleEm")}</RevealText>
            </em>
            <br />
            <RevealText delay={0.85}>{t("about.heroTitle2")}</RevealText>
          </h1>
        </div>
      </section>

      {/* INTRO */}
      <section className="rm-about__intro">
        <div className="rm-container rm-about__intro-grid">
          <motion.div
            className="rm-about__intro-side"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.9, ease }}
          >
            <span className="rm-eyebrow">{t("about.introEyebrow")}</span>
            <p className="rm-about__quote">{t("about.introQuote")}</p>
          </motion.div>

          <motion.div
            className="rm-about__intro-body"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.9, ease, delay: 0.1 }}
          >
            <p>
              <Trans i18nKey="about.introP1" components={{ strong: <strong /> }} />
            </p>
            <p>{t("about.introP2")}</p>
            <p>{t("about.introP3")}</p>
          </motion.div>
        </div>
      </section>

      {/* DISCIPLINES */}
      <section className="rm-about__process">
        <div className="rm-container">
          <motion.header
            className="rm-about__process-head"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.9, ease }}
          >
            <span className="rm-eyebrow">{t("about.disciplinesEyebrow")}</span>
            <h2>
              <RevealText>{t("about.disciplinesTitle1")}</RevealText>{" "}
              <em>
                <RevealText delay={0.15}>{t("about.disciplinesTitleEm")}</RevealText>
              </em>
            </h2>
          </motion.header>

          <div className="rm-about__process-grid">
            {disciplines.map((d, i) => (
              <motion.article
                key={d.num}
                className="rm-discipline"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.8, ease, delay: i * 0.08 }}
              >
                <span className="rm-discipline__num">{d.num}</span>
                <h3>{d.title}</h3>
                <p>{d.body}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* FOUNDER */}
      <section className="rm-about__founder">
        <div className="rm-container rm-about__founder-grid">
          <motion.div
            className="rm-about__founder-image"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1.1, ease }}
          >
            <img src="/images/rasha.jpg" alt="Rasha Mansour" />
            <span className="rm-about__founder-tag">{t("about.founderTagFounder")}</span>
          </motion.div>

          <motion.div
            className="rm-about__founder-body"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.9, ease, delay: 0.15 }}
          >
            <span className="rm-eyebrow">{t("about.founderEyebrow")}</span>
            <h2>
              <RevealText>{t("about.founderName1")}</RevealText>{" "}
              <em>
                <RevealText delay={0.15}>{t("about.founderNameEm")}</RevealText>
              </em>
            </h2>
            <p className="rm-about__founder-role">{t("about.founderRole")}</p>
            <p>
              <Trans i18nKey="about.founderBio" components={{ em: <em /> }} />
            </p>
            <div className="rm-about__founder-social">
              <a href="https://www.instagram.com/rmdesignstudio0" target="_blank" rel="noopener noreferrer">
                Instagram <span>↗</span>
              </a>
              <a href="https://www.linkedin.com/in/rasha-mansour-731184204" target="_blank" rel="noopener noreferrer">
                LinkedIn <span>↗</span>
              </a>
            </div>
            <MagneticButton>
              <Link to="/form" className="rm-btn rm-btn--solid-dark rm-about__founder-cta">
                {t("about.founderCta")}
              </Link>
            </MagneticButton>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

export default AboutPage;
