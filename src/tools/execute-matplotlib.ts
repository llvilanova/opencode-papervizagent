import { resolve, extname } from "node:path";
import { unlink } from "node:fs/promises";
import { tool, type ToolDefinition } from "@opencode-ai/plugin/tool";
import type { PluginInput } from "@opencode-ai/plugin";

export function createExecuteMatplotlibTool(
  input: PluginInput,
): Record<string, ToolDefinition> {
  const $ = input.$;

  const executeMatplotlib: ToolDefinition = tool({
    description:
      "Execute matplotlib/seaborn Python code and save the resulting figure to a file. " +
      "Supports PNG, JPEG, PDF, SVG, EPS output formats.",
    args: {
      code: tool.schema.string().describe("Python matplotlib/seaborn code to execute"),
      outputPath: tool.schema.string().describe("File path to save the output image"),
      outputFormat: tool.schema
        .enum(["png", "jpeg", "pdf", "svg", "eps"])
        .default("png")
        .describe("Output image format"),
      dpi: tool.schema
        .number()
        .optional()
        .describe("Output image DPI (default: 300)"),
    },
    execute: async (args, context) => {
      const format = args.outputFormat;
      const dpi = args.dpi ?? 300;
      const tempFile = `/tmp/paperviz-${context.sessionID}-${Date.now()}.py`;
      const scriptPath = resolve(
        import.meta.dir,
        "../python/cli/execute_plot.py",
      );

      try {
        await Bun.write(tempFile, args.code);

        const result = await $`python3 ${scriptPath} --code-file ${tempFile} --output ${args.outputPath} --output-format ${format} --dpi ${dpi}`
          .nothrow()
          .quiet();

        const ext = extname(args.outputPath);
        const sourcePath = args.outputPath.replace(ext, ".py");
        await Bun.write(sourcePath, args.code);

        if (result.exitCode === 0) {
          return JSON.stringify({
            success: true,
            outputPath: args.outputPath,
            sourcePath,
          });
        }

        return JSON.stringify({
          success: false,
          error: result.stderr.toString(),
        });
      } finally {
        await unlink(tempFile).catch(() => {});
      }
    },
  });

  return { "execute-matplotlib": executeMatplotlib };
}
