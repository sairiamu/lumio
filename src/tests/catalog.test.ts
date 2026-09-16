import { describe, it, expect, beforeEach } from 'vitest';
import { catalogRegistry } from '../data/catalogRegistry';
import { CORE_PROVIDER } from '../data/providers/coreProvider';
import { NodeSemantic } from '../types/semantic';
import { CatalogItem } from '../types/catalog';
import { Node } from '@xyflow/react';
import { NodeData } from '../types';

describe('Architecture Catalog', () => {
  beforeEach(() => {
    // Ensure registry is initialized with core provider
    catalogRegistry.registerProvider(CORE_PROVIDER);
  });

  it('should support catalog lookup by ID', () => {
    const item = catalogRegistry.getItem('tech_postgresql');
    expect(item).toBeDefined();
    expect(item?.displayName).toBe('PostgreSQL Database');
    expect(item?.category).toBe('database');
  });

  it('should support category filtering', () => {
    const databases = catalogRegistry.getItemsByCategory('database');
    expect(databases.length).toBeGreaterThan(0);
    expect(databases.every(d => d.category === 'database')).toBe(true);

    const postgres = databases.find(d => d.id === 'tech_postgresql');
    expect(postgres).toBeDefined();
  });

  it('should support technology search/tag matching', () => {
    const allItems = catalogRegistry.getAllItems();

    // Search by display name
    const postgresSearch = allItems.filter(item =>
      item.displayName.toLowerCase().includes('postgre')
    );
    expect(postgresSearch.some(i => i.id === 'tech_postgresql')).toBe(true);

    // Search by tags
    const sqlSearch = allItems.filter(item =>
      item.tags.includes('sql')
    );
    expect(sqlSearch.some(i => i.id === 'tech_postgresql')).toBe(true);
    expect(sqlSearch.some(i => i.id === 'tech_mysql')).toBe(true);
  });

  it('should generate correct semantic metadata for catalog items', () => {
    const redis = catalogRegistry.getItem('tech_redis');
    expect(redis?.defaultSemantic).toBeDefined();
    expect(redis?.defaultSemantic.category).toBe('cache');
    expect(redis?.defaultSemantic.metadata.technology).toBe('redis');
  });

  it('should generate structured properties based on catalog definitions', () => {
    const pg = catalogRegistry.getItem('tech_postgresql');
    expect(pg?.properties).toBeDefined();

    const engineProp = pg?.properties.find(p => p.key === 'engine');
    expect(engineProp).toBeDefined();
    expect(engineProp?.type).toBe('select');
    expect(engineProp?.options).toContain('Standard PostgreSQL');
    expect(engineProp?.defaultValue).toBe('Standard PostgreSQL');
  });

  it('should simulate node creation from catalog entries', () => {
    const catalogId = 'tech_aws_lambda';
    const item = catalogRegistry.getItem(catalogId);
    const visuals = catalogRegistry.getItemVisuals(catalogId);

    if (!item) throw new Error('Item not found');

    const newNode: Node<NodeData> = {
      id: 'test_node_1',
      type: 'universal',
      position: { x: 0, y: 0 },
      data: {
        title: '',
        catalogId: item.id,
        parameters: item.properties.map(p => ({ key: p.key, value: String(p.defaultValue ?? '') })),
        description: item.description,
        clayColor: visuals.clayColor,
        semantic: item.defaultSemantic,
      },
      width: visuals.width,
      height: visuals.height,
    };

    expect(newNode.data.catalogId).toBe('tech_aws_lambda');
    expect(newNode.data.semantic?.category).toBe('service');
    expect(newNode.data.semantic?.metadata.technology).toBe('aws_lambda');
    expect(newNode.data.parameters.some(p => p.key === 'runtime')).toBe(true);
    expect(newNode.width).toBe(120);
    expect(newNode.height).toBe(80);
  });

  it('should support persistence of catalog-created nodes (serialization)', () => {
    const node: Node<NodeData> = {
      id: 'persisted_node',
      type: 'universal',
      position: { x: 10, y: 10 },
      data: {
        title: 'Production DB',
        catalogId: 'tech_postgresql',
        parameters: [
          { key: 'engine', value: 'AWS Aurora Postgres' },
          { key: 'version', value: '15' }
        ],
        description: 'Primary database',
        semantic: {
          category: 'database',
          metadata: { technology: 'postgresql', environment: 'production' }
        }
      }
    };

    const serialized = JSON.stringify(node);
    const parsed = JSON.parse(serialized) as Node<NodeData>;

    expect(parsed.data.catalogId).toBe('tech_postgresql');
    expect(parsed.data.parameters).toHaveLength(2);
    expect(parsed.data.parameters.find(p => p.key === 'engine')?.value).toBe('AWS Aurora Postgres');
    expect(parsed.data.semantic?.category).toBe('database');
  });
});
