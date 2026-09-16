/**
 * Semantic Category for Lumio nodes.
 * Used to classify nodes based on their architectural role.
 */
export type SemanticCategory =
  | 'user'
  | 'client'
  | 'service'
  | 'api'
  | 'database'
  | 'cache'
  | 'queue'
  | 'storage'
  | 'cloud_resource'
  | 'device'
  | 'external_system'
  | 'generic';

export const SEMANTIC_CATEGORIES: SemanticCategory[] = [
  'user',
  'client',
  'service',
  'api',
  'database',
  'cache',
  'queue',
  'storage',
  'cloud_resource',
  'device',
  'external_system',
  'generic',
];

/**
 * Common technology identifiers that can be used as semantic types.
 * This is extensible.
 */
export type SemanticTechnology =
  | 'postgresql'
  | 'mongodb'
  | 'redis'
  | 'kafka'
  | 'rabbitmq'
  | 'aws_lambda'
  | 'kubernetes'
  | 'docker'
  | 'react'
  | 'node'
  | 'python'
  | 'go'
  | 'rust'
  | 'nginx'
  | 's3'
  | 'dynamodb'
  | string; // Allow for custom strings to keep it extensible

export const COMMON_TECHNOLOGIES: string[] = [
  'postgresql',
  'mongodb',
  'redis',
  'kafka',
  'rabbitmq',
  'aws_lambda',
  'kubernetes',
  'docker',
  'react',
  'node',
  'python',
  'go',
  'rust',
  'nginx',
  's3',
  'dynamodb',
  'firebase',
  'supabase',
  'graphql',
  'elasticsearch',
  'snowflake',
  'terraform',
  'ansible',
  'jenkins',
  'github_actions',
];

/**
 * Maps semantic categories to relevant technologies.
 * Used to filter suggestions in the UI.
 */
export const CATEGORY_TECH_MAP: Record<SemanticCategory, string[]> = {
  database: ['postgresql', 'mongodb', 'dynamodb', 'snowflake', 'supabase', 'firebase', 'elasticsearch'],
  cache: ['redis', 'memcached'],
  queue: ['kafka', 'rabbitmq', 'sqs'],
  service: ['node', 'go', 'python', 'rust', 'aws_lambda', 'kubernetes', 'docker'],
  api: ['graphql', 'rest', 'grpc', 'node', 'go'],
  client: ['react', 'vue', 'angular', 'nextjs'],
  storage: ['s3', 'ebs', 'gcs'],
  cloud_resource: ['terraform', 'ansible', 'aws', 'gcp', 'azure'],
  external_system: ['stripe', 'auth0', 'sendgrid', 'clerk'],
  user: [],
  device: ['ios', 'android', 'iot'],
  generic: [],
};

/**
 * Metadata associated with a specific technology or category.
 * This can be expanded with more specific interfaces for different types.
 */
export interface SemanticMetadata {
  technology?: SemanticTechnology;
  version?: string;
  environment?: 'development' | 'staging' | 'production' | 'infrastructure';
  tags?: string[];
  [key: string]: unknown; // Extensibility for future integrations
}

/**
 * The core semantic identity of a node.
 * Separated from visual properties to allow for semantic reasoning and export.
 */
export interface NodeSemantic {
  category: SemanticCategory;
  metadata: SemanticMetadata;
}

/**
 * Semantic Relationship Type for Lumio edges.
 * Defines the nature of the connection between two nodes.
 */
export type EdgeRelationshipType =
  | 'depends_on'
  | 'calls'
  | 'reads_from'
  | 'writes_to'
  | 'publishes_to'
  | 'consumes_from'
  | 'connects_to'
  | 'contains'
  | 'generic';

export const EDGE_RELATIONSHIP_TYPES: EdgeRelationshipType[] = [
  'depends_on',
  'calls',
  'reads_from',
  'writes_to',
  'publishes_to',
  'consumes_from',
  'connects_to',
  'contains',
  'generic',
];

/**
 * Metadata associated with a specific relationship between nodes.
 * Used to describe the nature of the connection in detail.
 */
export interface EdgeMetadata {
  description?: string;
  protocol?: string;
  dataFlow?: 'bidirectional' | 'unidirectional';
  [key: string]: unknown;
}

/**
 * The core semantic identity of an edge.
 */
export interface EdgeSemantic {
  relationship?: EdgeRelationshipType;
  metadata?: EdgeMetadata;
}
