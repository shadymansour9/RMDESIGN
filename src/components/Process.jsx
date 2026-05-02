import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslation, Trans } from "react-i18next";
import "./Process.css";

const ease = [0.22, 1, 0.36, 1];

export default function Process() {
  const { t } = useTranslation();
  const [active, setActive] = useState(0);

  const steps = [
    { num: "01", title: t("home.process1Title"), body: t("home.process1Body") },
    { num: "02", title: t("home.process2Title"), body: t("home.process2Body") },
    { num: "03", title: t("home.process3Title"), body: t("home.process3Body") },
    { num: "04", title: t("home.process4Title"), body: t("home.process4Body") },
  ];

  return (
    <section className="rm-process">
      <div className="rm-container">
        <motion.header
          className="rm-process__head"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.9, ease }}
        >
          <span className="rm-eyebrow">{t("home.processEyebrow")}</span>
          <h2 className="rm-process__title">
            <Trans i18nKey="home.processTitle" components={{ em: <em /> }} />
          </h2>
        </motion.header>

        <ol className="rm-process__list">
          {steps.map((s, i) => {
            const isActive = i === active;
            return (
              <motion.li
                key={s.num}
                className={`rm-process__item ${isActive ? "is-active" : ""}`}
                onMouseEnter={() => setActive(i)}
                onClick={() => setActive(i)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setActive(i);
                  }
                }}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.8, ease, delay: i * 0.06 }}
              >
                <div className="rm-process__num">{s.num}</div>
                <div className="rm-process__content">
                  <h3 className="rm-process__step-title">{s.title}</h3>
                  <p className="rm-process__body">{s.body}</p>
                </div>
                <div className="rm-process__dot" aria-hidden />
              </motion.li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
