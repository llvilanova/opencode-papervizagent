/** Pipeline execution modes (from paperviz_processor.py:113-166, excluding dev_retriever/streamlit). */
export type PipelineMode =
  | "vanilla"
  | "dev_planner"
  | "dev_planner_stylist"
  | "dev_planner_critic"
  | "dev_full"
  | "dev_polish";

export type TaskType = "diagram" | "plot";

export type StyleGuideType = "diagram" | "plot" | "rendering";

export type AgentName =
  | "paperviz-orchestrator"
  | "paperviz-retriever"
  | "paperviz-planner"
  | "paperviz-stylist"
  | "paperviz-visualizer"
  | "paperviz-critic"
  | "paperviz-vanilla"
  | "paperviz-polish";

export interface ExecuteMatplotlibParams {
  code: string;
  outputPath: string;
  /** Defaults to "png". */
  outputFormat?: "png" | "jpeg" | "pdf" | "svg" | "eps";
  /** Defaults to 300. */
  dpi?: number;
}

export interface ExecuteMatplotlibResult {
  success: boolean;
  /** Present on success. */
  outputPath?: string;
  /** Path to saved Python source file. Present on success. */
  sourcePath?: string;
  error?: string;
}

export interface LoadStyleGuideParams {
  guide: StyleGuideType;
}

/** Raw markdown content returned by load-style-guide. */
export type LoadStyleGuideResult = string;

export interface ReferenceEntry {
  path: string;
  exists: boolean;
}

export interface RetrieveReferencesParams {
  imagePaths: string[];
  maxImages?: number;
}

export interface RetrieveReferencesResult {
  references: ReferenceEntry[];
}
