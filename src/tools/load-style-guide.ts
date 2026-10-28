import { resolve } from "node:path";
import { PACKAGE_ROOT } from "../paths";
import type { LoadStyleGuideParams } from "../types";

const guideFiles = {
  diagram: "neurips2025_diagram_style_guide.md",
  plot: "neurips2025_plot_style_guide.md",
  rendering: "rendering_tool_guide.md",
} as const;

export const loadStyleGuideTool = {
  name: "load-style-guide",
  description:
    "Load a style guide document. Available guides: 'diagram' (NeurIPS 2025 diagram), 'plot' (NeurIPS 2025 plot), 'rendering' (rendering tool preferences and format conversion rules).",
  input: {
    type: "object",
    properties: {
      guide: {
        type: "string",
        enum: ["diagram", "plot", "rendering"],
        description: "Which style guide to load",
      },
    },
    required: ["guide"],
    additionalProperties: false,
  },
  execute: async (input: unknown) => {
    const args = input as LoadStyleGuideParams;
    const filePath = resolve(
      PACKAGE_ROOT,
      "resources/style_guides",
      guideFiles[args.guide],
    );

    return { content: await Bun.file(filePath).text() };
  },
};
