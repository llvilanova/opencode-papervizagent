# PaperVizAgent Plugin for OpenCode

An OpenCode plugin that runs a multi-agent pipeline to generate publication-quality diagrams and plots from academic papers.

## Installation

Add to your `opencode.json`:

```json
{
  "plugin": ["opencode-papervizagent"]
}
```

## Python Dependencies

Required for matplotlib-based rendering:

```bash
pip install -r requirements.txt
```

Installs `matplotlib>=3.8` and `seaborn>=0.13`.

## Optional Tools

None of these are required, but each unlocks additional rendering paths:

| Tool | Purpose |
|------|---------|
| `mmdc` (Mermaid CLI) | Mermaid diagram rendering |
| `dot` (Graphviz) | DOT graph rendering |
| `pdflatex` + TikZ packages | LaTeX/TikZ diagram rendering |
| `convert` (ImageMagick) | Format conversion for raster outputs |

The orchestrator checks tool availability at runtime and warns you when a preferred tool is missing.

## Usage

1. Select the `paperviz-orchestrator` agent in OpenCode
2. Provide your paper or document (PDF, markdown, LaTeX, or plain text)
3. Describe the visualization you want

The orchestrator picks a pipeline mode, delegates to sub-agents, and returns file paths to the generated image and editable source.

## Pipeline Modes

| Mode | Pipeline | When to use |
|------|----------|-------------|
| `vanilla` | Direct single-agent generation | Quick drafts, no references needed |
| `dev_planner` | retriever → planner → visualizer | Better structure, explicit planning |
| `dev_planner_stylist` | retriever → planner → stylist → visualizer | Conference-style aesthetics without critique |
| `dev_planner_critic` | retriever → planner → visualizer → critic loop | Iterative quality improvement |
| `dev_full` | retriever → planner → stylist → visualizer → critic loop | Best quality, recommended default |
| `dev_polish` | polish → visualizer/vanilla | Refine an existing image |

The orchestrator selects the mode automatically unless you specify one. `dev_full` is the default for new generation; `dev_polish` for refining existing images.

## Agents

| Agent | Description |
|-------|-------------|
| `paperviz-orchestrator` | Main entry point — coordinates the pipeline, selects mode, enforces quality gates |
| `paperviz-retriever` | Retrieves relevant reference examples from a candidate pool for few-shot learning |
| `paperviz-planner` | Generates detailed figure descriptions from content and visual intent |
| `paperviz-stylist` | Refines figure descriptions with NeurIPS 2025 aesthetic standards |
| `paperviz-visualizer` | Generates images using code-based rendering or external image generation |
| `paperviz-critic` | Critiques generated figures and provides revised descriptions for improvement |
| `paperviz-vanilla` | Directly generates images without planning or styling steps |
| `paperviz-polish` | Analyzes existing images against style guides and suggests improvements |

Only `paperviz-orchestrator` is visible in the agent list. All others are hidden sub-agents.

## Tools

| Tool | Description |
|------|-------------|
| `execute-matplotlib` | Executes Python/matplotlib code and saves the figure to a file |
| `load-style-guide` | Loads style guides: NeurIPS 2025 diagram, NeurIPS 2025 plot, or rendering tool rules |
| `retrieve-references` | Reads reference image files from disk and returns paths for few-shot planning |
