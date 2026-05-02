import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import en from "./locales/en.json";
import he from "./locales/he.json";

const STORAGE_KEY = "rm-lang";

const applyDocumentLanguage = (lng) => {
  const dir = lng === "he" ? "rtl" : "ltr";
  document.documentElement.setAttribute("lang", lng);
  document.documentElement.setAttribute("dir", dir);
  document.body.setAttribute("dir", dir);
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      he: { translation: he },
    },
    fallbackLng: "en",
    supportedLngs: ["en", "he"],
    interpolation: { escapeValue: false },
    detection: {
      order: ["localStorage", "navigator"],
      lookupLocalStorage: STORAGE_KEY,
      caches: ["localStorage"],
    },
  });

applyDocumentLanguage(i18n.language || "en");

i18n.on("languageChanged", (lng) => {
  applyDocumentLanguage(lng);
});

export default i18n;
