import { Node, Edge } from '@xyflow/react';
import { NodeData, EdgeData } from '../types';
import {
  SEMANTIC_CATEGORIES,
  EDGE_RELATIONSHIP_TYPES,
  SemanticCategory,
  EdgeRelationshipType
} from '../types/semantic';

export type ValidationSeverity = 'error' | 'warning' | 'info';

export interface ValidationIssue {
  id: string; // The ID of the node or edge
  type: 'node' | 'edge' | 'global';
  severity: ValidationSeverity;
  code: string;
  message: string;
  property?: string;
}

export interface ValidationResult {
  isValid: boolean;
  issues: ValidationIssue[];
  summary: {
    errors: number;
    warnings: number;
    infos: number;
  };
}

/**
 * Validates the entire project for semantic consistency and architectural integrity.
 */
export function validateProject(
  nodes: Node<NodeData>[],
  edges: Edge<EdgeData>[]
): ValidationResult {
  const issues: ValidationIssue[] = [];

  // 1. Validate Nodes
  nodes.forEach((node) => {
    issues.push(...validateNode(node));
  });

  // 2. Validate Edges
  issues.push(...validateEdges(nodes, edges));

  const errors = issues.filter((i) => i.severity === 'error').length;
  const warnings = issues.filter((i) => i.severity === 'warning').length;
  const infos = issues.filter((i) => i.severity === 'info').length;

  return {
    isValid: errors === 0,
    issues,
    summary: { errors, warnings, infos },
  };
}

/**
 * Validates a single node for missing or invalid semantic information.
 */
export function validateNode(node: Node<NodeData>): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const semantic = node.data?.semantic;

  // 1. Rule: Missing Semantic Category
  if (!semantic || !semantic.category) {
    issues.push({
      id: node.id,
      type: 'node',
      severity: 'error',
      code: 'MISSING_SEMANTIC_TYPE',
      message: `Node "${node.data?.title || node.id}" is missing a semantic category.`,
      property: 'semantic.category',
    });
  }
  // 2. Rule: Invalid Semantic Category
  else if (!SEMANTIC_CATEGORIES.includes(semantic.category as SemanticCategory)) {
    issues.push({
      id: node.id,
      type: 'node',
      severity: 'error',
      code: 'INVALID_SEMANTIC_TYPE',
      message: `Node "${node.data?.title || node.id}" has an unknown semantic category: ${semantic.category}.`,
      property: 'semantic.category',
    });
  }

  // 3. Rule: Invalid Semantic Metadata Structure
  if (semantic?.metadata && typeof semantic.metadata !== 'object') {
    issues.push({
      id: node.id,
      type: 'node',
      severity: 'error',
      code: 'INVALID_METADATA',
      message: `Node "${node.data?.title || node.id}" has invalid metadata structure.`,
      property: 'semantic.metadata',
    });
  }

  // Rule: Missing Technology for specific categories (Warning)
  const techCategories: SemanticCategory[] = ['database', 'cache', 'queue', 'storage', 'cloud_resource'];
  if (semantic && techCategories.includes(semantic.category as SemanticCategory) && !semantic.metadata?.technology) {
    issues.push({
      id: node.id,
      type: 'node',
      severity: 'warning',
      code: 'MISSING_TECHNOLOGY',
      message: `Architectural node "${node.data?.title || node.id}" should specify a technology (e.g., PostgreSQL).`,
      property: 'semantic.metadata.technology',
    });
  }

  return issues;
}

/**
 * Validates edges for valid relationships and broken connections.
 */
export function validateEdges(nodes: Node<NodeData>[], edges: Edge<EdgeData>[]): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const nodeIds = new Set(nodes.map((n) => n.id));

  edges.forEach((edge) => {
    // Rule: Dangling Connections (Broken references)
    if (!nodeIds.has(edge.source)) {
      issues.push({
        id: edge.id,
        type: 'edge',
        severity: 'error',
        code: 'DANGLING_SOURCE',
        message: `Edge "${edge.id}" references a missing source node: ${edge.source}.`,
      });
    }
    if (!nodeIds.has(edge.target)) {
      issues.push({
        id: edge.id,
        type: 'edge',
        severity: 'error',
        code: 'DANGLING_TARGET',
        message: `Edge "${edge.id}" references a missing target node: ${edge.target}.`,
      });
    }

    // Rule: Invalid Relationship Type
    const relationship = edge.data?.semantic?.relationship;
    if (relationship && !EDGE_RELATIONSHIP_TYPES.includes(relationship as EdgeRelationshipType)) {
      issues.push({
        id: edge.id,
        type: 'edge',
        severity: 'error',
        code: 'INVALID_RELATIONSHIP',
        message: `Edge "${edge.id}" has an unknown relationship type: ${relationship}.`,
        property: 'semantic.relationship',
      });
    }

    // Rule: Invalid Edge Metadata Structure
    if (edge.data?.semantic?.metadata && typeof edge.data.semantic.metadata !== 'object') {
      issues.push({
        id: edge.id,
        type: 'edge',
        severity: 'error',
        code: 'INVALID_EDGE_METADATA',
        message: `Edge "${edge.id}" has invalid metadata structure.`,
        property: 'semantic.metadata',
      });
    }

    // Rule: Generic Relationship (Warning)
    if (relationship === 'generic' || !relationship) {
      issues.push({
        id: edge.id,
        type: 'edge',
        severity: 'info',
        code: 'GENERIC_RELATIONSHIP',
        message: `Connection between nodes is generic. Consider specifying a meaningful relationship (e.g., "calls").`,
        property: 'semantic.relationship',
      });
    }
  });

  return issues;
}
