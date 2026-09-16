import { Node, Edge } from '@xyflow/react';
import { NodeData, EdgeData } from '../types';
import { ArchitectureValidationIssue, ArchitectureValidationResult } from '../types/validation';
import { ArchitectureValidationEngine } from './validationEngine';
import { CORE_RULES } from './rules/coreRules';
import { DETERMINISTIC_RULES } from './rules/deterministicRules';

// Initialize and seed validation engine with core and deterministic rules
const engineInstance = new ArchitectureValidationEngine();
CORE_RULES.forEach((rule) => engineInstance.registerRule(rule));
DETERMINISTIC_RULES.forEach((rule) => engineInstance.registerRule(rule));

export type ValidationSeverity = 'error' | 'warning' | 'info' | 'critical';
export type ValidationIssue = ArchitectureValidationIssue;
export type ValidationResult = ArchitectureValidationResult & {
  summary: {
    errors: number;
    warnings: number;
    infos: number;
    criticals: number;
  };
};

/**
 * Backward-compatible single function validation delegating to the new Rule engine.
 */
export function validateProject(
  nodes: Node<NodeData>[],
  edges: Edge<EdgeData>[]
): ValidationResult {
  const res = engineInstance.validate(nodes, edges);
  return {
    ...res,
    summary: {
      criticals: res.summary.criticals,
      errors: res.summary.errors,
      warnings: res.summary.warnings,
      infos: res.summary.infos,
    }
  };
}

/**
 * Backward-compatible single node validator utilizing the isolated rules.
 */
export function validateNode(node: Node<NodeData>): ArchitectureValidationIssue[] {
  const issues: ArchitectureValidationIssue[] = [];
  // Execute rules that operate on isolated node inputs
  const allNodeRules = [...CORE_RULES, ...DETERMINISTIC_RULES];
  allNodeRules.forEach((rule) => {
    if (['MISSING_SEMANTIC_TYPE', 'INVALID_SEMANTIC_TYPE', 'INVALID_METADATA', 'MISSING_TECHNOLOGY', 'UNAUTHENTICATED_SERVICE_ENTRY', 'PRODUCTION_DB_BACKUP_MISSING', 'INVALID_SEMANTIC_NODE_METADATA'].includes(rule.ruleId)) {
      issues.push(...rule.validate([node], []));
    }
  });
  return issues;
}

/**
 * Backward-compatible edge validator utilizing isolated rules.
 */
export function validateEdges(nodes: Node<NodeData>[], edges: Edge<EdgeData>[]): ArchitectureValidationIssue[] {
  const issues: ArchitectureValidationIssue[] = [];
  const allEdgeRules = [...CORE_RULES, ...DETERMINISTIC_RULES];
  allEdgeRules.forEach((rule) => {
    if (['DANGLING_CONNECTIONS', 'INVALID_RELATIONSHIP', 'INVALID_EDGE_METADATA', 'GENERIC_RELATIONSHIP', 'PUBLIC_DB_EXPOSURE', 'UNENCRYPTED_SENSITIVE_FLOW', 'DANGLING_REL_REFERENCE', 'SINGLE_NODE_BOTTLENECK'].includes(rule.ruleId)) {
      issues.push(...rule.validate(nodes, edges));
    }
  });
  return issues;
}
