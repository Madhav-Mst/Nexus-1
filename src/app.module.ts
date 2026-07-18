import { McpApp, Module, ConfigModule } from '@nitrostack/core';
import { AgentOrchestratorModule } from './modules/agent-orchestrator/agent-orchestrator.module.js';
import { SystemHealthCheck } from './health/system.health.js';

/**
 * Root Application Module
 *
 * Bootstraps the premium multi-agent MCP server for the NitroStack hackathon.
 */
@McpApp({
  module: AppModule,
  server: {
    name: 'nexus-multi-agent',
    version: '1.0.0'
  },
  logging: {
    level: 'info'
  }
})
@Module({
  name: 'app',
  description: 'Premium multi-agent MCP server with research, security, debate, governance, and synthesis workflows',
  imports: [
    ConfigModule.forRoot(),
    AgentOrchestratorModule
  ],
  providers: [
    SystemHealthCheck,
  ]
})
export class AppModule {}

