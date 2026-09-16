import { Node, Edge } from '@xyflow/react';
import { NodeData, EdgeData } from '../types';
import { ArchitectureRule, ArchitectureValidationIssue, ArchitectureValidationResult } from '../types/validation';

/**
 * Headless architecture validation engine.
 * Decoupled from React and Zustand to allow for independent testing and modularity.
 */
export class ArchitectureValidationEngine {
  private rules: ArchitectureRule[] = [];

  /**
   * Registers a new rule into the engine.
   */
  registerRule(rule: ArchitectureRule): void {
    if (!this.rules.find((r) => r.ruleId === rule.ruleId)) {
      this.rules.push(rule);
    }
  }

  /**
   * Removes a rule by its ID.
   */
  unregisterRule(ruleId: string): void {
    this.rules = this.rules.filter((r) => r.ruleId !== ruleId);
  }

  /**
   * Executes all registered rules against the provided architectural graph.
   */
  validate(nodes: Node<NodeData>[], edges: Edge<EdgeData>[]): ArchitectureValidationResult {
    const allIssues: ArchitectureValidationIssue[] = [];

    this.rules.forEach((rule) => {
      try {
        const findings = rule.validate(nodes, edges);
        allIssues.push(...findings);
      } catch (error) {
        console.error(`Error executing rule "${rule.ruleId}":`, error);
        allIssues.push({
          ruleId: 'ENGINE_INTERNAL_ERROR',
          code: 'ENGINE_INTERNAL_ERROR',
          severity: 'error',
          title: 'Rule Execution Failed',
          message: `The validation rule "${rule.ruleId}" failed to execute properly.`,
          affectedNodeIds: [],
          affectedEdgeIds: [],
          remediation: 'Review the rule implementation for logical errors or missing data checks.',
          metadata: { error: error instanceof Error ? error.message : String(error) }
        });
      }
    });

    const criticals = allIssues.filter((i) => i.severity === 'critical').length;
    const errors = allIssues.filter((i) => i.severity === 'error').length;
    const warnings = allIssues.filter((i) => i.severity === 'warning').length;
    const infos = allIssues.filter((i) => i.severity === 'info').length;

    return {
      isValid: criticals === 0 && errors === 0,
      issues: allIssues,
      summary: {
        criticals,
        errors,
        warnings,
        infos,
      },
    };
  }

  /**
   * Helper to get registered rule IDs.
   */
  getRegisteredRuleIds(): string[] {
    return this.rules.map((r) => r.ruleId);
  }
}

// Global instance for shared use across the application
export const validationEngine = new ArchitectureValidationEngine();
