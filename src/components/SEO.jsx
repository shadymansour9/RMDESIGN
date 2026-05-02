import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";

const DEFAULTS = {
  siteName: "RM Design Studio",
  baseUrl: "https://rmdesignstudio.com",
  ogImage: "/images/og-image.jpg",
};

/**
 * Per-page SEO. Title falls back to studio name, description per language.
 */
export default function SEO({
  title,
  description,
  image,
  path = "",
  type = "website",
}) {
  const { i18n } = useTranslation();
  const lang = i18n.language?.startsWith("he") ? "he" : "en";
  const fullTitle = title ? `${title} · ${DEFAULTS.siteName}` : DEFAULTS.siteName;
  const url = `${DEFAULTS.baseUrl}${path}`;
  const ogImage = image || DEFAULTS.ogImage;
  const ogImageUrl = ogImage.startsWith("http") ? ogImage : `${DEFAULTS.baseUrl}${ogImage}`;

  const fallbackDesc =
    lang === "he"
      ? "סטודיו לעיצוב פנים ואדריכלות בחיפה — תכנון מדויק, חשיבה אסתטית וקורסי Revit מקצועיים."
      : "Interior design and architecture studio in Haifa — precise planning, refined aesthetics, and professional Revit courses.";
  const desc = description || fallbackDesc;

  return (
    <Helmet>
      <html lang={lang} dir={lang === "he" ? "rtl" : "ltr"} />
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      <link rel="canonical" href={url} />

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={DEFAULTS.siteName} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={ogImageUrl} />
      <meta property="og:locale" content={lang === "he" ? "he_IL" : "en_US"} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={desc} />
      <meta name="twitter:image" content={ogImageUrl} />
    </Helmet>
  );
}
