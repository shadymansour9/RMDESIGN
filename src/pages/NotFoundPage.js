import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import RevealText from "../components/RevealText";
import MagneticButton from "../components/MagneticButton";
import SEO from "../components/SEO";
import "../styleSheets/NotFoundPage.css";

const ease = [0.22, 1, 0.36, 1];

function NotFoundPage() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language?.startsWith("he") ? "he" : "en";

  return (
    <div className="rm-404">
      <SEO
        title={lang === "he" ? "הדף לא נמצא" : "Page not found"}
        path="/404"
        description={lang === "he" ? "הדף שחיפשת לא קיים." : "The page you're looking for doesn't exist."}
      />

      <div className="rm-404__inner">
        <motion.span
          className="rm-eyebrow"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease }}
        >
          Error · 404
        </motion.span>

        <h1 className="rm-404__big">
          <RevealText delay={0.4}>404</RevealText>
        </h1>

        <h2 className="rm-404__title">
          <RevealText delay={0.6}>
            {lang === "he" ? "הדף הזה לא קיים." : "This page doesn't exist."}
          </RevealText>
        </h2>

        <motion.p
          className="rm-404__sub"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.1, ease }}
        >
          {lang === "he"
            ? "ייתכן שהקישור ישן, או שהקלדת כתובת לא נכונה. בואו נחזיר אותך לאתר."
            : "The link may be outdated or mistyped. Let's get you back."}
        </motion.p>

        <motion.div
          className="rm-404__actions"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.3, ease }}
        >
          <MagneticButton>
            <Link to="/" className="rm-btn rm-btn--solid-dark">
              {lang === "he" ? "חזרה לעמוד הבית" : "Back to home"}
            </Link>
          </MagneticButton>
          <MagneticButton>
            <Link to="/projects" className="rm-btn rm-btn--ghost-dark">
              {lang === "he" ? "ראה פרויקטים" : "View projects"}
            </Link>
          </MagneticButton>
        </motion.div>
      </div>
    </div>
  );
}

export default NotFoundPage;
