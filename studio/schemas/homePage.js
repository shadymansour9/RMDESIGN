export default {
  name: "homePage",
  title: "Home Page",
  type: "document",
  // Singleton — only one document of this type should exist.
  fields: [
    {
      name: "heroImage",
      title: "Hero background image",
      type: "image",
      options: { hotspot: true },
    },
    {
      name: "heroEyebrow",
      title: "Hero eyebrow (small text above title)",
      type: "localizedString",
    },
    {
      name: "heroTitle1",
      title: "Hero title – word 1",
      type: "localizedString",
    },
    {
      name: "heroTitle2",
      title: "Hero title – word 2 (italic)",
      type: "localizedString",
    },
    {
      name: "heroTitle3",
      title: "Hero title – word 3",
      type: "localizedString",
    },
    {
      name: "heroSubtitle",
      title: "Hero subtitle",
      type: "localizedText",
    },
    {
      name: "manifestoEyebrow",
      title: "Manifesto eyebrow",
      type: "localizedString",
    },
    {
      name: "manifestoCaption",
      title: "Manifesto caption",
      type: "localizedText",
    },
    {
      name: "manifestoTitle",
      title: "Manifesto title",
      type: "localizedText",
      description: "Use <em>...</em> for italic emphasis.",
    },
    {
      name: "pillar1Title",
      title: "Pillar 1 — title",
      type: "localizedString",
    },
    {
      name: "pillar1Body",
      title: "Pillar 1 — body",
      type: "localizedText",
    },
    {
      name: "pillar2Title",
      title: "Pillar 2 — title",
      type: "localizedString",
    },
    {
      name: "pillar2Body",
      title: "Pillar 2 — body",
      type: "localizedText",
    },
    {
      name: "ctaImage",
      title: "CTA background image",
      type: "image",
      options: { hotspot: true },
    },
    {
      name: "ctaTitle1",
      title: "CTA title — line 1",
      type: "localizedString",
    },
    {
      name: "ctaTitle2",
      title: "CTA title — line 2 (italic)",
      type: "localizedString",
    },
    {
      name: "ctaBody",
      title: "CTA body",
      type: "localizedText",
    },
  ],
  preview: {
    prepare: () => ({ title: "Home Page" }),
  },
};
