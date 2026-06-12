import { getReportsPerPurchase } from '@/config/pricing';
import type { MarketSlug } from '@/config/types';
import type { BasicSimulatorInput } from './calculations/basic';
import { loadProAccess, saveProAccess } from './marketStorage';
import type { ProAccess } from './types';

export const MAX_SAME_SIMULATION_EXCEPTIONS = 2;

/** Stable id for a property scenario (coarse buckets to allow slider tweaks). */
export function scenarioFingerprint(input: BasicSimulatorInput): string {
  return [
    input.region,
    Math.round(input.purchasePrice / 1_000),
    Math.round(input.monthlyRent / 10) * 10,
    input.useMortgage ? 1 : 0,
    Math.round(input.downPayment / 1_000),
  ].join('|');
}

export type MigratedProAccess = ProAccess & {
  reportsRemaining: number;
  claimedScenarios: string[];
  sameSimulationExceptions: number;
};

export function migrateProAccess(access: ProAccess): MigratedProAccess {
  return {
    ...access,
    reportsRemaining: access.reportsRemaining ?? getReportsPerPurchase(),
    claimedScenarios: access.claimedScenarios ?? [],
    sameSimulationExceptions: access.sameSimulationExceptions ?? 0,
  };
}

export function getSameSimulationExceptionsRemaining(access: ProAccess | null): number {
  if (!access) return 0;
  const used = migrateProAccess(access).sameSimulationExceptions ?? 0;
  return Math.max(0, MAX_SAME_SIMULATION_EXCEPTIONS - used);
}

export function wouldRequireNewProPurchase(access: ProAccess | null, fingerprint: string): boolean {
  if (!access) return false;
  const migrated = migrateProAccess(access);
  if (migrated.claimedScenarios.includes(fingerprint)) return false;
  return migrated.reportsRemaining <= 0;
}

export function createProAccessFromPayment(sessionId: string): ProAccess {
  return {
    sessionId,
    verifiedAt: Date.now(),
    reportsRemaining: getReportsPerPurchase(),
    claimedScenarios: [],
  };
}

export function canViewProReport(
  access: ProAccess | null,
  fingerprint: string,
): { allowed: boolean; remaining: number } {
  if (!access) return { allowed: false, remaining: 0 };
  const migrated = migrateProAccess(access);
  if (migrated.claimedScenarios.includes(fingerprint)) {
    return { allowed: true, remaining: migrated.reportsRemaining };
  }
  if (migrated.reportsRemaining > 0) {
    return { allowed: true, remaining: migrated.reportsRemaining };
  }
  return { allowed: false, remaining: 0 };
}

/** Consumes one report credit when opening a new scenario. */
export function claimProReport(market: MarketSlug, fingerprint: string): ProAccess | null {
  const access = loadProAccess(market);
  if (!access) return null;
  const migrated = migrateProAccess(access);
  if (migrated.claimedScenarios.includes(fingerprint)) return migrated;
  if (migrated.reportsRemaining <= 0) return migrated;
  const next: ProAccess = {
    ...migrated,
    reportsRemaining: migrated.reportsRemaining - 1,
    claimedScenarios: [...migrated.claimedScenarios, fingerprint],
  };
  saveProAccess(market, next);
  return next;
}

/** Vincula un fingerprint nuevo a la compra actual sin consumir crédito (máx. 2 por compra). */
export function applySameSimulationException(market: MarketSlug, fingerprint: string): ProAccess | null {
  const access = loadProAccess(market);
  if (!access) return null;
  const migrated = migrateProAccess(access);
  if (migrated.claimedScenarios.includes(fingerprint)) return migrated;
  const used = migrated.sameSimulationExceptions ?? 0;
  if (used >= MAX_SAME_SIMULATION_EXCEPTIONS) return null;
  const next: ProAccess = {
    ...migrated,
    claimedScenarios: [...migrated.claimedScenarios, fingerprint],
    sameSimulationExceptions: used + 1,
  };
  saveProAccess(market, next);
  return next;
}
