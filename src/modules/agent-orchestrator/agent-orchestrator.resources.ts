import { ResourceDecorator as Resource, ExecutionContext } from '@nitrostack/core';

export class AgentOrchestratorResources {
  @Resource({
    uri: 'nexus://agent-manifest',
    name: 'Nexus Agent Manifest',
    description: 'Describes the five-agent orchestration architecture exposed by the MCP server.',
    mimeType: 'application/json',
    examples: {
      response: {
        agents: [
          { role: 'Research Agent', specialty: 'Web evidence gathering' },
          { role: 'Security Agent', specialty: 'Risk triage' },
          { role: 'Debate Agent', specialty: 'Opposing viewpoints' },
          { role: 'Governance Agent', specialty: 'Voting logic' },
          { role: 'Synthesis Agent', specialty: 'Executive summary' }
        ]
      }
    }
  })
  async getManifest(uri: string, ctx: ExecutionContext) {
    ctx.logger.info('Fetching agent manifest');

    return {
      contents: [{
        uri,
        mimeType: 'application/json',
        text: JSON.stringify({
          name: 'Nexus Multi-Agent Command Center',
          description: 'Five specialist agents for learning, academic research, debate, review, and synthesis.',
          agents: [
            { role: 'Research Agent', specialty: 'Literature and evidence gathering' },
            { role: 'Learning Agent', specialty: 'Study planning and knowledge scaffolding' },
            { role: 'Debate Agent', specialty: 'Academic counterarguments and discussion framing' },
            { role: 'Review Agent', specialty: 'Quality checks, feedback, and rubric alignment' },
            { role: 'Synthesis Agent', specialty: 'Academic summary and action planning' }
          ],
          tools: [
            'explore_academic_sources',
            'build_learning_path',
            'generate_debate_position',
            'review_learning_output',
            'compose_exec_strategy',
            'orchestrate_multi_agent_consensus',
            'rank_research_options',
            'draft_feedback_plan',
            'summarize_agent_opinions',
            'build_execution_checklist',
            'map_key_concepts',
            'generate_quiz_outline',
            'build_research_summary'
          ]
        }, null, 2)
      }]
    };
  }
}
