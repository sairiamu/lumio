import { SemanticCategory, SemanticTechnology, NodeSemantic, EdgeRelationshipType } from './semantic';

/**
 * Defines a property that can be edited for a specific catalog item.
 */
export interface CatalogProperty {
  key: string;
  label: string;
  type: 'string' | 'number' | 'boolean' | 'select' | 'tags';
  options?: string[]; // For 'select' type
  defaultValue?: any;
  description?: string;
}

/**
 * Canvas rendering/visual properties defined separately
 * to decouple catalog definitions from rendering logic.
 */
export interface CatalogVisualConfig {
  width: number;
  height: number;
  clayColor: string;
  accentColor?: string;
}

/**
 * Constraint or hint for a relationship between nodes.
 */
export interface RelationshipConstraint {
  type: EdgeRelationshipType;
  targetCategories?: SemanticCategory[];
  description?: string;
}

/**
 * A data-driven definition for an architectural component.
 * This is completely decoupled from XYFlow/React rendering/visual logic.
 */
export interface CatalogItem {
  id: string; // e.g., 'tech_postgresql'
  category: SemanticCategory;
  displayName: string;
  description: string;
  icon: string; // Lucide icon name or custom icon path

  // Default semantic state when this item is created
  defaultSemantic: NodeSemantic;

  // Schema for custom properties specific to this technology
  properties: CatalogProperty[];

  // Constraints/hints for relationships
  // Can be a simple list of types or a list of detailed constraints
  supportedRelationships?: (EdgeRelationshipType | RelationshipConstraint)[];

  // Metadata for the catalog itself (tags for searching)
  tags: string[];

  // Optional visual defaults provided by the catalog item
  visuals?: CatalogVisualConfig;
}

/**
 * A provider that supplies a set of catalog items.
 * Allows for modular extensions (e.g., AWS, Kubernetes, etc.)
 */
export interface CatalogProvider {
  id: string;
  name: string;
  items: CatalogItem[];
}

/**
 * The root structure for the Architecture Catalog.
 */
export interface ArchitectureCatalog {
  version: string;
  providers: CatalogProvider[];
}
