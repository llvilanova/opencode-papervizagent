import type { RetrieveReferencesParams } from "../types";

export const retrieveReferencesTool = {
  name: "retrieve-references",
  description:
    "Load reference image data for few-shot examples. Reads image files from disk and returns their file paths for the planner agent to use as visual references.",
  input: {
    type: "object",
    properties: {
      imagePaths: {
        type: "array",
        items: { type: "string" },
        description: "File paths to reference images",
      },
      maxImages: {
        type: "number",
        description: "Maximum number of images to load (default: 10)",
      },
    },
    required: ["imagePaths"],
    additionalProperties: false,
  },
  execute: async (input: unknown) => {
    const args = input as RetrieveReferencesParams;
    const paths = args.imagePaths.slice(0, args.maxImages ?? 10);

    const references = await Promise.all(
      paths.map(async (path) => ({
        path,
        exists: await Bun.file(path).exists(),
      })),
    );

    return { content: JSON.stringify({ references }) };
  },
};
