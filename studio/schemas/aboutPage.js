export default {
  name: "aboutPage",
  title: "About Page",
  type: "document",
  fields: [
    {
      name: "heroImage",
      title: "Hero image",
      type: "image",
      options: { hotspot: true },
    },
    {
      name: "heroEyebrow",
      title: "Hero eyebrow",
      type: "localizedString",
    },
    {
      name: "heroTitle",
      title: "Hero title",
      type: "localizedText",
      description: "Use <em>...</em> for italic emphasis.",
    },
    {
      name: "introQuote",
      title: "Intro quote",
      type: "localizedText",
    },
    {
      name: "introBody",
      title: "Intro body (paragraphs)",
      type: "object",
      fields: [
        { name: "en", title: "English (paragraphs)", type: "array", of: [{ type: "block" }] },
        { name: "he", title: "עברית (פסקאות)", type: "array", of: [{ type: "block" }] },
      ],
    },
    {
      name: "founderImage",
      title: "Founder photo",
      type: "image",
      options: { hotspot: true },
    },
    {
      name: "founderName",
      title: "Founder name",
      type: "localizedString",
    },
    {
      name: "founderRole",
      title: "Founder role / credentials",
      type: "localizedString",
    },
    {
      name: "founderBio",
      title: "Founder bio",
      type: "localizedText",
    },
  ],
  preview: { prepare: () => ({ title: "About Page" }) },
};
