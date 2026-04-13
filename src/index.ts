import type { AgentConfig } from "@opencode-ai/sdk";
import type { Hooks, Plugin } from "@opencode-ai/plugin";
import { createCriticAgent } from "./agents/critic";
import { createOrchestratorAgent } from "./agents/orchestrator";
import { createPlannerAgent } from "./agents/planner";
import { createPolishAgent } from "./agents/polish";
import { createRetrieverAgent } from "./agents/retriever";
import { createStylistAgent } from "./agents/stylist";
import { createVanillaAgent } from "./agents/vanilla";
import { createVisualizerAgent } from "./agents/visualizer";
import { createExecuteMatplotlibTool } from "./tools/execute-matplotlib";
import { createLoadStyleGuideTool } from "./tools/load-style-guide";
import { createRetrieveReferencesTool } from "./tools/retrieve-references";

const OVERRIDE_ALLOW = new Set(["model", "variant", "temperature", "top_p", "steps", "color"]);

const plugin: Plugin = async (input) => {
  const hooks: Hooks = {
    tool: {
      ...createExecuteMatplotlibTool(input),
      ...createLoadStyleGuideTool(input),
      ...createRetrieveReferencesTool(input),
    },
    config: async (config) => {
      config.agent ??= {};
      const agents: Record<string, AgentConfig> = {
        "paperviz-orchestrator": createOrchestratorAgent(),
        "paperviz-retriever": createRetrieverAgent(),
        "paperviz-planner": createPlannerAgent(),
        "paperviz-stylist": createStylistAgent(),
        "paperviz-visualizer": createVisualizerAgent(),
        "paperviz-critic": createCriticAgent(),
        "paperviz-vanilla": createVanillaAgent(),
        "paperviz-polish": createPolishAgent(),
      };
      for (const [name, defaults] of Object.entries(agents)) {
        const overrides = config.agent[name];
        if (overrides && typeof overrides === "object") {
          const picked: Record<string, unknown> = {};
          for (const [k, v] of Object.entries(overrides)) {
            if (OVERRIDE_ALLOW.has(k) && v !== undefined && v !== null && v !== "")
              picked[k] = v;
          }
          config.agent[name] = { ...defaults, ...picked };
        } else {
          config.agent[name] = defaults;
        }
      }
    },
  };

  return hooks;
};

export default plugin;
