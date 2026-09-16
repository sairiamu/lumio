import { CatalogItem, CatalogProvider, CatalogVisualConfig } from '../types/catalog';

class CatalogRegistry {
  private providers: Map<string, CatalogProvider> = new Map();
  private items: Map<string, CatalogItem> = new Map();

  /**
   * Registers a new provider and its items to the catalog.
   */
  registerProvider(provider: CatalogProvider) {
    this.providers.set(provider.id, provider);
    provider.items.forEach(item => {
      this.items.set(item.id, item);
    });
  }

  /**
   * Gets a single catalog item by its ID.
   */
  getItem(id: string): CatalogItem | undefined {
    return this.items.get(id);
  }

  /**
   * Gets all registered items.
   */
  getAllItems(): CatalogItem[] {
    return Array.from(this.items.values());
  }

  /**
   * Gets all items filtered by category.
   */
  getItemsByCategory(category: string): CatalogItem[] {
    return this.getAllItems().filter(item => item.category === category);
  }

  /**
   * Gets visual configuration for an item, falling back to defaults if not found.
   */
  getItemVisuals(id: string): CatalogVisualConfig {
    const item = this.getItem(id);
    if (item?.visuals) {
      return item.visuals;
    }

    // Default visuals
    return {
      clayColor: 'var(--accent-light)',
      width: 120,
      height: 120,
    };
  }

  /**
   * Gets all registered providers.
   */
  getProviders(): CatalogProvider[] {
    return Array.from(this.providers.values());
  }
}

export const catalogRegistry = new CatalogRegistry();
