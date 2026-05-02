export default {
  name: "localizedString",
  title: "Localized text (short)",
  type: "object",
  fields: [
    { name: "en", title: "English", type: "string" },
    { name: "he", title: "עברית (Hebrew)", type: "string" },
  ],
  preview: {
    select: { en: "en", he: "he" },
    prepare({ en, he }) {
      return {
        title: en || he || "(empty)",
        subtitle: he ? `HE: ${he}` : "",
      };
    },
  },
};
