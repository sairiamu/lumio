import { NodeSemantic, EdgeSemantic } from '../../types/semantic';

export interface LayoutNode {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  parentId?: string;
  semantic?: NodeSemantic;
}

export interface LayoutEdge {
  id: string;
  source: string;
  target: string;
  semantic?: EdgeSemantic;
}

export interface LayoutGraph {
  nodes: LayoutNode[];
  edges: LayoutEdge[];
}

export interface PositionUpdate {
  id: string;
  x: number;
  y: number;
}

export type LayoutStrategyType =
  | 'hierarchical'
  | 'tree'
  | 'horizontal'
  | 'vertical'
  | 'radial'
  | 'manual';

export interface LayoutOptions {
  direction?: 'LR' | 'TB' | 'RL' | 'BT';
  nodeSpacing?: number;
  levelSpacing?: number;
  componentSpacing?: number;
  useSemanticWeights?: boolean;
}

export interface ILayoutStrategy {
  type: LayoutStrategyType;
  calculate(graph: LayoutGraph, options?: LayoutOptions): PositionUpdate[];
}
