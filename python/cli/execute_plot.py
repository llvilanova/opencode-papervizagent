#!/usr/bin/env python3
"""
Standalone CLI for executing matplotlib plotting code and saving output images.

Extracted from PaperVizAgent's _execute_plot_code_worker() with CLI interface.
"""

import argparse
import re
import sys

import matplotlib.pyplot as plt


def parse_args():
    parser = argparse.ArgumentParser(
        description="Execute matplotlib plotting code from a file and save the output image."
    )
    parser.add_argument(
        "--code-file",
        required=True,
        help="Path to file containing Python matplotlib code",
    )
    parser.add_argument(
        "--output",
        required=True,
        help="Output image file path",
    )
    parser.add_argument(
        "--output-format",
        default="png",
        choices=["png", "jpeg", "pdf", "svg", "eps"],
        help="Output image format (default: png)",
    )
    parser.add_argument(
        "--dpi",
        type=int,
        default=300,
        help="Output image DPI (default: 300)",
    )
    return parser.parse_args()


def execute_plot(code_file, output, output_format, dpi):
    with open(code_file, "r") as f:
        code_text = f.read()

    match = re.search(r"```python(.*?)```", code_text, re.DOTALL)
    code_clean = match.group(1).strip() if match else code_text.strip()

    plt.switch_backend("Agg")
    plt.close("all")
    plt.rcdefaults()

    exec_globals = {}
    exec(code_clean, exec_globals)

    if not plt.get_fignums():
        raise RuntimeError("Code executed but no matplotlib figure was created")

    plt.savefig(output, format=output_format, bbox_inches="tight", dpi=dpi)
    plt.close("all")


def main():
    args = parse_args()
    try:
        execute_plot(args.code_file, args.output, args.output_format, args.dpi)
    except Exception as e:
        print(f"Error executing plot code: {e}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
