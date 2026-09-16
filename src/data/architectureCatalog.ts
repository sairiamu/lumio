import { CatalogVisualConfig } from '../types/catalog';
import { catalogRegistry } from './catalogRegistry';
import { CORE_PROVIDER } from './providers/coreProvider';

/**
 * Initialize the catalog registry with default providers.
 * In a real-world scenario, this could also load external plugins.
 */
catalogRegistry.registerProvider(CORE_PROVIDER);

/**
 * Helper to find a catalog item by ID.
 * Now delegates to the global registry.
 */
export const getCatalogItem = (id: string) => {
  return catalogRegistry.getItem(id);
};

/**
 * Helper to get rendering visuals for a catalog item.
 * Now delegates to the global registry.
 */
export const getCatalogItemVisuals = (id: string): CatalogVisualConfig => {
  return catalogRegistry.getItemVisuals(id);
};

// Re-export registry for advanced usage
export { catalogRegistry };
