import { resolve } from "node:path";
import { tool, type ToolDefinition } from "@opencode-ai/plugin/tool";
import type { PluginInput } from "@opencode-ai/plugin";

const guideFiles = {
  diagram: "neurips2025_diagram_style_guide.md",
  plot: "neurips2025_plot_style_guide.md",
  rendering: "rendering_tool_guide.md",
} as const;

export function createLoadStyleGuideTool(
  _input: PluginInput,
): Record<string, ToolDefinition> {
  const loadStyleGuide: ToolDefinition = tool({
    description:
      "Load a style guide document. Available guides: 'diagram' (NeurIPS 2025 diagram), 'plot' (NeurIPS 2025 plot), 'rendering' (rendering tool preferences and format conversion rules).",
    args: {
      guide: tool.schema
        .enum(["diagram", "plot", "rendering"])
        .describe("Which style guide to load"),
    },
    execute: async (args, _context) => {
      const filename = guideFiles[args.guide];
      const filePath = resolve(
        import.meta.dir,
        "../resources/style_guides/",
        filename,
      );

      return await Bun.file(filePath).text();
    },
  });

  return { "load-style-guide": loadStyleGuide };
}
