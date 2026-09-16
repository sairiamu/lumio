import { Node, Edge } from '@xyflow/react';
import { NodeData, EdgeData } from '../../types';
import { ArchitectureRule, ArchitectureValidationIssue } from '../../types/validation';

/**
 * 1. Public Database Exposure Rule
 * Detects if a client or user category directly connects to a database category node, bypassing an API or Service gateway.
 */
export const publicDatabaseExposureRule: ArchitectureRule = {
  ruleId: 'PUBLIC_DB_EXPOSURE',
  name: 'Public Database Exposure',
  description: 'Detects if client actors or end-user interfaces have direct connections straight into database stores bypassing services or APIs.',
  validate(nodes: Node<NodeData>[], edges: Edge<EdgeData>[]): ArchitectureValidationIssue[] {
    const issues: ArchitectureValidationIssue[] = [];
    const dbNodes = new Set(nodes.filter(n => n.data?.semantic?.category === 'database').map(n => n.id));
    const publicCategories = ['user', 'client'];

    edges.forEach((edge) => {
      if (dbNodes.has(edge.target)) {
        const sourceNode = nodes.find(n => n.id === edge.source);
        const sourceCategory = sourceNode?.data?.semantic?.category;
        if (sourceCategory && publicCategories.includes(sourceCategory)) {
          issues.push({
            ruleId: 'PUBLIC_DB_EXPOSURE',
            code: 'PUBLIC_DB_EXPOSURE',
            severity: 'critical',
            title: 'Public Database Exposure',
            message: `The database node "${nodes.find(n => n.id === edge.target)?.data?.title || edge.target}" is directly connected to public/client tier "${sourceNode?.data?.title || edge.source}".`,
            affectedNodeIds: [edge.source, edge.target],
            affectedEdgeIds: [edge.id],
            remediation: 'Route client requests through an intermediary secure backend microservice or API gateway tier instead of direct exposure.',
            metadata: { sourceCategory, targetCategory: 'database' }
          });
        }
      }
    });
    return issues;
  }
};

/**
 * 2. Unauthenticated Service Entry Rule
 * Checks service components with required auth metadata explicitly enabled, or checks if an API gateway enforces 'None' or missing authentication protocol.
 */
export const unauthenticatedServiceRule: ArchitectureRule = {
  ruleId: 'UNAUTHENTICATED_SERVICE_ENTRY',
  name: 'Unauthenticated Service Entry',
  description: 'Detects services or API gateways explicitly configured without an authorization guard when structural components require security context.',
  validate(nodes: Node<NodeData>[]): ArchitectureValidationIssue[] {
    const issues: ArchitectureValidationIssue[] = [];

    nodes.forEach((node) => {
      const category = node.data?.semantic?.category;
      const metadata = node.data?.semantic?.metadata;

      if (category === 'api' && metadata?.authentication === 'None') {
        issues.push({
          ruleId: 'UNAUTHENTICATED_SERVICE_ENTRY',
          code: 'UNAUTHENTICATED_SERVICE_ENTRY',
          severity: 'error',
          title: 'Unauthenticated API Gate',
          message: `The API element "${node.data?.title || node.id}" explicitly disables authorization enforcement.`,
          affectedNodeIds: [node.id],
          affectedEdgeIds: [],
          remediation: 'Update the authorization property to a secure protocol such as Bearer Token, JWT, or OAuth2.',
          property: 'semantic.metadata.authentication'
        });
      }
    });
    return issues;
  }
};

/**
 * 3. Production Database Backup Missing Rule
 * If a database node environment property is set explicitly to 'production', assert that metadata specifies backup details.
 */
export const productionDatabaseBackupRule: ArchitectureRule = {
  ruleId: 'PRODUCTION_DB_BACKUP_MISSING',
  name: 'Production Database Backup Missing',
  description: 'Asserts that any database element explicitly assigned to a production tier includes configuration details validating backup parameters.',
  validate(nodes: Node<NodeData>[]): ArchitectureValidationIssue[] {
    const issues: ArchitectureValidationIssue[] = [];

    nodes.forEach((node) => {
      const semantic = node.data?.semantic;
      if (semantic?.category === 'database' && semantic?.metadata?.environment === 'production') {
        const hasBackup = semantic.metadata.backup === true || semantic.metadata.backupEnabled === true || !!semantic.metadata.backupInterval || !!semantic.metadata.backupRetention;
        if (!hasBackup) {
          issues.push({
            ruleId: 'PRODUCTION_DB_BACKUP_MISSING',
            code: 'PRODUCTION_DB_BACKUP_MISSING',
            severity: 'critical',
            title: 'Production Database Backup Missing',
            message: `The database component "${node.data?.title || node.id}" is assigned to production environment but does not have configured backup properties.`,
            affectedNodeIds: [node.id],
            affectedEdgeIds: [],
            remediation: 'Configure automated backup policies, snapshots, or retention variables in the component metadata properties panel.',
            property: 'semantic.metadata.backup'
          });
        }
      }
    });
    return issues;
  }
};

/**
 * 4. Missing Encryption on Sensitive Flows Rule
 * Evaluates connections carrying confidential communications. If protocol metadata is unencrypted (e.g., HTTP, WS, AMQP) on critical connections, reports a finding.
 */
export const unencryptedSensitiveFlowRule: ArchitectureRule = {
  ruleId: 'UNENCRYPTED_SENSITIVE_FLOW',
  name: 'Unencrypted Sensitive Data Flow',
  description: 'Scans relationships between endpoints for plaintext or unencrypted protocols on sensitive data boundaries.',
  validate(nodes: Node<NodeData>[], edges: Edge<EdgeData>[]): ArchitectureValidationIssue[] {
    const issues: ArchitectureValidationIssue[] = [];

    edges.forEach((edge) => {
      const protocol = edge.data?.semantic?.metadata?.protocol;
      if (protocol) {
        const lowerProto = String(protocol).toLowerCase();
        const unencryptedProtos = ['http', 'ws', 'amqp', 'ftp', 'telnet'];

        if (unencryptedProtos.includes(lowerProto)) {
          issues.push({
            ruleId: 'UNENCRYPTED_SENSITIVE_FLOW',
            code: 'UNENCRYPTED_SENSITIVE_FLOW',
            severity: 'error',
            title: 'Unencrypted Data Transit Protocol',
            message: `The relationship connection references an unencrypted wire transmission protocol: "${protocol}".`,
            affectedNodeIds: [edge.source, edge.target],
            affectedEdgeIds: [edge.id],
            remediation: 'Upgrade communication protocol wrappers to use cryptographically secure extensions (e.g., HTTPS, WSS, AMQPS, SFTP).',
            property: 'semantic.metadata.protocol',
            metadata: { protocol }
          });
        }
      }
    });
    return issues;
  }
};

/**
 * 5. Dangling Relationship/Reference Rule
 * Verifies that all edges correspond strictly to defined source and target nodes.
 */
export const danglingRelationshipRule: ArchitectureRule = {
  ruleId: 'DANGLING_REL_REFERENCE',
  name: 'Dangling Relationship Reference',
  description: 'Ensures wires do not connect to missing graph endpoints.',
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
          message: `Edge references a missing source identifier node: ${edge.source}.`,
          affectedNodeIds: [],
          affectedEdgeIds: [edge.id],
          remediation: 'Reattach the connection wire source or purge the dangling reference.',
        });
      }
      if (!nodeIds.has(edge.target)) {
        issues.push({
          ruleId: 'DANGLING_TARGET',
          code: 'DANGLING_TARGET',
          severity: 'critical',
          title: 'Dangling Connection Target',
          message: `Edge references a missing target identifier node: ${edge.target}.`,
          affectedNodeIds: [],
          affectedEdgeIds: [edge.id],
          remediation: 'Reattach the connection wire target or purge the dangling reference.',
        });
      }
    });
    return issues;
  }
};

/**
 * 6. Invalid Semantic Node Metadata Rule
 * Strictly checks that metadata objects are type-compliant records.
 */
export const invalidSemanticMetadataRule: ArchitectureRule = {
  ruleId: 'INVALID_SEMANTIC_NODE_METADATA',
  name: 'Invalid Semantic Node Metadata',
  description: 'Ensures that semantic properties are assigned structured records and objects.',
  validate(nodes: Node<NodeData>[]): ArchitectureValidationIssue[] {
    const issues: ArchitectureValidationIssue[] = [];

    nodes.forEach((node) => {
      const metadata = node.data?.semantic?.metadata;
      if (metadata && (typeof metadata !== 'object' || Array.isArray(metadata))) {
        issues.push({
          ruleId: 'INVALID_SEMANTIC_NODE_METADATA',
          code: 'INVALID_SEMANTIC_NODE_METADATA',
          severity: 'error',
          title: 'Invalid Semantic Node Metadata',
          message: `The custom component "${node.data?.title || node.id}" contains an invalid non-object metadata block.`,
          affectedNodeIds: [node.id],
          affectedEdgeIds: [],
          remediation: 'Refactor custom metadata properties back into a structured dictionary/record object.',
          property: 'semantic.metadata'
        });
      }
    });
    return issues;
  }
};

/**
 * 7. Single-Node Dependency Bottleneck Rule
 * Checks if a single service or api gateway node has an out-degree or in-degree disproportionately large relative to the graph size, acting as a critical single point of failure (SPOF).
 */
export const nodeDependencyBottleneckRule: ArchitectureRule = {
  ruleId: 'SINGLE_NODE_BOTTLENECK',
  name: 'Single-Node Dependency Bottleneck',
  description: 'Scans the topology to flag nodes with excessive connection densities representing single points of failure.',
  validate(nodes: Node<NodeData>[], edges: Edge<EdgeData>[]): ArchitectureValidationIssue[] {
    const issues: ArchitectureValidationIssue[] = [];
    if (nodes.length < 4) return []; // Only execute validation on reasonably sized diagrams to avoid false positives

    const connectionCounts: Record<string, number> = {};
    nodes.forEach(n => { connectionCounts[n.id] = 0; });

    edges.forEach((edge) => {
      if (connectionCounts[edge.source] !== undefined) connectionCounts[edge.source]++;
      if (connectionCounts[edge.target] !== undefined) connectionCounts[edge.target]++;
    });

    nodes.forEach((node) => {
      const count = connectionCounts[node.id];
      // Conservative structural threshold: a single node handles more than 75% of total node-count degrees
      if (count > nodes.length * 0.75) {
        issues.push({
          ruleId: 'SINGLE_NODE_BOTTLENECK',
          code: 'SINGLE_NODE_BOTTLENECK',
          severity: 'warning',
          title: 'Single Point of Failure Bottleneck',
          message: `The component "${node.data?.title || node.id}" exhibits extreme relationship density (${count} links), acting as a centralized bottleneck.`,
          affectedNodeIds: [node.id],
          affectedEdgeIds: [],
          remediation: 'Introduce horizontal replication, cache layers, message brokers, or decentralize functional boundaries to split component responsibility.'
        });
      }
    });

    return issues;
  }
};

export const DETERMINISTIC_RULES: ArchitectureRule[] = [
  publicDatabaseExposureRule,
  unauthenticatedServiceRule,
  productionDatabaseBackupRule,
  unencryptedSensitiveFlowRule,
  danglingRelationshipRule,
  invalidSemanticMetadataRule,
  nodeDependencyBottleneckRule
];
