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

const plugin: Plugin = async (input) => {
  const hooks: Hooks = {
    tool: {
      ...createExecuteMatplotlibTool(input),
      ...createLoadStyleGuideTool(input),
      ...createRetrieveReferencesTool(input),
    },
    config: async (config) => {
      config.agent ??= {};
      config.agent["paperviz-orchestrator"] = createOrchestratorAgent();
      config.agent["paperviz-retriever"] = createRetrieverAgent();
      config.agent["paperviz-planner"] = createPlannerAgent();
      config.agent["paperviz-stylist"] = createStylistAgent();
      config.agent["paperviz-visualizer"] = createVisualizerAgent();
      config.agent["paperviz-critic"] = createCriticAgent();
      config.agent["paperviz-vanilla"] = createVanillaAgent();
      config.agent["paperviz-polish"] = createPolishAgent();
    },
  };

  return hooks;
};

export default plugin;
