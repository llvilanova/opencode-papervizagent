# Rendering Tool Guide

## Overview

There are two image generation paths available for producing scientific figures:

1. **Code-based rendering** — Deterministic, plugin-controlled tools that produce reproducible output from source code. These include matplotlib, Mermaid, TikZ, SVG, and Graphviz. The plugin's `execute-matplotlib` tool handles Python-based rendering directly; other code-based tools require the agent to write source files and invoke compilation via shell commands.

2. **External image generation** — Any image generation tools, skills, MCPs, or commands the agent has access to in its environment. These are best suited for creative, artistic, or photorealistic output where code-based tools fall short. The agent discovers available external generators at runtime — this guide describes *when* to use external generation, not *how*.

**Default preference**: Code-based rendering for anything that can be expressed as structured data, logic, or mathematical notation. External generation for creative/artistic content or when no code-based tool can produce the required visual.

---

## Rendering Sub-Categories

### 1. Data Plots

Line charts, bar charts, scatter plots, area charts, pie charts.

**Preferred**: matplotlib/seaborn — full control over axes, legends, tick formatting, and color palettes. Seaborn provides higher-level statistical plot APIs built on matplotlib.

**When external gen is appropriate**: Rarely. Data plots require precise axis scales and data fidelity that external generators cannot guarantee.

### 2. Statistical Visualizations

Histograms, box plots, violin plots, heatmaps, correlation matrices, error bar plots.

**Preferred**: matplotlib/seaborn — seaborn excels at statistical visualizations with built-in support for distributions, categorical comparisons, and annotated heatmaps.

**When external gen is appropriate**: Rarely. Statistical accuracy is paramount; code-based tools ensure data integrity.

### 3. Flowcharts

Process flows, decision trees, workflow diagrams, activity diagrams.

**Preferred**: Mermaid — concise text-based syntax, good layout engine for directed flows. **Alternative**: Graphviz (dot) — better control over node placement and edge routing for complex graphs.

**Tradeoffs**: Mermaid is simpler to write but offers less layout control. Graphviz requires more verbose syntax but handles complex routing better.

**When external gen is appropriate**: When the flowchart needs a hand-drawn or artistic aesthetic that code-based tools cannot produce.

### 4. Architecture Diagrams

System diagrams, block diagrams, component diagrams, deployment diagrams.

**Preferred**: Mermaid for standard architectures — quick to write, readable syntax. TikZ for precise positioning and publication-quality output.

**Tradeoffs**: Mermaid auto-layouts but limits fine positioning. TikZ offers pixel-perfect control at the cost of verbosity.

**When external gen is appropriate**: When the diagram requires an artistic or stylized visual treatment (e.g., isometric views, 3D-effect blocks, branded color schemes beyond what code tools support).

### 5. Sequence Diagrams

Sequence diagrams, timeline diagrams, communication diagrams.

**Preferred**: Mermaid — native sequence diagram syntax with participant lifelines, activation bars, and message arrows.

**When external gen is appropriate**: Rarely. Mermaid handles standard sequence diagram semantics well.

### 6. Mathematical Visualizations

Equations, function plots, geometric constructions, proof diagrams, commutative diagrams.

**Preferred**: TikZ — gold standard for mathematical typesetting in LaTeX. pgfplots (TikZ-based) for function plotting with LaTeX-native label rendering.

**Alternative**: matplotlib for function plots when LaTeX rendering isn't critical.

**When external gen is appropriate**: Rarely. Mathematical precision requires code-based tools.

### 7. Neural Network Diagrams

Network architectures, layer diagrams, computation graphs, attention visualizations.

**Preferred**: TikZ — fine-grained control over layer positioning, connection routing, and annotation. Graphviz for simpler DAG-style computation graphs.

**Tradeoffs**: TikZ produces publication-quality output but requires significant code. Graphviz is faster to write but limited in visual richness.

**When external gen is appropriate**: When the diagram needs artistic/stylized rendering (e.g., 3D network visualizations, photorealistic neuron illustrations).

### 8. Dependency and Graph Diagrams

Dependency trees, knowledge graphs, citation networks, entity-relationship diagrams.

**Preferred**: Graphviz — purpose-built for graph layout with multiple algorithms (dot, neato, fdp, sfdp) suited to different graph topologies.

**Alternative**: Mermaid for simpler graphs with fewer nodes.

**When external gen is appropriate**: Rarely. Graph layout algorithms in Graphviz handle topology-driven placement far better than generative models.

### 9. Conceptual and Artistic Diagrams

Concept illustrations, creative diagrams, metaphorical visualizations, infographics.

**Preferred**: External image generation — creative and artistic content is the primary strength of generative image models. Code-based tools produce rigid, geometric output that rarely captures the intended artistic quality.

**Fallback**: TikZ or SVG for stylized but still geometric illustrations when external generation is unavailable.

**When code-based is appropriate**: When the conceptual diagram is fundamentally geometric (e.g., Venn diagrams, simple concept maps) and artistic flair is not required.

### 10. Tables

Comparison tables, data summaries, result matrices, confusion matrices.

**Preferred**: TikZ (via `tabular`/`booktabs`) for LaTeX-native publication tables. matplotlib (`table()` or custom axes) for quick programmatic table rendering.

**Tradeoffs**: TikZ/LaTeX tables integrate perfectly with paper typesetting. matplotlib tables are faster to generate but less typographically polished.

**When external gen is appropriate**: Not recommended. Tables require precise cell alignment and data accuracy.

---

## Deterministic Warning Rules

For each rendering decision, the agent should evaluate these conditions:

### INFO-level

- External image generation is selected, but the output specification requires vector format (SVG, PDF, EPS). External generators typically produce raster images (PNG, JPEG). The agent should note this mismatch and consider whether post-conversion or a code-based alternative would better serve the requirement.

### WARNING-level

- The preferred code-based tool for a sub-category is unavailable (not installed, not in PATH, or execution fails), but alternative code-based tools exist. Examples:
  - Mermaid unavailable for flowcharts → fall back to Graphviz
  - TikZ unavailable for math → fall back to matplotlib with LaTeX renderer
  - Graphviz unavailable for graphs → fall back to Mermaid

### CRITICAL-level

- No suitable rendering tool is available for the diagram type — neither the preferred tool, any alternative code-based tool, nor external image generation can produce the required output. The agent should report this to the user rather than attempt a low-quality workaround.

---

## Format Conversion

**NEVER rasterize vector output unless the user explicitly requests raster format.** Vector formats (SVG, PDF, EPS) preserve resolution independence and are preferred for publication. Converting vector→raster is destructive and irreversible.

### Conversion Tools

This guide does not prescribe specific conversion tools. The agent should use whatever is available in its environment. Common options include: rsvg-convert, pdftocairo, dvisvgm, ps2pdf, CairoSVG, Inkscape (CLI), ImageMagick.

### Common Conversion Paths

| From | To | Example approach |
|------|----|-----------------|
| SVG → PDF | `rsvg-convert -f pdf -o out.pdf in.svg` or `inkscape --export-type=pdf in.svg` |
| SVG → PNG | `rsvg-convert -f png -d 300 -o out.png in.svg` or `cairosvg in.svg -o out.png -d 300` |
| PDF → SVG | `pdftocairo -svg in.pdf out.svg` or `dvisvgm --pdf in.pdf -o out.svg` |
| PDF → PNG | `pdftocairo -png -r 300 in.pdf out` |
| EPS → PDF | `ps2pdf in.eps out.pdf` or `epstopdf in.eps` |
| DVI → SVG | `dvisvgm in.dvi -o out.svg` |

### DPI Guidance

- **300 DPI**: Standard for most publication figures and screen display.
- **600 DPI**: Recommended for line art, text-heavy diagrams, and small-detail figures.
- **Vector formats**: DPI is irrelevant — output scales to any resolution.

### Pitfalls

- **Accidental rasterization**: Some tools silently rasterize vector content during conversion. Verify output is truly vector by checking file structure, not just extension.
- **Font embedding**: PDF/SVG output may reference system fonts. Convert text to paths/outlines when portability is required, or embed fonts explicitly.
- **JPEG and transparency**: JPEG does not support transparency. Use PNG or SVG when the figure has a transparent background.
- **RGB vs CMYK**: Screen output uses RGB; some print workflows require CMYK. Check publication requirements. ImageMagick and Ghostscript can convert between color spaces.

---

## Source Code Preservation

**Cross-cutting rule**: When code-based rendering is used, ALWAYS save the source file next to the rendered image with the same basename and the appropriate source extension.

Examples:
- `chart.png` + `chart.py` (matplotlib)
- `diagram.png` + `diagram.mmd` (Mermaid)
- `figure.pdf` + `figure.tex` (TikZ)
- `graph.svg` + `graph.dot` (Graphviz)

**For matplotlib**: The `execute-matplotlib` tool handles source preservation automatically — it saves the Python source alongside the rendered output.

**For all other code-based tools**: The agent must explicitly save the source file before invoking the compilation/rendering command. This ensures reproducibility — any figure can be regenerated or modified from its source.
