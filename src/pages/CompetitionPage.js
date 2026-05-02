import React, { useRef } from "react";
import { useTranslation } from "react-i18next";
import { motion, useScroll, useTransform } from "framer-motion";
import RevealText from "../components/RevealText";
import SEO from "../components/SEO";
import "../styleSheets/CompetitionPage.css";

const ease = [0.22, 1, 0.36, 1];

function CompetitionPage() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language?.startsWith("he") ? "he" : "en";

  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroBgY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const heroBgScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);

  const galleryItems = [
    { src: "/images/zak1.jpg", alt: "Exterior view" },
    { src: "/images/zak2.jpg", alt: "Interior view" },
    { src: "/images/zak3.jpg", alt: "Gallery space" },
    { src: "/images/zak4.jpg", alt: "Design detail" },
  ];

  return (
    <div className="rm-comp">
      <SEO
        title={lang === "he" ? "תחרויות — Inspireli Awards 2021" : "Awards — Inspireli 2021"}
        path="/competition"
      />

      {/* HERO */}
      <section ref={heroRef} className="rm-comp__hero">
        <motion.div
          className="rm-comp__hero-bg"
          style={{
            y: heroBgY,
            scale: heroBgScale,
            backgroundImage: "url('/images/zak1.jpg')",
          }}
        />
        <div className="rm-comp__hero-veil" />
        <div className="rm-container rm-comp__hero-inner">
          <motion.div
            className="rm-comp__badge"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.3, ease }}
          >
            {t("competition.badge")}
          </motion.div>
          <h1 className="rm-comp__title">
            <RevealText delay={0.5}>{t("competition.title")}</RevealText>
          </h1>
          <motion.p
            className="rm-comp__sub"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 1.1, ease }}
          >
            {t("competition.subtitle")}
          </motion.p>
        </div>
      </section>

      {/* CONTENT */}
      <div className="rm-comp__content">
        <section className="rm-comp__overview">
          <div className="rm-container rm-comp__overview-grid">
            <motion.div
              className="rm-comp__text"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.9, ease }}
            >
              <div className="rm-comp__highlight">
                <p>{t("competition.highlight1")}</p>
                <p>{t("competition.highlight2")}</p>
              </div>

              <dl className="rm-comp__meta">
                <div>
                  <dt>{t("competition.locationHeading")}</dt>
                  <dd>{t("competition.location")}</dd>
                </div>
                <div>
                  <dt>{lang === "he" ? "שטח" : "Area"}</dt>
                  <dd>{t("competition.area")}</dd>
                </div>
                <div>
                  <dt>{lang === "he" ? "שנה" : "Year"}</dt>
                  <dd>{t("competition.year")}</dd>
                </div>
              </dl>

              <p className="rm-comp__body">{t("competition.body")}</p>
            </motion.div>

            <motion.div
              className="rm-comp__media"
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 1.1, ease }}
            >
              <video controls width="100%" poster="/images/zak1.jpg">
                <source src="/videos/zakriyat.mp4" type="video/mp4" />
              </video>
            </motion.div>
          </div>
        </section>

        {/* GALLERY */}
        <section className="rm-comp__gallery">
          <div className="rm-container">
            <div className="rm-comp__gallery-grid">
              {galleryItems.map((item, i) => (
                <motion.div
                  key={item.src}
                  className="rm-comp__gallery-item"
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.9, ease, delay: i * 0.08 }}
                >
                  <img src={item.src} alt={item.alt} loading="lazy" />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* FOOTER */}
      <div className="rm-comp__footer">
        <div className="rm-container rm-comp__footer-inner">
          <img src="/images/rasha.jpg" alt="Rasha Mansour" />
          <div className="rm-comp__footer-info">
            <h4>Rasha Mansour</h4>
            <p>{lang === "he" ? "מייסדת · RM Design Studio" : "Founder · RM Design Studio"}</p>
          </div>
          <div className="rm-comp__footer-social">
            <a href="https://www.instagram.com/rmdesignstudio0" target="_blank" rel="noopener noreferrer">Instagram ↗</a>
            <a href="https://www.linkedin.com/in/rasha-mansour-731184204" target="_blank" rel="noopener noreferrer">LinkedIn ↗</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CompetitionPage;
