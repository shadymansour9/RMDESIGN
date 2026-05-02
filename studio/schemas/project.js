export default {
  name: "project",
  title: "Project",
  type: "document",
  fields: [
    {
      name: "title",
      title: "Title",
      type: "localizedString",
      validation: (R) => R.required(),
    },
    {
      name: "slug",
      title: "Slug (URL)",
      type: "slug",
      options: { source: (doc) => doc?.title?.en || doc?.title?.he, maxLength: 96 },
      validation: (R) => R.required(),
    },
    {
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: [
          { title: "Residential", value: "residential" },
          { title: "Office", value: "office" },
          { title: "Commercial", value: "commercial" },
          { title: "Hospitality", value: "hospitality" },
        ],
        layout: "radio",
      },
    },
    {
      name: "year",
      title: "Year",
      type: "string",
    },
    {
      name: "area",
      title: "Area (sqm)",
      type: "number",
    },
    {
      name: "location",
      title: "Location",
      type: "localizedString",
    },
    {
      name: "coverImage",
      title: "Cover Image",
      type: "image",
      options: { hotspot: true },
      validation: (R) => R.required(),
    },
    {
      name: "description",
      title: "Description",
      type: "localizedText",
    },
    {
      name: "gallery",
      title: "Gallery",
      type: "array",
      of: [
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            { name: "alt", title: "Alt text", type: "string" },
          ],
        },
      ],
      options: { layout: "grid" },
    },
    {
      name: "videoUrl",
      title: "Video URL (optional)",
      type: "url",
    },
    {
      name: "order",
      title: "Display order",
      type: "number",
      description: "Lower numbers appear first",
      initialValue: 100,
    },
    {
      name: "featured",
      title: "Featured on home page?",
      type: "boolean",
      initialValue: false,
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
    select: {
      title: "title.en",
      subtitle: "category",
      media: "coverImage",
    },
  },
};
