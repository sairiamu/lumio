import { CatalogProvider } from '../../types/catalog';

export const CORE_PROVIDER: CatalogProvider = {
  id: 'core',
  name: 'Core Architecture Components',
  items: [
    // --- Users / Clients ---
    {
      id: 'tech_generic_user',
      category: 'user',
      displayName: 'End User / Actor',
      description: 'Represents a generic human operator, end user, or client actor.',
      icon: 'User',
      defaultSemantic: {
        category: 'user',
        metadata: { technology: 'generic', environment: 'production' },
      },
      properties: [
        { key: 'role', label: 'Role / Persona', type: 'string', defaultValue: 'Customer' },
      ],
      supportedRelationships: [
        { type: 'calls', targetCategories: ['api', 'client', 'service'] },
        { type: 'connects_to' }
      ],
      tags: ['user', 'actor', 'client'],
      visuals: { clayColor: '#E2E8F0', width: 90, height: 90, accentColor: '#475569' }
    },
    {
      id: 'tech_react',
      category: 'client',
      displayName: 'React SPA Client',
      description: 'Modern frontend single-page web application client layer.',
      icon: 'Monitor',
      defaultSemantic: {
        category: 'client',
        metadata: { technology: 'react', environment: 'production' },
      },
      properties: [
        { key: 'framework', label: 'Framework Stack', type: 'select', options: ['Vite + React', 'Next.js', 'Remix'], defaultValue: 'Vite + React' },
      ],
      supportedRelationships: [
        { type: 'calls', targetCategories: ['api', 'service', 'external_system'] },
        { type: 'depends_on' }
      ],
      tags: ['frontend', 'ui', 'spa', 'web'],
      visuals: { clayColor: '#61DAFB', width: 140, height: 100, accentColor: '#0891B2' }
    },

    // --- APIs ---
    {
      id: 'tech_api_gateway',
      category: 'api',
      displayName: 'API Gateway',
      description: 'API Gateway router for request routing, auth enforcement, and rate limiting.',
      icon: 'Shuffle',
      defaultSemantic: {
        category: 'api',
        metadata: { technology: 'api_gateway', environment: 'production' },
      },
      properties: [
        { key: 'engine', label: 'Engine Provider', type: 'select', options: ['AWS API Gateway', 'Kong', 'Nginx', 'KrakenD'], defaultValue: 'AWS API Gateway' },
        { key: 'version', label: 'Version', type: 'string', defaultValue: 'v2' },
        { key: 'authentication', label: 'Authentication Type', type: 'select', options: ['JWT', 'OAuth2', 'API Keys', 'None'], defaultValue: 'JWT' },
      ],
      supportedRelationships: [
        { type: 'calls', targetCategories: ['api', 'service', 'external_system'] },
        { type: 'depends_on' },
        { type: 'connects_to' }
      ],
      tags: ['gateway', 'api', 'routing', 'security'],
      visuals: { clayColor: '#A855F7', width: 130, height: 90, accentColor: '#7E22CE' }
    },
    {
      id: 'tech_graphql_api',
      category: 'api',
      displayName: 'GraphQL Endpoint',
      description: 'Flexible typed data access api endpoint layer.',
      icon: 'Share2',
      defaultSemantic: {
        category: 'api',
        metadata: { technology: 'graphql', environment: 'production' },
      },
      properties: [
        { key: 'protocol', label: 'Protocol Type', type: 'select', options: ['HTTP POST', 'WebSockets', 'gRPC-web'], defaultValue: 'HTTP POST' },
        { key: 'version', label: 'API Version', type: 'string', defaultValue: 'v1.0' },
        { key: 'authentication', label: 'Authentication', type: 'select', options: ['Bearer Token', 'Cookie-Based', 'Public'], defaultValue: 'Bearer Token' },
      ],
      supportedRelationships: [
        { type: 'calls', targetCategories: ['api', 'service', 'external_system'] },
        { type: 'depends_on' }
      ],
      tags: ['api', 'graphql', 'query'],
      visuals: { clayColor: '#E10098', width: 130, height: 90, accentColor: '#9D174D' }
    },

    // --- Services ---
    {
      id: 'tech_nodejs',
      category: 'service',
      displayName: 'Node.js Microservice',
      description: 'Scalable service layer running asynchronous JavaScript or TypeScript runtime workflows.',
      icon: 'Server',
      defaultSemantic: {
        category: 'service',
        metadata: { technology: 'node', environment: 'production' },
      },
      properties: [
        { key: 'runtime', label: 'Runtime Environment', type: 'string', defaultValue: 'Node v20.x' },
        { key: 'environment', label: 'Deployment Stage', type: 'select', options: ['production', 'staging', 'development'], defaultValue: 'production' },
      ],
      supportedRelationships: [
        { type: 'calls', targetCategories: ['service', 'api', 'external_system'] },
        { type: 'reads_from', targetCategories: ['database', 'cache', 'storage'] },
        { type: 'writes_to', targetCategories: ['database', 'cache', 'storage'] },
        { type: 'depends_on' }
      ],
      tags: ['backend', 'service', 'javascript', 'api'],
      visuals: { clayColor: '#339933', width: 150, height: 80, accentColor: '#166534' }
    },
    {
      id: 'tech_aws_lambda',
      category: 'service',
      displayName: 'AWS Lambda Function',
      description: 'Ephemeral event-driven serverless computing function layer execution block.',
      icon: 'Zap',
      defaultSemantic: {
        category: 'service',
        metadata: { technology: 'aws_lambda', environment: 'production' },
      },
      properties: [
        { key: 'runtime', label: 'Function Runtime', type: 'select', options: ['Node.js 20', 'Python 3.11', 'Go 1.x', 'Rust'], defaultValue: 'Node.js 20' },
        { key: 'environment', label: 'Execution Environment', type: 'select', options: ['production', 'staging', 'development'], defaultValue: 'production' },
      ],
      supportedRelationships: [
        { type: 'calls', targetCategories: ['service', 'api', 'external_system'] },
        { type: 'reads_from', targetCategories: ['database', 'cache', 'storage'] },
        { type: 'writes_to', targetCategories: ['database', 'cache', 'storage'] },
        { type: 'publishes_to', targetCategories: ['queue'] }
      ],
      tags: ['serverless', 'lambda', 'aws', 'compute'],
      visuals: { clayColor: '#FF9900', width: 120, height: 80, accentColor: '#C2410C' }
    },

    // --- Databases ---
    {
      id: 'tech_postgresql',
      category: 'database',
      displayName: 'PostgreSQL Database',
      description: 'Advanced production-ready transactional relational database manager.',
      icon: 'Database',
      defaultSemantic: {
        category: 'database',
        metadata: { technology: 'postgresql', environment: 'production' },
      },
      properties: [
        { key: 'engine', label: 'Engine Variant', type: 'select', options: ['Standard PostgreSQL', 'AWS Aurora Postgres', 'Supabase Postgres'], defaultValue: 'Standard PostgreSQL' },
        { key: 'version', label: 'Version Major', type: 'select', options: ['14', '15', '16'], defaultValue: '16' },
        { key: 'environment', label: 'Database Env', type: 'select', options: ['production', 'staging', 'development'], defaultValue: 'production' },
        { key: 'region', label: 'Cloud Region', type: 'string', defaultValue: 'us-east-1' },
      ],
      supportedRelationships: ['reads_from', 'writes_to', 'depends_on'],
      tags: ['sql', 'rdbms', 'storage', 'database'],
      visuals: { clayColor: '#336791', width: 130, height: 130, accentColor: '#1E3A8A' }
    },
    {
      id: 'tech_mysql',
      category: 'database',
      displayName: 'MySQL Database',
      description: 'Highly popular widely deployed structured open-source relational database.',
      icon: 'Database',
      defaultSemantic: {
        category: 'database',
        metadata: { technology: 'mysql', environment: 'production' },
      },
      properties: [
        { key: 'engine', label: 'Engine Variant', type: 'select', options: ['Standard MySQL', 'AWS Aurora MySQL'], defaultValue: 'Standard MySQL' },
        { key: 'version', label: 'Engine Version', type: 'select', options: ['5.7', '8.0', '8.4'], defaultValue: '8.0' },
        { key: 'environment', label: 'Database Env', type: 'select', options: ['production', 'staging', 'development'], defaultValue: 'production' },
        { key: 'region', label: 'Cloud Region', type: 'string', defaultValue: 'us-west-2' },
      ],
      supportedRelationships: ['reads_from', 'writes_to'],
      tags: ['sql', 'mysql', 'relational'],
      visuals: { clayColor: '#00758F', width: 130, height: 130, accentColor: '#155E75' }
    },
    {
      id: 'tech_mongodb',
      category: 'database',
      displayName: 'MongoDB Cluster',
      description: 'Flexible JSON-like document-oriented schema-less non-relational database manager.',
      icon: 'Braces',
      defaultSemantic: {
        category: 'database',
        metadata: { technology: 'mongodb', environment: 'production' },
      },
      properties: [
        { key: 'engine', label: 'Engine Architecture', type: 'select', options: ['MongoDB Atlas', 'Self-Hosted Cluster'], defaultValue: 'MongoDB Atlas' },
        { key: 'version', label: 'Server Version', type: 'string', defaultValue: '7.0' },
        { key: 'environment', label: 'Cluster Cluster Env', type: 'select', options: ['production', 'staging', 'development'], defaultValue: 'production' },
        { key: 'region', label: 'Hosting Region', type: 'string', defaultValue: 'eu-central-1' },
      ],
      supportedRelationships: ['reads_from', 'writes_to'],
      tags: ['nosql', 'document', 'mongo'],
      visuals: { clayColor: '#47A248', width: 130, height: 130, accentColor: '#14532D' }
    },

    // --- Caches ---
    {
      id: 'tech_redis',
      category: 'cache',
      displayName: 'Redis Cache Cluster',
      description: 'High-speed in-memory data store for caching, sessions, and fast lookups.',
      icon: 'Flame',
      defaultSemantic: {
        category: 'cache',
        metadata: { technology: 'redis', environment: 'production' },
      },
      properties: [
        { key: 'version', label: 'Redis Engine Version', type: 'string', defaultValue: '7.2' },
        { key: 'environment', label: 'Cache Tier Env', type: 'select', options: ['production', 'staging', 'development'], defaultValue: 'production' },
      ],
      supportedRelationships: ['reads_from', 'writes_to', 'depends_on'],
      tags: ['cache', 'redis', 'in-memory', 'speed'],
      visuals: { clayColor: '#DC382D', width: 120, height: 120, accentColor: '#991B1B' }
    },

    // --- Queues ---
    {
      id: 'tech_kafka',
      category: 'queue',
      displayName: 'Apache Kafka Broker',
      description: 'Distributed high-throughput event streaming broker layer for pub/sub messaging pipelines.',
      icon: 'Activity',
      defaultSemantic: {
        category: 'queue',
        metadata: { technology: 'kafka', environment: 'production' },
      },
      properties: [
        { key: 'version', label: 'Kafka Version', type: 'string', defaultValue: '3.6' },
        { key: 'environment', label: 'Event Streaming Env', type: 'select', options: ['production', 'staging', 'development'], defaultValue: 'production' },
      ],
      supportedRelationships: [
        { type: 'publishes_to', targetCategories: ['queue', 'service'] },
        { type: 'consumes_from', targetCategories: ['queue', 'service'] }
      ],
      tags: ['queue', 'kafka', 'streaming', 'pubsub'],
      visuals: { clayColor: '#231F20', width: 120, height: 120, accentColor: '#000000' }
    },
    {
      id: 'tech_rabbitmq',
      category: 'queue',
      displayName: 'RabbitMQ Message Bus',
      description: 'Robust flexible AMQP compliant message queuing server for asynchronous workflows.',
      icon: 'Radio',
      defaultSemantic: {
        category: 'queue',
        metadata: { technology: 'rabbitmq', environment: 'production' },
      },
      properties: [
        { key: 'version', label: 'Broker Version', type: 'string', defaultValue: '3.12' },
        { key: 'environment', label: 'Messaging Env', type: 'select', options: ['production', 'staging', 'development'], defaultValue: 'production' },
      ],
      supportedRelationships: [
        { type: 'publishes_to', targetCategories: ['queue', 'service'] },
        { type: 'consumes_from', targetCategories: ['queue', 'service'] }
      ],
      tags: ['queue', 'rabbitmq', 'amqp', 'broker'],
      visuals: { clayColor: '#FF6600', width: 120, height: 120, accentColor: '#9A3412' }
    },

    // --- Storage ---
    {
      id: 'tech_s3',
      category: 'storage',
      displayName: 'AWS S3 Storage Bucket',
      description: 'Highly available infinitely scalable cloud binary object blob asset storage.',
      icon: 'HardDrive',
      defaultSemantic: {
        category: 'storage',
        metadata: { technology: 's3', environment: 'production' },
      },
      properties: [
        { key: 'bucket_name', label: 'Bucket Identifier', type: 'string', defaultValue: 'my-app-assets' },
        { key: 'region', label: 'AWS Bucket Region', type: 'string', defaultValue: 'us-east-1' },
      ],
      supportedRelationships: ['reads_from', 'writes_to'],
      tags: ['aws', 'cloud', 'blob', 'storage'],
      visuals: { clayColor: '#FF9900', width: 110, height: 110, accentColor: '#9A3412' }
    },

    // --- Cloud / Infrastructure ---
    {
      id: 'tech_docker',
      category: 'cloud_resource',
      displayName: 'Docker Container Runtime',
      description: 'Standardized containerized software virtualization execution package environment.',
      icon: 'Container',
      defaultSemantic: {
        category: 'cloud_resource',
        metadata: { technology: 'docker', environment: 'production' },
      },
      properties: [
        { key: 'provider', label: 'Container Host Provider', type: 'select', options: ['AWS ECS', 'GCP Cloud Run', 'Self-Hosted Docker Engine'], defaultValue: 'AWS ECS' },
        { key: 'region', label: 'Deployment Region', type: 'string', defaultValue: 'us-east-1' },
      ],
      supportedRelationships: ['contains', 'depends_on'],
      tags: ['container', 'docker', 'devops'],
      visuals: { clayColor: '#2496ED', width: 130, height: 90, accentColor: '#1D4ED8' }
    },
    {
      id: 'tech_kubernetes',
      category: 'cloud_resource',
      displayName: 'Kubernetes Cluster Namespace',
      description: 'Automated distributed microservice container orchestration manager engine tier.',
      icon: 'Orbit',
      defaultSemantic: {
        category: 'cloud_resource',
        metadata: { technology: 'kubernetes', environment: 'production' },
      },
      properties: [
        { key: 'provider', label: 'K8s Cluster Managed Provider', type: 'select', options: ['AWS EKS', 'GCP GKE', 'Azure AKS', 'Bare-Metal'], defaultValue: 'AWS EKS' },
        { key: 'region', label: 'Cluster Control Region', type: 'string', defaultValue: 'us-east-1' },
      ],
      supportedRelationships: ['contains', 'connects_to'],
      tags: ['k8s', 'orchestration', 'cloud', 'cluster'],
      visuals: { clayColor: '#326CE5', width: 140, height: 140, accentColor: '#1E40AF' }
    },

    // --- External Systems ---
    {
      id: 'tech_external_system_generic',
      category: 'external_system',
      displayName: 'Third Party External Integration',
      description: 'Represents external downstream vendor services or third-party platform dependencies.',
      icon: 'Globe',
      defaultSemantic: {
        category: 'external_system',
        metadata: { technology: 'generic', environment: 'infrastructure' },
      },
      properties: [
        { key: 'vendor_name', label: 'Vendor Provider Name', type: 'string', defaultValue: 'Stripe API' },
      ],
      supportedRelationships: [
        { type: 'calls', targetCategories: ['api', 'client', 'service'] },
        { type: 'connects_to' }
      ],
      tags: ['external', 'vendor', 'integration', 'saas'],
      visuals: { clayColor: '#64748B', width: 130, height: 90, accentColor: '#334155' }
    },
  ]
};
