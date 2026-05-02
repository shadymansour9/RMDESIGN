export default {
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [
    {
      name: "studioName",
      title: "Studio name",
      type: "string",
      initialValue: "RM Design Studio",
    },
    {
      name: "tagline",
      title: "Tagline",
      type: "localizedString",
    },
    {
      name: "logo",
      title: "Logo",
      type: "image",
    },
    {
      name: "contactEmail",
      title: "Contact email",
      type: "string",
    },
    {
      name: "contactPhone",
      title: "Contact phone",
      type: "string",
    },
    {
      name: "address",
      title: "Address",
      type: "localizedString",
    },
    {
      name: "instagram",
      title: "Instagram URL",
      type: "url",
    },
    {
      name: "linkedin",
      title: "LinkedIn URL",
      type: "url",
    },
  ],
  preview: { prepare: () => ({ title: "Site Settings" }) },
};
