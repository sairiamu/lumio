import { describe, it, expect } from 'vitest';
import { migrateProject, LUMIO_PROJECT_VERSION, LumioProject } from '../utils/exportUtils';
import { validateProject, validateNode, validateEdges } from '../utils/semanticValidation';
import { Node, Edge } from '@xyflow/react';
import { NodeData, EdgeData } from '../types';
import { SemanticCategory, EdgeRelationshipType } from '../types/semantic';

describe('Lumio Semantic Metadata', () => {
  it('should migrate legacy v1.0 files to v1.1 with default semantic data', () => {
    const legacyProject = {
      version: '1.0',
      nodes: [
        { id: '1', data: { title: 'Legacy Node' } }
      ],
      edges: [
        { id: 'e1', source: '1', target: '2', data: {} }
      ]
    };

    const migrated = migrateProject(legacyProject);

    expect(migrated.version).toBe(LUMIO_PROJECT_VERSION);
    expect(migrated.nodes[0].data.semantic).toBeDefined();
    expect(migrated.nodes[0].data.semantic?.category).toBe('generic');
    expect(migrated.edges[0].data!.semantic).toBeDefined();
    expect(migrated.edges[0].data!.semantic?.relationship).toBe('generic');
  });

  it('should preserve existing visual node data during migration', () => {
    const legacyProject = {
      version: '1.0',
      nodes: [
        {
          id: '1',
          data: {
            title: 'Visual Node',
            clayColor: '#ff0000',
            strokeWidth: 5
          }
        }
      ]
    };

    const migrated = migrateProject(legacyProject);

    expect(migrated.nodes[0].data.title).toBe('Visual Node');
    expect(migrated.nodes[0].data.clayColor).toBe('#ff0000');
    expect(migrated.nodes[0].data.strokeWidth).toBe(5);
  });

  it('should validate missing semantic types', () => {
    const invalidNode = {
      id: '1',
      data: { title: 'Missing Semantic' }
    } as Node<NodeData>;

    const issues = validateNode(invalidNode);
    expect(issues.some(i => i.code === 'MISSING_SEMANTIC_TYPE')).toBe(true);
  });

  it('should validate dangling edge references', () => {
    const nodes: Node<NodeData>[] = [{ id: '1', position: { x: 0, y: 0 }, data: { title: 'Node 1', parameters: [], description: '', semantic: { category: 'generic', metadata: {} } } }];
    const edges: Edge<EdgeData>[] = [{ id: 'e1', source: '1', target: '99', data: { strokeColor: '#000', strokeWidth: 1, strokeStyle: 'solid', animated: false, lineEnd: 'none', lineStart: 'none', pathType: 'default' } }];

    const result = validateProject(nodes, edges);
    expect(result.isValid).toBe(false);
    expect(result.issues.some(i => i.code === 'DANGLING_TARGET')).toBe(true);
  });

  it('should allow custom technology names in semantic metadata', () => {
    const node: Node<NodeData> = {
      id: '1',
      position: { x: 0, y: 0 },
      data: {
        title: 'Database',
        parameters: [],
        description: '',
        semantic: {
          category: 'database',
          metadata: { technology: 'MyCustomDB' }
        }
      }
    };

    const issues = validateNode(node);
    expect(issues.find(i => i.code === 'MISSING_TECHNOLOGY')).toBeUndefined();
    expect(node.data.semantic?.metadata.technology).toBe('MyCustomDB');
  });

  it('should support edge relationship types', () => {
    const edge: Edge<EdgeData> = {
      id: 'e1',
      source: '1',
      target: '2',
      data: {
        strokeColor: '#000',
        strokeWidth: 1,
        strokeStyle: 'solid',
        animated: false,
        lineEnd: 'none',
        lineStart: 'none',
        pathType: 'default',
        semantic: { relationship: 'calls' }
      }
    };

    expect(edge.data?.semantic?.relationship).toBe('calls');
  });

  it('should support creation of semantic nodes with complete node metadata', () => {
    const node: Node<NodeData> = {
      id: 'node-created-1',
      position: { x: 100, y: 150 },
      data: {
        title: 'Auth Service',
        parameters: [{ key: 'port', value: '8080' }],
        description: 'Handles JWT authorization tokens',
        semantic: {
          category: 'service',
          metadata: {
            technology: 'rust',
            version: '1.75',
            environment: 'production',
            tags: ['security', 'microservice']
          }
        }
      }
    };

    expect(node.id).toBe('node-created-1');
    expect(node.data.semantic).toBeDefined();
    expect(node.data.semantic?.category).toBe('service');
    expect(node.data.semantic?.metadata.technology).toBe('rust');
    expect(node.data.semantic?.metadata.version).toBe('1.75');
    expect(node.data.semantic?.metadata.environment).toBe('production');
    expect(node.data.semantic?.metadata.tags).toContain('security');
  });

  it('should support updating semantic metadata properties dynamically', () => {
    const node: Node<NodeData> = {
      id: 'node-update-1',
      position: { x: 0, y: 0 },
      data: {
        title: 'In-Memory Cache',
        parameters: [],
        description: 'Session store',
        semantic: {
          category: 'cache',
          metadata: { technology: 'redis' }
        }
      }
    };

    node.data.semantic = {
      category: 'database',
      metadata: {
        technology: 'redis',
        version: '7.2',
        clusterMode: true
      }
    };

    expect(node.data.semantic.category).toBe('database');
    expect(node.data.semantic.metadata.version).toBe('7.2');
    expect(node.data.semantic.metadata.clusterMode).toBe(true);
  });

  it('should support end-to-end project serialization and deserialization with semantic context', () => {
    const originalProject: LumioProject = {
      version: LUMIO_PROJECT_VERSION,
      projectName: 'Architecture Schema',
      projectType: 'elemental-sketch',
      exportedAt: new Date().toISOString(),
      nodes: [
        {
          id: 'n-ser-1',
          position: { x: 50, y: 50 },
          data: {
            title: 'Frontend Client',
            parameters: [],
            description: 'Web dashboard',
            semantic: {
              category: 'client',
              metadata: { technology: 'react', version: '19.0' }
            }
          }
        }
      ],
      edges: [
        {
          id: 'e-ser-1',
          source: 'n-ser-1',
          target: 'n-ser-2',
          data: {
            strokeColor: '#ffffff',
            strokeWidth: 2,
            strokeStyle: 'solid',
            animated: true,
            lineEnd: 'arrow',
            lineStart: 'none',
            pathType: 'smooth',
            semantic: {
              relationship: 'calls',
              metadata: { protocol: 'gRPC', dataFlow: 'bidirectional' }
            }
          }
        }
      ],
      freehandStrokes: [],
      shapeStyle: { fill: '#111', stroke: '#222', strokeWidth: 2, fontSize: 14, fontFamily: 'Inter', opacity: 0.9 }
    };

    const serializedStr = JSON.stringify(originalProject);
    const parsedObj = JSON.parse(serializedStr);
    const verifiedProject = migrateProject(parsedObj);

    expect(verifiedProject.projectName).toBe('Architecture Schema');
    expect(verifiedProject.nodes[0].data.semantic?.category).toBe('client');
    expect(verifiedProject.nodes[0].data.semantic?.metadata.technology).toBe('react');
    expect(verifiedProject.edges[0].data!.semantic?.relationship).toBe('calls');
    expect(verifiedProject.edges[0].data!.semantic?.metadata?.protocol).toBe('gRPC');
  });

  it('should successfully handle loading legacy Lumio files and backfill semantic defaults', () => {
    const legacyProject = {
      version: '1.0',
      projectName: 'Legacy App Layout',
      nodes: [
        { id: 'node-legacy', type: 'default', position: { x: 10, y: 10 }, data: { title: 'Legacy Frontend' } }
      ],
      edges: [
        { id: 'edge-legacy', source: 'node-legacy', target: 'node-target', data: {} }
      ]
    };

    const upgradedProject = migrateProject(legacyProject);

    expect(upgradedProject.version).toBe(LUMIO_PROJECT_VERSION);
    expect(upgradedProject.nodes[0].data.semantic).toBeDefined();
    expect(upgradedProject.nodes[0].data.semantic?.category).toBe('generic');
    expect(upgradedProject.edges[0].data!.semantic).toBeDefined();
    expect(upgradedProject.edges[0].data!.semantic?.relationship).toBe('generic');
  });

  it('should support rich semantic edge metadata attributes', () => {
    const edge: Edge<EdgeData> = {
      id: 'edge-rich-1',
      source: 'src-node',
      target: 'tgt-node',
      data: {
        strokeColor: '#ff0000',
        strokeWidth: 3,
        strokeStyle: 'dotted',
        animated: false,
        lineEnd: 'circle',
        lineStart: 'none',
        pathType: 'step',
        semantic: {
          relationship: 'publishes_to',
          metadata: {
            description: 'Publishes payment confirmation messages',
            protocol: 'AMQP',
            dataFlow: 'unidirectional',
            queueName: 'payment-events'
          }
        }
      }
    };

    expect(edge.data!.semantic?.relationship).toBe('publishes_to');
    expect(edge.data!.semantic?.metadata?.description).toBe('Publishes payment confirmation messages');
    expect(edge.data!.semantic?.metadata?.protocol).toBe('AMQP');
    expect(edge.data!.semantic?.metadata?.dataFlow).toBe('unidirectional');
    expect(edge.data!.semantic?.metadata?.queueName).toBe('payment-events');
  });

  it('should validate advanced semantic integrity including invalid categories and missing technology warnings', () => {
    const invalidCatNode: Node<NodeData> = {
      id: 'n-invalid-cat',
      position: { x: 0, y: 0 },
      data: {
        title: 'Strange Node',
        parameters: [],
        description: '',
        semantic: {
          category: 'invalid_category_placeholder' as unknown as SemanticCategory,
          metadata: {}
        }
      }
    };

    const issues1 = validateNode(invalidCatNode);
    expect(issues1.some(i => i.code === 'INVALID_SEMANTIC_TYPE')).toBe(true);

    const missingTechNode: Node<NodeData> = {
      id: 'n-missing-tech',
      position: { x: 0, y: 0 },
      data: {
        title: 'Main Database Store',
        parameters: [],
        description: '',
        semantic: {
          category: 'database',
          metadata: {}
        }
      }
    };

    const issues2 = validateNode(missingTechNode);
    expect(issues2.some(i => i.code === 'MISSING_TECHNOLOGY')).toBe(true);

    const invalidEdge: Edge<EdgeData> = {
      id: 'e-invalid-rel',
      source: 'n-missing-tech',
      target: 'n-invalid-cat',
      data: {
        strokeColor: '#000',
        strokeWidth: 1,
        strokeStyle: 'solid',
        animated: false,
        lineEnd: 'none',
        lineStart: 'none',
        pathType: 'default',
        semantic: {
          relationship: 'non_existent_relationship' as unknown as EdgeRelationshipType
        }
      }
    };

    const nodesList = [missingTechNode, invalidCatNode];
    const edgeIssues = validateEdges(nodesList, [invalidEdge]);
    expect(edgeIssues.some(i => i.code === 'INVALID_RELATIONSHIP')).toBe(true);
  });

  it('should fully preserve existing visual node properties and styling fields alongside semantic layer', () => {
    const visualNode: Node<NodeData> = {
      id: 'n-visual-1',
      position: { x: 200, y: 300 },
      data: {
        title: 'Styled Component Node',
        parameters: [],
        description: 'Test node',
        clayColor: '#abcdeb',
        strokeColor: '#123456',
        strokeWidth: 4,
        strokeStyle: 'dotted',
        fontSize: 18,
        fontFamily: 'JetBrains Mono',
        opacity: 0.75,
        semantic: {
          category: 'generic',
          metadata: {}
        }
      }
    };

    expect(visualNode.data.title).toBe('Styled Component Node');
    expect(visualNode.data.clayColor).toBe('#abcdeb');
    expect(visualNode.data.strokeColor).toBe('#123456');
    expect(visualNode.data.strokeWidth).toBe(4);
    expect(visualNode.data.strokeStyle).toBe('dotted');
    expect(visualNode.data.fontSize).toBe(18);
    expect(visualNode.data.fontFamily).toBe('JetBrains Mono');
    expect(visualNode.data.opacity).toBe(0.75);
    expect(visualNode.data.semantic?.category).toBe('generic');
  });
});
