import { LayoutGraph, PositionUpdate, LayoutOptions, ILayoutStrategy, LayoutStrategyType } from '../types';
import { HierarchicalStrategy } from '../strategies/HierarchicalStrategy';

export class LayoutEngine {
  private strategies: Map<LayoutStrategyType, ILayoutStrategy> = new Map();

  constructor() {
    // Register default strategies
    this.registerStrategy(new HierarchicalStrategy());
    // Others will be added here
  }

  registerStrategy(strategy: ILayoutStrategy) {
    this.strategies.set(strategy.type, strategy);
  }

  applyLayout(
    graph: LayoutGraph,
    strategyType: LayoutStrategyType = 'hierarchical',
    options?: LayoutOptions
  ): PositionUpdate[] {
    const strategy = this.strategies.get(strategyType);
    if (!strategy) {
      console.warn(`Strategy ${strategyType} not found, falling back to hierarchical`);
      return this.strategies.get('hierarchical')!.calculate(graph, options);
    }

    return strategy.calculate(graph, options);
  }
}

// Singleton instance for easy access
export const layoutEngine = new LayoutEngine();
