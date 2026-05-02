export default {
  name: "course",
  title: "Course",
  type: "document",
  fields: [
    {
      name: "label",
      title: "Course label (tab name)",
      type: "localizedString",
      validation: (R) => R.required(),
    },
    {
      name: "slug",
      title: "Slug (used in form value)",
      type: "slug",
      options: { source: (doc) => doc?.label?.en || doc?.label?.he, maxLength: 64 },
      validation: (R) => R.required(),
    },
    {
      name: "title",
      title: "Full title",
      type: "localizedString",
    },
    {
      name: "intro",
      title: "Intro paragraph",
      type: "localizedText",
    },
    {
      name: "sessions",
      title: "Sessions (e.g. 14 sessions)",
      type: "localizedString",
    },
    {
      name: "duration",
      title: "Session duration",
      type: "localizedString",
    },
    {
      name: "price",
      title: "Price (optional, free text)",
      type: "localizedString",
    },
    {
      name: "learnHeading",
      title: "\"What you'll learn\" heading",
      type: "localizedString",
    },
    {
      name: "learn",
      title: "What you'll learn",
      type: "object",
      fields: [
        { name: "en", title: "English bullets", type: "array", of: [{ type: "string" }] },
        { name: "he", title: "עברית bullets", type: "array", of: [{ type: "string" }] },
      ],
    },
    {
      name: "audienceHeading",
      title: "\"Who is it for\" heading",
      type: "localizedString",
    },
    {
      name: "audience",
      title: "Target audience bullets",
      type: "object",
      fields: [
        { name: "en", title: "English bullets", type: "array", of: [{ type: "string" }] },
        { name: "he", title: "עברית bullets", type: "array", of: [{ type: "string" }] },
      ],
    },
    {
      name: "outro",
      title: "Outro / closing line",
      type: "localizedText",
    },
    {
      name: "order",
      title: "Display order",
      type: "number",
      initialValue: 100,
    },
    {
      name: "active",
      title: "Show on site?",
      type: "boolean",
      initialValue: true,
    },
  ],
  orderings: [
    {
      title: "Display order",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
  preview: {
    select: { title: "label.en", subtitle: "label.he" },
  },
};
