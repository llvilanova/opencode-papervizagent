# PaperVizAgent Plugin for OpenCode

An OpenCode plugin that runs a multi-agent pipeline to generate publication-quality diagrams and plots from academic papers, inspired by the PaperVizAgent paper [1].

[1] https://github.com/google-research/papervizagent

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

| Agent | Task Type | Description |
|-------|-----------|-------------|
| `paperviz-orchestrator` | Complex reasoning, multi-step planning, delegation | Reads user inputs, selects pipeline mode, delegates to sub-agents, enforces quality gates |
| `paperviz-retriever` | Analytical ranking, long-context comprehension | Selects top-10 reference examples from a ~200-candidate pool by matching research domain and visual intent |
| `paperviz-planner` | Detailed technical writing, few-shot learning | Produces exhaustive figure descriptions (layout, colors, data mappings) from methodology text and reference examples |
| `paperviz-stylist` | Aesthetic refinement, guideline application | Refines figure descriptions to meet NeurIPS 2025 style standards while preserving existing quality |
| `paperviz-visualizer` | Code generation, tool use | Generates rendering code (matplotlib, Mermaid, TikZ, SVG, Graphviz) or invokes image generation tools |
| `paperviz-critic` | Visual evaluation, structured critique | Compares generated images against source material for accuracy, then produces a revised description |
| `paperviz-vanilla` | End-to-end generation, code + aesthetics | Single-agent path that reads source material and directly produces a rendered image |
| `paperviz-polish` | Image analysis, concise critique | Analyzes existing images against style guides and outputs actionable improvement suggestions |

Only `paperviz-orchestrator` is visible in the agent list. All others are hidden sub-agents.

## Model Configuration

All agents inherit your default model. You can override individual agents in `opencode.json` using the `"provider/model"` format:

```json
{
  "agent": {
    "paperviz-orchestrator": { "model": "github-copilot/claude-opus-4.6", "variant": "max" },
    "paperviz-visualizer": { "model": "github-copilot/claude-sonnet-4.6", "variant": "medium" },
    ...
  }
}
```

Recommended model tiers by agent task type:

| Agent | Task Type | Recommended Tier |
|-------|-----------|-----------------|
| `paperviz-orchestrator` | Complex reasoning, delegation | Strongest available |
| `paperviz-visualizer` | Code generation, tool use | Strong coding model |
| `paperviz-vanilla` | End-to-end generation | Strong coding model |
| `paperviz-critic` | Visual evaluation, critique | Mid-to-high |
| `paperviz-planner` | Technical writing, few-shot | Mid-to-high |
| `paperviz-stylist` | Aesthetic refinement | Mid-to-high |
| `paperviz-retriever` | Analytical ranking | Default is fine |
| `paperviz-polish` | Image analysis, concise critique | Default is fine |

## Tools

| Tool | Description |
|------|-------------|
| `execute-matplotlib` | Executes Python/matplotlib code and saves the figure to a file |
| `load-style-guide` | Loads style guides: NeurIPS 2025 diagram, NeurIPS 2025 plot, or rendering tool rules |
| `retrieve-references` | Reads reference image files from disk and returns paths for few-shot planning |
