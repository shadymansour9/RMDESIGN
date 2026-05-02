import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { schemaTypes } from "./schemas";

/**
 * Sanity Studio config — RM Design Studio
 * Replace projectId with the ID from sanity.io/manage after running:
 *   npm create sanity@latest -- --project rmdesignstudio --dataset production
 * or after initializing manually.
 */
export default defineConfig({
  name: "rmdesignstudio",
  title: "RM Design Studio",
  projectId: process.env.SANITY_STUDIO_PROJECT_ID || "3t85kpzl",
  dataset: process.env.SANITY_STUDIO_DATASET || "production",

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Content")
          .items([
            S.listItem()
              .title("Site Settings")
              .child(
                S.document()
                  .schemaType("siteSettings")
                  .documentId("siteSettings")
              ),
            S.listItem()
              .title("Home Page")
              .child(
                S.document()
                  .schemaType("homePage")
                  .documentId("homePage")
              ),
            S.listItem()
              .title("About Page")
              .child(
                S.document()
                  .schemaType("aboutPage")
                  .documentId("aboutPage")
              ),
            S.divider(),
            S.documentTypeListItem("project").title("Projects"),
            S.documentTypeListItem("course").title("Courses"),
          ]),
    }),
  ],

  schema: { types: schemaTypes },
});
