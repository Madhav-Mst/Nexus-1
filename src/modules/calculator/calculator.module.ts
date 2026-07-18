import { Module } from '@nitrostack/core';
import { CalculatorTools } from './calculator.tools.js';
import { CalculatorResources } from './calculator.resources.js';
import { CalculatorPrompts } from './calculator.prompts.js';

@Module({
  name: 'nexus-academic',
  description: 'Academic workflow tools for workload analysis and study orchestration',
  controllers: [CalculatorTools, CalculatorResources, CalculatorPrompts]
})
export class CalculatorModule {}

