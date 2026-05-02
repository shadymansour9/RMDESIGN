/* eslint-disable no-console */
/**
 * Delete test/dummy projects from Sanity.
 *
 * Matches projects whose Hebrew or English title contains:
 *   "בדיקה", "test", "razer", "demo", "dummy"
 * (case-insensitive).
 *
 * Run from project root:
 *   npm run delete:test
 */

require("dotenv").config({ path: ".env.local" });

const { createClient } = require("@sanity/client");

const PROJECT_ID = process.env.REACT_APP_SANITY_PROJECT_ID || "3t85kpzl";
const DATASET = process.env.REACT_APP_SANITY_DATASET || "production";
const TOKEN = process.env.SANITY_API_TOKEN;

if (!TOKEN) {
  console.error("\n❌ Missing SANITY_API_TOKEN in .env.local\n");
  process.exit(1);
}

const client = createClient({
  projectId: PROJECT_ID,
  dataset: DATASET,
  apiVersion: "2024-01-01",
  token: TOKEN,
  useCdn: false,
});

const PATTERNS = ["בדיקה", "test", "razer", "demo", "dummy"];

const matchesTestPattern = (text) => {
  if (!text) return false;
  const lower = String(text).toLowerCase();
  return PATTERNS.some((p) => lower.includes(p.toLowerCase()));
};

async function main() {
  console.log("\n────────────────────────────────────────────");
  console.log("  Looking for test/dummy projects to delete");
  console.log("────────────────────────────────────────────\n");

  const all = await client.fetch(`*[_type == "project"]{
    _id, title, "slug": slug.current
  }`);

  console.log(`Found ${all.length} project(s) total.\n`);

  const candidates = all.filter((p) => {
    const en = p.title?.en || "";
    const he = p.title?.he || "";
    const slug = p.slug || "";
    return matchesTestPattern(en) || matchesTestPattern(he) || matchesTestPattern(slug);
  });

  if (candidates.length === 0) {
    console.log("✓ No test projects found. All clean.\n");
    console.log("Existing projects:");
    all.forEach((p) => {
      console.log(`  • ${p._id}  —  ${p.title?.en || p.title?.he || "(untitled)"}`);
    });
    console.log();
    return;
  }

  console.log(`Will delete ${candidates.length} project(s):`);
  candidates.forEach((p) => {
    console.log(
      `  🗑  ${p._id}  —  ${p.title?.en || p.title?.he || "(untitled)"}  [${p.slug || "no-slug"}]`
    );
  });
  console.log();

  let deleted = 0;
  let failed = 0;
  for (const p of candidates) {
    try {
      await client.delete(p._id);
      console.log(`  ✅ Deleted: ${p.title?.en || p.title?.he}`);
      deleted += 1;
    } catch (err) {
      console.error(`  ❌ Failed:  ${p._id} — ${err.message}`);
      failed += 1;
    }
  }

  console.log("\n────────────────────────────────────────────");
  console.log(`  Deleted: ${deleted}`);
  if (failed) console.log(`  Failed:  ${failed}`);
  console.log("────────────────────────────────────────────\n");
}

main().catch((err) => {
  console.error("\n❌ Script crashed:", err);
  process.exit(1);
});
