import { tool, type ToolDefinition } from "@opencode-ai/plugin/tool";
import type { PluginInput } from "@opencode-ai/plugin";

export function createRetrieveReferencesTool(
  _input: PluginInput,
): Record<string, ToolDefinition> {
  const retrieveReferences: ToolDefinition = tool({
    description:
      "Load reference image data for few-shot examples. Reads image files from disk and returns their file paths for the planner agent to use as visual references.",
    args: {
      imagePaths: tool.schema
        .array(tool.schema.string())
        .describe("File paths to reference images"),
      maxImages: tool.schema
        .number()
        .optional()
        .describe("Maximum number of images to load (default: 10)"),
    },
    execute: async (args, _context) => {
      const paths = args.imagePaths.slice(0, args.maxImages ?? 10);

      const references = await Promise.all(
        paths.map(async (path) => ({
          path,
          exists: await Bun.file(path).exists(),
        })),
      );

      return JSON.stringify({ references });
    },
  });

  return { "retrieve-references": retrieveReferences };
}
