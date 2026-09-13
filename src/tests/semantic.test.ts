import { describe, it, expect } from 'vitest';
import { migrateProject, LUMIO_PROJECT_VERSION, LumioProject } from '../utils/exportUtils';
import { validateProject, validateNode } from '../utils/semanticValidation';
import { Node, Edge } from '@xyflow/react';
import { NodeData, EdgeData } from '../types';

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

    const migrated = migrateProject(legacyProject) as LumioProject;

    expect(migrated.version).toBe(LUMIO_PROJECT_VERSION);
    expect(migrated.nodes[0].data.semantic).toBeDefined();
    expect(migrated.nodes[0].data.semantic?.category).toBe('generic');
    expect(migrated.edges[0].data.semantic).toBeDefined();
    expect(migrated.edges[0].data.semantic?.relationship).toBe('generic');
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

    const migrated = migrateProject(legacyProject) as LumioProject;

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
    const nodes: Node<NodeData>[] = [{ id: '1', data: { title: 'Node 1', semantic: { category: 'generic', metadata: {} } } } as unknown as Node<NodeData>];
    const edges: Edge<EdgeData>[] = [{ id: 'e1', source: '1', target: '99', data: {} } as unknown as Edge<EdgeData>];

    const result = validateProject(nodes, edges);
    expect(result.isValid).toBe(false);
    expect(result.issues.some(i => i.code === 'DANGLING_TARGET')).toBe(true);
  });

  it('should allow custom technology names in semantic metadata', () => {
    const node: Node<NodeData> = {
      id: '1',
      data: {
        title: 'Database',
        semantic: {
          category: 'database',
          metadata: { technology: 'MyCustomDB' }
        }
      }
    } as unknown as Node<NodeData>;

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
        semantic: { relationship: 'calls' }
      }
    } as unknown as Edge<EdgeData>;

    expect(edge.data?.semantic?.relationship).toBe('calls');
  });
});
