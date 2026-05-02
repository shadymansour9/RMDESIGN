import { useEffect, useState } from "react";
import { client, isSanityConfigured } from "../lib/sanity";

/**
 * Generic GROQ query hook with graceful fallback when Sanity isn't configured.
 *
 * @param {string} query  GROQ query
 * @param {object} params Query params
 * @param {any}    fallback Returned when Sanity isn't configured or query errors
 */
export function useSanityData(query, params = {}, fallback = null) {
  const [data, setData] = useState(fallback);
  const [loading, setLoading] = useState(isSanityConfigured);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isSanityConfigured) {
      setData(fallback);
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    client
      .fetch(query, params)
      .then((result) => {
        if (!cancelled) {
          setData(result ?? fallback);
          setError(null);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          console.warn("[Sanity] query failed, using fallback:", err.message);
          setData(fallback);
          setError(err);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, JSON.stringify(params)]);

  return { data, loading, error };
}

/* =========================
   Ready-to-use queries
   ========================= */

export const QUERIES = {
  allProjects: `*[_type == "project"] | order(order asc) {
    _id,
    title,
    "slug": slug.current,
    category,
    year,
    area,
    location,
    description,
    coverImage,
    gallery,
    featured,
    order
  }`,
  featuredProjects: `*[_type == "project" && featured == true] | order(order asc) [0...3] {
    _id,
    title,
    "slug": slug.current,
    category,
    coverImage
  }`,
  projectBySlug: `*[_type == "project" && slug.current == $slug][0] {
    _id, title, "slug": slug.current, category, year, area, location,
    description, coverImage, gallery, videoUrl
  }`,
  allCourses: `*[_type == "course" && active == true] | order(order asc) {
    _id, label, "slug": slug.current, title, intro, sessions, duration, price,
    learnHeading, learn, audienceHeading, audience, outro
  }`,
  homePage: `*[_type == "homePage"][0]`,
  aboutPage: `*[_type == "aboutPage"][0]`,
  siteSettings: `*[_type == "siteSettings"][0]`,
};
