import { resolve, extname } from "node:path";
import { unlink } from "node:fs/promises";
import { PACKAGE_ROOT } from "../paths";
import type { ExecuteMatplotlibParams } from "../types";

export const executeMatplotlibTool = {
  name: "execute-matplotlib",
  description:
    "Execute matplotlib/seaborn Python code and save the resulting figure to a file. " +
    "Supports PNG, JPEG, PDF, SVG, EPS output formats.",
  input: {
    type: "object",
    properties: {
      code: { type: "string", description: "Python matplotlib/seaborn code to execute" },
      outputPath: { type: "string", description: "File path to save the output image" },
      outputFormat: {
        type: "string",
        enum: ["png", "jpeg", "pdf", "svg", "eps"],
        default: "png",
        description: "Output image format",
      },
      dpi: { type: "number", description: "Output image DPI (default: 300)" },
    },
    required: ["code", "outputPath"],
    additionalProperties: false,
  },
  execute: async (input: unknown, context: { sessionID: string }) => {
    const args = input as ExecuteMatplotlibParams;
    const format = args.outputFormat ?? "png";
    const dpi = args.dpi ?? 300;
    const tempFile = `/tmp/paperviz-${context.sessionID}-${Date.now()}.py`;
    const scriptPath = resolve(PACKAGE_ROOT, "python/cli/execute_plot.py");

    try {
      await Bun.write(tempFile, args.code);

      const result = await Bun.$`python3 ${scriptPath} --code-file ${tempFile} --output ${args.outputPath} --output-format ${format} --dpi ${dpi}`
        .nothrow()
        .quiet();

      const ext = extname(args.outputPath);
      const sourcePath = args.outputPath.replace(ext, ".py");
      await Bun.write(sourcePath, args.code);

      if (result.exitCode === 0) {
        return {
          content: JSON.stringify({
            success: true,
            outputPath: args.outputPath,
            sourcePath,
          }),
        };
      }

      return {
        content: JSON.stringify({
          success: false,
          error: result.stderr.toString(),
        }),
      };
    } finally {
      await unlink(tempFile).catch(() => {});
    }
  },
};
