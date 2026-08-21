/**
 * Lumio V2 Feature Flag
 * When true, enables the new Login -> Dashboard -> Project Type flow.
 * Default is false for main branch safety.
 */
export const V2_ENABLED = import.meta.env.VITE_V2_ENABLED === 'true';
