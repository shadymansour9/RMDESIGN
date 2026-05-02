import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "../styleSheets/Navbar.css";

function Navbar() {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  const lang = i18n.language?.startsWith("he") ? "he" : "en";
  const isHe = lang === "he";

  const menuItems = [
    { path: "/", label: t("nav.home") },
    { path: "/about", label: t("nav.about") },
    { path: "/projects", label: t("nav.projects") },
    { path: "/competition", label: t("nav.competition") },
    { path: "/form", label: t("nav.courses") },
  ];

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 900) setIsOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isActive = (path) =>
    location.pathname === path ? "active" : "";

  const toggleLang = () => {
    i18n.changeLanguage(isHe ? "en" : "he");
  };

  return (
    <nav
      className={`rm-navbar ${scrolled ? "is-scrolled" : ""} ${isOpen ? "is-open" : ""} rm-navbar--${lang}`}
    >
      <div className="rm-navbar__inner">
        <Link to="/" className="rm-navbar__brand" aria-label="RM Design Studio">
          <span className="rm-navbar__mark">RM</span>
          <span className="rm-navbar__wordmark">
            <span className="rm-navbar__name">{t("nav.studio")}</span>
            <span className="rm-navbar__tag">{t("nav.tag")}</span>
          </span>
        </Link>

        <ul className="rm-navbar__menu">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link to={item.path} className={isActive(item.path)}>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="rm-navbar__right">
          <button
            type="button"
            onClick={toggleLang}
            className="rm-navbar__lang"
            aria-label={t("lang.label")}
            title={isHe ? t("lang.switchToEn") : t("lang.switchToHe")}
          >
            <span className={`rm-navbar__lang-opt ${!isHe ? "is-active" : ""}`}>EN</span>
            <span className="rm-navbar__lang-sep" aria-hidden>·</span>
            <span className={`rm-navbar__lang-opt ${isHe ? "is-active" : ""}`}>עב</span>
          </button>

          <Link to="/form" className="rm-navbar__cta">
            {t("nav.cta")}
          </Link>
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="rm-navbar__toggle"
          aria-label={t("nav.menu")}
          aria-expanded={isOpen}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      <div className={`rm-navbar__mobile ${isOpen ? "open" : ""}`}>
        <ul>
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link to={item.path} className={isActive(item.path)}>
                {item.label}
              </Link>
            </li>
          ))}
          <li>
            <Link to="/form" className="rm-navbar__mobile-cta">
              {t("nav.cta")} →
            </Link>
          </li>
          <li>
            <button
              type="button"
              onClick={toggleLang}
              className="rm-navbar__mobile-lang"
            >
              {isHe ? "Switch to English" : "עבור לעברית"}
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
