/* eslint-disable no-console */
/**
 * Seed script — uploads the 6 existing projects to Sanity.
 *
 * Usage:
 *   1. Create an API token at:
 *        https://www.sanity.io/manage/project/3t85kpzl/api  (Tokens → Add API token)
 *      Permissions: "Editor". Copy the token (shown only once).
 *   2. Add it to .env.local in the project root:
 *        SANITY_API_TOKEN=skXXXXX...
 *   3. Run from the project root:
 *        npm run seed:projects
 *
 * Behavior:
 *   - Idempotent: skips projects whose slug already exists in the dataset.
 *   - Uploads images from public/images/ as Sanity image assets.
 *   - Logs ✅ Created / ⏭ Skipped / ❌ Failed per project, plus a final summary.
 */

require("dotenv").config({ path: ".env.local" });

const fs = require("fs");
const path = require("path");
const { createClient } = require("@sanity/client");

const PROJECT_ID = process.env.REACT_APP_SANITY_PROJECT_ID || "3t85kpzl";
const DATASET = process.env.REACT_APP_SANITY_DATASET || "production";
const TOKEN = process.env.SANITY_API_TOKEN;

if (!TOKEN) {
  console.error("\n❌ Missing SANITY_API_TOKEN in .env.local");
  console.error(
    "   Create one at: https://www.sanity.io/manage/project/" +
      PROJECT_ID +
      "/api  (Tokens → Add API token)\n"
  );
  process.exit(1);
}

const client = createClient({
  projectId: PROJECT_ID,
  dataset: DATASET,
  apiVersion: "2024-01-01",
  token: TOKEN,
  useCdn: false,
});

/**
 * NOTE on schema types:
 * The Studio schema uses `localizedString` / `localizedText` (in
 * studio/schemas/). The script writes inline objects with those _type
 * markers so Studio renders them correctly. If you renamed the schema,
 * adjust here.
 */

const projects = [
  {
    slug: "engineer-office",
    titleEn: "Engineer Office",
    titleHe: "משרד מהנדס",
    descEn:
      "A modern engineering office where precision meets warmth. Clean architectural lines and a refined material palette create a workspace that elevates focus and craftsmanship.",
    descHe:
      "משרד מהנדס מודרני שבו דיוק טכני פוגש חמימות חומרית. קווים אדריכליים נקיים ולוח חומרים מוקפד יוצרים סביבת עבודה שמעצימה ריכוז ויצירתיות.",
    category: "office",
    year: "2024",
    order: 1,
    image: "villa1.jpg",
  },
  {
    slug: "lawyers-office",
    titleEn: "Lawyer's Office",
    titleHe: "משרד עורכי דין",
    descEn:
      "A boutique legal office balancing authority and discretion. Custom millwork, layered lighting and earth-tone surfaces shape a refined atmosphere for client meetings and focused work.",
    descHe:
      "משרד עורכי דין בוטיקי המשלב סמכותיות ועידון. נגרות מותאמת אישית, תאורה רב-שכבתית ומשטחים בגוון אדמה מעצבים אווירה מוקפדת לפגישות לקוחות ולעבודה ממוקדת.",
    category: "office",
    year: "2023",
    order: 2,
    image: "office1.jpg",
  },
  {
    slug: "eh-house",
    titleEn: "E.H House",
    titleHe: "בית E.H.",
    descEn:
      "A private residence rooted in heritage and reimagined for contemporary living. Original architectural elements are preserved alongside modern interventions, creating a home where memory and modernity coexist.",
    descHe:
      "בית פרטי המעוגן במורשת ומתורגם לחיים עכשוויים. אלמנטים אדריכליים מקוריים נשמרים לצד התערבויות מודרניות, ויוצרים בית שבו זיכרון ועכשווי שוכנים יחד.",
    category: "residential",
    year: "2023",
    order: 3,
    image: "E.H.jpg",
  },
  {
    slug: "lobby-office",
    titleEn: "Lobby Office Design",
    titleHe: "עיצוב לובי משרדי",
    descEn:
      "A signature corporate lobby designed as a brand statement. Sculptural lighting, layered textures and a confident scale set the tone for everyone who walks in.",
    descHe:
      "לובי משרדי שעוצב כהצהרת מותג. תאורה פיסולית, טקסטורות רב-שכבתיות וקנה מידה בטוח נותנים את הטון לכל מי שצועד פנימה.",
    category: "commercial",
    year: "2024",
    order: 4,
    image: "LobbyOfficeDesign.jpg",
  },
  {
    slug: "n-restaurant",
    titleEn: "N Restaurant",
    titleHe: "מסעדת N",
    descEn:
      "A hospitality space where atmosphere is the first course. Soft warm lighting, tactile surfaces and considered acoustics create an intimate setting for unhurried dining.",
    descHe:
      "חלל אירוח שבו האווירה היא המנה הראשונה. תאורה רכה וחמה, משטחים מזמינים למגע ואקוסטיקה מתחשבת יוצרים סביבה אינטימית לארוחה ללא חיפזון.",
    category: "hospitality",
    year: "2022",
    order: 5,
    image: "N-restaurant.jpg",
  },
  {
    slug: "mansour-house",
    titleEn: "Mansour House",
    titleHe: "בית מנסור",
    descEn:
      "A private family home built around connection — open volumes, generous natural light, and a calm material palette of stone, timber and linen. Spaces flow effortlessly from public to private.",
    descHe:
      "בית פרטי שתוכנן סביב חיבור — נפחים פתוחים, אור טבעי נדיב ולוח חומרים שקט של אבן, עץ ופשתן. החללים זורמים בטבעיות מהאזור הציבורי אל הפרטי.",
    category: "residential",
    year: "2022",
    order: 6,
    image: "mansour.jpg",
  },
];

async function slugExists(slug) {
  const result = await client.fetch(
    `count(*[_type == "project" && slug.current == $slug])`,
    { slug }
  );
  return result > 0;
}

async function uploadImage(filename) {
  const imagePath = path.join(__dirname, "..", "public", "images", filename);
  if (!fs.existsSync(imagePath)) {
    throw new Error(`Image not found: ${imagePath}`);
  }
  const buffer = fs.readFileSync(imagePath);
  return client.assets.upload("image", buffer, { filename });
}

async function seed() {
  console.log("\n────────────────────────────────────────────");
  console.log(`  Sanity project: ${PROJECT_ID}`);
  console.log(`  Dataset:        ${DATASET}`);
  console.log(`  Seeding ${projects.length} projects`);
  console.log("────────────────────────────────────────────\n");

  let created = 0;
  let skipped = 0;
  let failed = 0;

  for (const p of projects) {
    const label = `${p.titleEn} (${p.slug})`;

    try {
      if (await slugExists(p.slug)) {
        console.log(`⏭  Skipped (already exists): ${label}`);
        skipped += 1;
        continue;
      }

      const filePath = path.join(__dirname, "..", "public", "images", p.image);
      if (!fs.existsSync(filePath)) {
        throw new Error(`Image file not found: public/images/${p.image}`);
      }

      console.log(`📷 Uploading image: ${p.image}`);
      const asset = await uploadImage(p.image);

      const doc = {
        _type: "project",
        title: { _type: "localizedString", en: p.titleEn, he: p.titleHe },
        description: { _type: "localizedText", en: p.descEn, he: p.descHe },
        slug: { _type: "slug", current: p.slug },
        category: p.category,
        year: p.year,
        order: p.order,
        coverImage: {
          _type: "image",
          asset: { _type: "reference", _ref: asset._id },
        },
      };

      const result = await client.create(doc);
      console.log(`✅ Created: ${p.titleEn}  →  ${result._id}\n`);
      created += 1;
    } catch (err) {
      console.error(`❌ Failed: ${label} — ${err.message}\n`);
      failed += 1;
    }
  }

  console.log("────────────────────────────────────────────");
  console.log("                  Summary");
  console.log("────────────────────────────────────────────");
  console.log(`✅ Created:  ${created}`);
  console.log(`⏭  Skipped:  ${skipped}`);
  if (failed) console.log(`❌ Failed:   ${failed}`);
  console.log(
    `\nView in Studio → http://localhost:3333/structure/project\n`
  );
}

seed().catch((err) => {
  console.error("\n❌ Seed crashed:", err);
  process.exit(1);
});
