import { Node, Edge } from '@xyflow/react';
import { NodeData, EdgeData } from './index';
import { ArchitecturePolicyConfig } from './policy';

export type ArchitectureValidationSeverity = 'info' | 'warning' | 'error' | 'critical';

export interface ArchitectureValidationIssue {
  ruleId: string;
  code: string; // Kept for backward compatibility with existing test assertions
  severity: ArchitectureValidationSeverity;
  title: string;
  message: string;
  affectedNodeIds: string[];
  affectedEdgeIds: string[];
  remediation: string; // Recommendation or remediation steps
  property?: string;
  metadata?: Record<string, unknown>;
}

export interface ArchitectureValidationResult {
  isValid: boolean;
  issues: ArchitectureValidationIssue[];
  summary: {
    criticals: number;
    errors: number;
    warnings: number;
    infos: number;
  };
}

export interface ArchitectureRule {
  ruleId: string;
  name: string;
  description: string;
  validate(
    nodes: Node<NodeData>[],
    edges: Edge<EdgeData>[],
    policy?: ArchitecturePolicyConfig
  ): ArchitectureValidationIssue[];
}
