import { Node, Edge } from '@xyflow/react';
import { NodeData, EdgeData } from '../../types';
import { ArchitectureRule, ArchitectureValidationIssue } from '../../types/validation';
import { SEMANTIC_CATEGORIES, EDGE_RELATIONSHIP_TYPES, SemanticCategory, EdgeRelationshipType } from '../../types/semantic';

/**
 * Rule 1: Missing Semantic Category
 */
export const missingSemanticTypeRule: ArchitectureRule = {
  ruleId: 'MISSING_SEMANTIC_TYPE',
  name: 'Missing Semantic Category',
  description: 'Ensures that every component on the canvas has an assigned semantic architectural category role.',
  validate(nodes: Node<NodeData>[]): ArchitectureValidationIssue[] {
    const issues: ArchitectureValidationIssue[] = [];
    nodes.forEach((node) => {
      const semantic = node.data?.semantic;
      if (!semantic || !semantic.category) {
        issues.push({
          ruleId: 'MISSING_SEMANTIC_TYPE',
          code: 'MISSING_SEMANTIC_TYPE',
          severity: 'error',
          title: 'Missing Semantic Category',
          message: `Node "${node.data?.title || node.id}" is missing a semantic category.`,
          affectedNodeIds: [node.id],
          affectedEdgeIds: [],
          remediation: 'Open the properties panel for this node and assign an architectural role category.',
          property: 'semantic.category',
        });
      }
    });
    return issues;
  }
};

/**
 * Rule 2: Invalid Semantic Category
 */
export const invalidSemanticTypeRule: ArchitectureRule = {
  ruleId: 'INVALID_SEMANTIC_TYPE',
  name: 'Invalid Semantic Category',
  description: 'Ensures that the assigned category is a known supported taxonomy entry.',
  validate(nodes: Node<NodeData>[]): ArchitectureValidationIssue[] {
    const issues: ArchitectureValidationIssue[] = [];
    nodes.forEach((node) => {
      const semantic = node.data?.semantic;
      if (semantic && semantic.category && !SEMANTIC_CATEGORIES.includes(semantic.category as SemanticCategory)) {
        issues.push({
          ruleId: 'INVALID_SEMANTIC_TYPE',
          code: 'INVALID_SEMANTIC_TYPE',
          severity: 'error',
          title: 'Invalid Semantic Category',
          message: `Node "${node.data?.title || node.id}" has an unknown semantic category: ${semantic.category}.`,
          affectedNodeIds: [node.id],
          affectedEdgeIds: [],
          remediation: 'Change the semantic category to a recognized value from the supported architecture taxonomy.',
          property: 'semantic.category',
          metadata: { providedCategory: semantic.category },
        });
      }
    });
    return issues;
  }
};

/**
 * Rule 3: Invalid Metadata Structure
 */
export const invalidMetadataRule: ArchitectureRule = {
  ruleId: 'INVALID_METADATA',
  name: 'Invalid Metadata Structure',
  description: 'Ensures semantic node metadata block is well-structured.',
  validate(nodes: Node<NodeData>[]): ArchitectureValidationIssue[] {
    const issues: ArchitectureValidationIssue[] = [];
    nodes.forEach((node) => {
      const semantic = node.data?.semantic;
      if (semantic?.metadata && typeof semantic.metadata !== 'object') {
        issues.push({
          ruleId: 'INVALID_METADATA',
          code: 'INVALID_METADATA',
          severity: 'error',
          title: 'Invalid Metadata Structure',
          message: `Node "${node.data?.title || node.id}" has invalid metadata structure.`,
          affectedNodeIds: [node.id],
          affectedEdgeIds: [],
          remediation: 'Ensure that the node metadata configuration is standard structured key-value pairs.',
          property: 'semantic.metadata',
        });
      }
    });
    return issues;
  }
};

/**
 * Rule 4: Missing Technology Identifier
 */
export const missingTechnologyRule: ArchitectureRule = {
  ruleId: 'MISSING_TECHNOLOGY',
  name: 'Missing Technology Identifier',
  description: 'Flags specific backing categories that should explicitly reference an engineering technology target.',
  validate(nodes: Node<NodeData>[]): ArchitectureValidationIssue[] {
    const issues: ArchitectureValidationIssue[] = [];
    const techCategories: SemanticCategory[] = ['database', 'cache', 'queue', 'storage', 'cloud_resource'];
    nodes.forEach((node) => {
      const semantic = node.data?.semantic;
      if (semantic && techCategories.includes(semantic.category as SemanticCategory) && !semantic.metadata?.technology) {
        issues.push({
          ruleId: 'MISSING_TECHNOLOGY',
          code: 'MISSING_TECHNOLOGY',
          severity: 'warning',
          title: 'Missing Technology Identifier',
          message: `Architectural node "${node.data?.title || node.id}" should specify a technology (e.g., PostgreSQL).`,
          affectedNodeIds: [node.id],
          affectedEdgeIds: [],
          remediation: 'Add a technology identifier (e.g., postgresql, redis, s3) to the metadata properties to complete the component specification.',
          property: 'semantic.metadata.technology',
        });
      }
    });
    return issues;
  }
};

/**
 * Rule 5: Dangling Connections
 */
export const danglingConnectionsRule: ArchitectureRule = {
  ruleId: 'DANGLING_CONNECTIONS',
  name: 'Dangling Edge Connections',
  description: 'Ensures wires do not connect to non-existent source or target endpoints.',
  validate(nodes: Node<NodeData>[], edges: Edge<EdgeData>[]): ArchitectureValidationIssue[] {
    const issues: ArchitectureValidationIssue[] = [];
    const nodeIds = new Set(nodes.map((n) => n.id));

    edges.forEach((edge) => {
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
    });
    return issues;
  }
};

/**
 * Rule 6: Invalid Relationship Type
 */
export const invalidRelationshipRule: ArchitectureRule = {
  ruleId: 'INVALID_RELATIONSHIP',
  name: 'Invalid Relationship Type',
  description: 'Ensures edge relationship metadata fits standard communication taxonomies.',
  validate(nodes: Node<NodeData>[], edges: Edge<EdgeData>[]= []): ArchitectureValidationIssue[] {
    const issues: ArchitectureValidationIssue[] = [];
    edges.forEach((edge) => {
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
    });
    return issues;
  }
};

/**
 * Rule 7: Invalid Edge Metadata
 */
export const invalidEdgeMetadataRule: ArchitectureRule = {
  ruleId: 'INVALID_EDGE_METADATA',
  name: 'Invalid Edge Metadata Structure',
  description: 'Ensures structured relationship metadata objects match expected standard schemas.',
  validate(nodes: Node<NodeData>[], edges: Edge<EdgeData>[]= []): ArchitectureValidationIssue[] {
    const issues: ArchitectureValidationIssue[] = [];
    edges.forEach((edge) => {
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
    });
    return issues;
  }
};

/**
 * Rule 8: Generic Relationship Warning
 */
export const genericRelationshipRule: ArchitectureRule = {
  ruleId: 'GENERIC_RELATIONSHIP',
  name: 'Generic Relationship Type Warning',
  description: 'Advises specifying typed relationships rather than generic identifiers.',
  validate(nodes: Node<NodeData>[], edges: Edge<EdgeData>[]= []): ArchitectureValidationIssue[] {
    const issues: ArchitectureValidationIssue[] = [];
    edges.forEach((edge) => {
      const relationship = edge.data?.semantic?.relationship;
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
};

// Bundle core rules for easy dynamic registration
export const CORE_RULES: ArchitectureRule[] = [
  missingSemanticTypeRule,
  invalidSemanticTypeRule,
  invalidMetadataRule,
  missingTechnologyRule,
  danglingConnectionsRule,
  invalidRelationshipRule,
  invalidEdgeMetadataRule,
  genericRelationshipRule
];
