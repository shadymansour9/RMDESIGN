/**
 * Default projects — used until the admin saves `siteContent/projects` in
 * Firestore, and as a fallback when Firebase is unreachable.
 *
 * Shape of one project:
 * {
 *   id: string,                 // stable id; old numeric ids kept so /projects/3 links still work
 *   slug: string,               // URL segment: /projects/<slug>
 *   title: { en, he },
 *   category: "residential" | "office" | "commercial" | "hospitality",
 *   year: string,
 *   area: number | "",          // m²
 *   location: { en, he },
 *   description: { en, he },
 *   cover: string,              // image URL
 *   gallery: [{ type: "image" | "video", src: string }],
 *   showOnHome: boolean,        // appears in the home-page marquee
 * }
 *
 * Array order = display order on /projects and on the home page.
 */

export const PROJECT_CATEGORIES = [
  { key: "residential", he: "מגורים", en: "Residential" },
  { key: "office", he: "משרדים", en: "Office" },
  { key: "commercial", he: "מסחרי", en: "Commercial" },
  { key: "hospitality", he: "אירוח", en: "Hospitality" },
];

const HAIFA = { en: "Haifa, Israel", he: "חיפה, ישראל" };
const EMPTY = { en: "", he: "" };

const img = (src) => ({ type: "image", src });
const vid = (src) => ({ type: "video", src });

export const DEFAULT_PROJECTS = [
  {
    id: "3",
    slug: "engineer-office",
    title: { en: "Engineer Office", he: "Engineer Office" },
    category: "office",
    year: "2024",
    area: 100,
    location: HAIFA,
    description: EMPTY,
    cover: "/images/villa1.jpg",
    gallery: [
      img("/images/3.jpg"), img("/images/4.4.jpg"), img("/images/4.jpg"), img("/images/44.jpg"),
      img("/images/444.jpg"), img("/images/4444.jpg"), img("/images/44444.jpg"), img("/images/444444.jpg"),
      vid("/videos/123.mp4"),
    ],
    showOnHome: true,
  },
  {
    id: "2",
    slug: "lawyers-office",
    title: { en: "Lawyer's Office", he: "Lawyer's Office" },
    category: "office",
    year: "2023",
    area: 30,
    location: HAIFA,
    description: EMPTY,
    cover: "/images/office1.jpg",
    gallery: [img("/images/A.jpg"), img("/images/BB.jpg"), img("/images/CC.jpg"), img("/images/DD.jpg")],
    showOnHome: true,
  },
  {
    id: "1",
    slug: "eh-house",
    title: { en: "E.H House", he: "E.H House" },
    category: "residential",
    year: "2023",
    area: 180,
    location: HAIFA,
    description: EMPTY,
    cover: "/images/E.H.jpg",
    gallery: [
      img("/images/A1.jpg"), img("/images/A2.jpg"), img("/images/A3.jpg"), img("/images/A4.jpg"),
      img("/images/A5.jpg"), img("/images/A6.jpg"), img("/images/A7.jpg"),
    ],
    showOnHome: true,
  },
  {
    id: "6",
    slug: "lobby-office",
    title: { en: "Lobby Office Design", he: "Lobby Office Design" },
    category: "commercial",
    year: "2024",
    area: 400,
    location: HAIFA,
    description: EMPTY,
    cover: "/images/LobbyOfficeDesign.jpg",
    gallery: [img("/images/LobbyOfficeDesign.jpg")],
    showOnHome: true,
  },
  {
    id: "5",
    slug: "n-restaurant",
    title: { en: "N — Restaurant", he: "N — Restaurant" },
    category: "hospitality",
    year: "2022",
    area: 200,
    location: HAIFA,
    description: EMPTY,
    cover: "/images/N-restaurant.jpg",
    gallery: [
      img("/images/A.1.jpg"), img("/images/B.1.jpg"), img("/images/C.1.jpg"), img("/images/D.1.jpg"),
      img("/images/E.jpg"), img("/images/F.jpg"), img("/images/G.jpg"), img("/images/H.jpg"),
      img("/images/I.jpg"), img("/images/J.jpg"),
    ],
    showOnHome: true,
  },
  {
    id: "4",
    slug: "mansour-house",
    title: { en: "Mansour's House", he: "Mansour's House" },
    category: "residential",
    year: "2022",
    area: 220,
    location: HAIFA,
    description: EMPTY,
    cover: "/images/mansour.jpg",
    gallery: [img("/images/mansour1.jpg"), img("/images/mansour2.jpg"), img("/images/mansour3.jpg")],
    showOnHome: true,
  },
];

/** Coerce whatever came from Firestore into the shape above (tolerant of old/partial docs). */
export function normalizeProject(raw, index = 0) {
  const p = raw || {};
  const loc = (v) => ({ en: v?.en || "", he: v?.he || "" });
  const gallery = (Array.isArray(p.gallery) ? p.gallery : [])
    .map((g) => (typeof g === "string" ? img(g) : g))
    .filter((g) => g && typeof g.src === "string" && g.src)
    .map((g) => ({ type: g.type === "video" ? "video" : "image", src: g.src }));

  return {
    id: String(p.id ?? `p${index}`),
    slug: String(p.slug || p.id || `project-${index + 1}`),
    title: loc(p.title),
    category: p.category || "residential",
    year: p.year ? String(p.year) : "",
    area: p.area === "" || p.area == null ? "" : Number(p.area) || "",
    location: loc(p.location),
    description: loc(p.description),
    cover: p.cover || gallery.find((g) => g.type === "image")?.src || "",
    gallery,
    showOnHome: p.showOnHome !== false,
  };
}

export function normalizeProjects(list) {
  return (Array.isArray(list) ? list : []).map(normalizeProject);
}

/** "Lawyer's Office" → "lawyers-office". Falls back to a short random id for non-Latin titles. */
export function slugify(text) {
  const s = String(text || "")
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return s || `project-${Math.random().toString(36).slice(2, 7)}`;
}

/** Pick the right language, falling back to the other one. */
export function pickLang(value, lang) {
  if (!value) return "";
  if (typeof value === "string") return value;
  return value[lang] || value[lang === "he" ? "en" : "he"] || "";
}
