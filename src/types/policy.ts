/**
 * Data-driven architecture policy configuration domain types.
 */

export interface ArchitecturePolicyConfig {
  requireProductionDbBackups: boolean;
  requireExternalApiAuth: boolean;
  enforceEncryptedDataFlows: boolean;
  prohibitPublicDatabaseExposure: boolean;
  customThresholds?: Record<string, unknown>;
}

export const DEFAULT_ARCHITECTURE_POLICY: ArchitecturePolicyConfig = {
  requireProductionDbBackups: true,
  requireExternalApiAuth: true,
  enforceEncryptedDataFlows: true,
  prohibitPublicDatabaseExposure: true,
  customThresholds: {
    bottleneckLinkDensityRatio: 0.75,
    minimumNodesForBottleneckCheck: 4
  }
};
