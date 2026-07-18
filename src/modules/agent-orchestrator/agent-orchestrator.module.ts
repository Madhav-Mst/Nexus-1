import { Module } from '@nitrostack/core';
import { AgentOrchestratorTools } from './agent-orchestrator.tools.js';
import { AgentOrchestratorResources } from './agent-orchestrator.resources.js';
import { AgentOrchestratorPrompts } from './agent-orchestrator.prompts.js';

@Module({
  name: 'nexus-agent-orchestrator',
  description: 'Five-agent MCP command center for web research, security triage, debate synthesis, governance voting, and execution planning',
  controllers: [AgentOrchestratorTools, AgentOrchestratorResources, AgentOrchestratorPrompts]
})
export class AgentOrchestratorModule {}
