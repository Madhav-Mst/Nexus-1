import { ToolDecorator as Tool, Widget, ExecutionContext, z } from '@nitrostack/core';

export class CalculatorTools {

  @Tool({
    name: 'analyze_semester_workload',
    description: 'Analyzes a student\'s deadlines, exam dates, and assignment schedules to calculate a prioritized workload map with burnout risk detection.',
    inputSchema: z.object({
      tasks: z.array(z.object({
        title: z.string().describe('Name of assignment, exam, or lab task'),
        course: z.string().describe('Course name or code'),
        daysUntilDue: z.number().describe('Days left before deadline'),
        estimatedHoursRequired: z.number().describe('Estimated prep hours')
      })).describe('List of upcoming academic obligations')
    })
  })
  @Widget('workload-dashboard')
  async analyzeWorkload(input: any, ctx: ExecutionContext) {
    ctx.logger.info('Running workload analysis', { taskCount: input.tasks.length });

    const prioritized = input.tasks.map((task: any) => {
      const urgency = task.daysUntilDue <= 0 ? 100 : (10 / task.daysUntilDue);
      const score = Math.min(Math.round(((task.estimatedHoursRequired * 1.5) + (urgency * 3.5)) * 10) / 10, 100);

      let tier: 'critical' | 'high' | 'moderate' | 'stable' = 'stable';
      if (score >= 75) tier = 'critical';
      else if (score >= 45) tier = 'high';
      else if (score >= 20) tier = 'moderate';

      return { ...task, priorityScore: score, tier };
    }).sort((a: any, b: any) => b.priorityScore - a.priorityScore);

    const totalHours = input.tasks.reduce((acc: number, t: any) => acc + t.estimatedHoursRequired, 0);
    const criticalCount = prioritized.filter((t: any) => t.tier === 'critical').length;

    const burnoutRisk = totalHours > 30 || criticalCount >= 2
      ? { level: 'high', message: 'Compressed deadlines detected. Restructure schedule now.' }
      : totalHours > 15
      ? { level: 'moderate', message: 'Manageable, but watch the next 3 days closely.' }
      : { level: 'low', message: 'Workload is currently stable.' };

    return {
      status: 'success',
      generatedAt: new Date().toISOString(),
      totalHoursBacklog: totalHours,
      burnoutRisk,
      matrix: prioritized
    };
  }

  @Tool({
    name: 'generate_study_workflow',
    description: 'Builds a day-by-day autonomous study timeline for a target exam.',
    inputSchema: z.object({
      targetExam: z.string().describe('Subject or exam code'),
      daysAvailable: z.number().describe('Days remaining to study')
    })
  })
  @Widget('study-timeline')
  async generateWorkflow(input: any, ctx: ExecutionContext) {
    ctx.logger.info('Generating study workflow', { target: input.targetExam });

    const phases = [
      { name: 'Syllabus Mapping', detail: 'Identify high-yield topics and gaps' },
      { name: 'Concept Building', detail: 'Deep work on core material' },
      { name: 'Active Recall', detail: 'Quiz-based retrieval practice' },
      { name: 'Final Revision', detail: 'Mock papers and weak-spot review' }
    ];

    const timeline = Array.from({ length: input.daysAvailable }, (_, i) => {
      const day = i + 1;
      const phaseIndex = Math.min(Math.floor((i / input.daysAvailable) * phases.length), phases.length - 1);
      return {
        day,
        phase: phases[phaseIndex].name,
        detail: phases[phaseIndex].detail
      };
    });

    return {
      status: 'success',
      targetExam: input.targetExam,
      daysAvailable: input.daysAvailable,
      timeline
    };
  }
}