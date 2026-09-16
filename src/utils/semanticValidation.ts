import { Node, Edge } from '@xyflow/react';
import { NodeData, EdgeData } from '../types';
import {
  SEMANTIC_CATEGORIES,
  EDGE_RELATIONSHIP_TYPES,
  SemanticCategory,
  EdgeRelationshipType
} from '../types/semantic';
import {
  ArchitectureValidationIssue,
  ArchitectureValidationResult,
  ArchitectureValidationSeverity
} from '../types/validation';

// Re-export severity for backward compatibility if needed by any imports
export type ValidationSeverity = 'error' | 'warning' | 'info' | 'critical';

// Export the older type name mapped to the new architecture validation issue structure for backwards compatibility
export type ValidationIssue = ArchitectureValidationIssue;

// Export the older type name mapped to the new architecture validation result structure for backwards compatibility
export type ValidationResult = ArchitectureValidationResult & {
  summary: {
    errors: number;
    warnings: number;
    infos: number;
    criticals: number;
  };
};

/**
 * Validates the entire project for semantic consistency and architectural integrity.
 */
export function validateProject(
  nodes: Node<NodeData>[],
  edges: Edge<EdgeData>[]
): ValidationResult {
  const issues: ArchitectureValidationIssue[] = [];

  // 1. Validate Nodes
  nodes.forEach((node) => {
    issues.push(...validateNode(node));
  });

  // 2. Validate Edges
  issues.push(...validateEdges(nodes, edges));

  const criticals = issues.filter((i) => i.severity === 'critical').length;
  const errors = issues.filter((i) => i.severity === 'error').length;
  const warnings = issues.filter((i) => i.severity === 'warning').length;
  const infos = issues.filter((i) => i.severity === 'info').length;

  return {
    isValid: criticals === 0 && errors === 0,
    issues,
    summary: {
      criticals,
      errors,
      warnings,
      infos,
    },
  };
}

/**
 * Validates a single node for missing or invalid semantic information.
 */
export function validateNode(node: Node<NodeData>): ArchitectureValidationIssue[] {
  const issues: ArchitectureValidationIssue[] = [];
  const semantic = node.data?.semantic;
  const nodeTitle = node.data?.title || node.id;

  // 1. Rule: Missing Semantic Category
  if (!semantic || !semantic.category) {
    issues.push({
      ruleId: 'MISSING_SEMANTIC_TYPE',
      code: 'MISSING_SEMANTIC_TYPE',
      severity: 'error',
      title: 'Missing Semantic Category',
      message: `Node "${nodeTitle}" is missing a semantic category.`,
      affectedNodeIds: [node.id],
      affectedEdgeIds: [],
      remediation: 'Open the properties panel for this node and assign an architectural role category.',
      property: 'semantic.category',
    });
  }
  // 2. Rule: Invalid Semantic Category
  else if (!SEMANTIC_CATEGORIES.includes(semantic.category as SemanticCategory)) {
    issues.push({
      ruleId: 'INVALID_SEMANTIC_TYPE',
      code: 'INVALID_SEMANTIC_TYPE',
      severity: 'error',
      title: 'Invalid Semantic Category',
      message: `Node "${nodeTitle}" has an unknown semantic category: ${semantic.category}.`,
      affectedNodeIds: [node.id],
      affectedEdgeIds: [],
      remediation: 'Change the semantic category to a recognized value from the supported architecture taxonomy.',
      property: 'semantic.category',
      metadata: { providedCategory: semantic.category },
    });
  }

  // 3. Rule: Invalid Semantic Metadata Structure
  if (semantic?.metadata && typeof semantic.metadata !== 'object') {
    issues.push({
      ruleId: 'INVALID_METADATA',
      code: 'INVALID_METADATA',
      severity: 'error',
      title: 'Invalid Metadata Structure',
      message: `Node "${nodeTitle}" has invalid metadata structure.`,
      affectedNodeIds: [node.id],
      affectedEdgeIds: [],
      remediation: 'Ensure that the node metadata configuration is standard structured key-value pairs.',
      property: 'semantic.metadata',
    });
  }

  // Rule: Missing Technology for specific categories (Warning)
  const techCategories: SemanticCategory[] = ['database', 'cache', 'queue', 'storage', 'cloud_resource'];
  if (semantic && techCategories.includes(semantic.category as SemanticCategory) && !semantic.metadata?.technology) {
    issues.push({
      ruleId: 'MISSING_TECHNOLOGY',
      code: 'MISSING_TECHNOLOGY',
      severity: 'warning',
      title: 'Missing Technology Identifier',
      message: `Architectural node "${nodeTitle}" should specify a technology (e.g., PostgreSQL).`,
      affectedNodeIds: [node.id],
      affectedEdgeIds: [],
      remediation: 'Add a technology identifier (e.g., postgresql, redis, s3) to the metadata properties to complete the component specification.',
      property: 'semantic.metadata.technology',
    });
  }

  return issues;
}

/**
 * Validates edges for valid relationships and broken connections.
 */
export function validateEdges(nodes: Node<NodeData>[], edges: Edge<EdgeData>[]): ArchitectureValidationIssue[] {
  const issues: ArchitectureValidationIssue[] = [];
  const nodeIds = new Set(nodes.map((n) => n.id));

  edges.forEach((edge) => {
    // Rule: Dangling Connections (Broken references)
    if (!nodeIds.has(edge.source)) {
      issues.push({
        ruleId: 'DANGLING_SOURCE',
        code: 'DANGLING_SOURCE',
        severity: 'critical',
        title: 'Dangling Connection Source',
        message: `Edge "${edge.id}" references a missing source node: ${edge.source}.`,
        affectedNodeIds: [],
        affectedEdgeIds: [edge.id],
        remediation: 'Attach the source handle of this connection to a valid architectural node, or remove the wire if it is no longer needed.',
        metadata: { missingNodeId: edge.source, position: 'source' }
      });
    }
    if (!nodeIds.has(edge.target)) {
      issues.push({
        ruleId: 'DANGLING_TARGET',
        code: 'DANGLING_TARGET',
        severity: 'critical',
        title: 'Dangling Connection Target',
        message: `Edge "${edge.id}" references a missing target node: ${edge.target}.`,
        affectedNodeIds: [],
        affectedEdgeIds: [edge.id],
        remediation: 'Attach the target handle of this connection to a valid architectural node, or remove the wire if it is no longer needed.',
        metadata: { missingNodeId: edge.target, position: 'target' }
      });
    }

    // Rule: Invalid Relationship Type
    const relationship = edge.data?.semantic?.relationship;
    if (relationship && !EDGE_RELATIONSHIP_TYPES.includes(relationship as EdgeRelationshipType)) {
      issues.push({
        ruleId: 'INVALID_RELATIONSHIP',
        code: 'INVALID_RELATIONSHIP',
        severity: 'error',
        title: 'Invalid Relationship Type',
        message: `Edge "${edge.id}" has an unknown relationship type: ${relationship}.`,
        affectedNodeIds: [],
        affectedEdgeIds: [edge.id],
        remediation: 'Change the relationship attribute to a valid standard type (e.g., calls, reads_from, writes_to).',
        property: 'semantic.relationship',
        metadata: { providedRelationship: relationship }
      });
    }

    // Rule: Invalid Edge Metadata Structure
    if (edge.data?.semantic?.metadata && typeof edge.data.semantic.metadata !== 'object') {
      issues.push({
        ruleId: 'INVALID_EDGE_METADATA',
        code: 'INVALID_EDGE_METADATA',
        severity: 'error',
        title: 'Invalid Edge Metadata',
        message: `Edge "${edge.id}" has invalid metadata structure.`,
        affectedNodeIds: [],
        affectedEdgeIds: [edge.id],
        remediation: 'Ensure that the connection semantic metadata consists of a well-formed key-value configuration block.',
        property: 'semantic.metadata',
      });
    }

    // Rule: Generic Relationship (Warning/Info)
    if (relationship === 'generic' || !relationship) {
      issues.push({
        ruleId: 'GENERIC_RELATIONSHIP',
        code: 'GENERIC_RELATIONSHIP',
        severity: 'info',
        title: 'Generic Connection Type',
        message: `Connection between nodes is generic. Consider specifying a meaningful relationship (e.g., "calls").`,
        affectedNodeIds: [],
        affectedEdgeIds: [edge.id],
        remediation: 'Refine the relationship category of this connector to describe specific data flow behavior like calls, reads_from, or publishes_to.',
        property: 'semantic.relationship',
      });
    }
  });

  return issues;
}
