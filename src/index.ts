import type { Plugin } from "@opencode/plugin";
import { createCriticAgent } from "./agents/critic";
import { createOrchestratorAgent } from "./agents/orchestrator";
import { createPlannerAgent } from "./agents/planner";
import { createPolishAgent } from "./agents/polish";
import { createRetrieverAgent } from "./agents/retriever";
import { createStylistAgent } from "./agents/stylist";
import { createVanillaAgent } from "./agents/vanilla";
import { createVisualizerAgent } from "./agents/visualizer";
import { executeMatplotlibTool } from "./tools/execute-matplotlib";
import { loadStyleGuideTool } from "./tools/load-style-guide";
import { retrieveReferencesTool } from "./tools/retrieve-references";
import type { AgentDefaults, AgentName } from "./types";

const agents: Record<AgentName, AgentDefaults> = {
  "paperviz-orchestrator": createOrchestratorAgent(),
  "paperviz-retriever": createRetrieverAgent(),
  "paperviz-planner": createPlannerAgent(),
  "paperviz-stylist": createStylistAgent(),
  "paperviz-visualizer": createVisualizerAgent(),
  "paperviz-critic": createCriticAgent(),
  "paperviz-vanilla": createVanillaAgent(),
  "paperviz-polish": createPolishAgent(),
};

const plugin: Plugin.Plugin = {
  id: "paperviz",
  async setup(ctx) {
    await ctx.tool.transform((editor) => {
      editor.add(executeMatplotlibTool);
      editor.add(loadStyleGuideTool);
      editor.add(retrieveReferencesTool);
    });

    // update() also creates agents that opencode.json does not declare; for
    // declared ones it keeps the user's model and variant.
    await ctx.agent.transform((editor) => {
      for (const [id, defaults] of Object.entries(agents)) {
        editor.update(id, (agent) => {
          agent.description = defaults.description;
          agent.mode = defaults.mode;
          agent.hidden = defaults.hidden;
          agent.system = defaults.system;
          if (defaults.steps !== undefined && agent.steps === undefined)
            agent.steps = defaults.steps;
        });
      }
    });
  },
};

export default plugin;
