import { beforeEach, describe, expect, it, vi } from 'vitest';
import { basicFixture } from './calculations/testFixtures';
import type { ProAccess } from './types';

const proAccessStore: Partial<Record<string, ProAccess>> = {};

vi.mock('./marketStorage', () => ({
  loadProAccess: (market: string) => proAccessStore[market] ?? null,
  saveProAccess: (market: string, access: ProAccess) => {
    proAccessStore[market] = access;
  },
}));
import {
  applySameSimulationException,
  canViewProReport,
  createProAccessFromPayment,
  getSameSimulationExceptionsRemaining,
  migrateProAccess,
  scenarioFingerprint,
  wouldRequireNewProPurchase,
} from './proReports';

const basic = basicFixture();

describe('proReports', () => {
  beforeEach(() => {
    for (const key of Object.keys(proAccessStore)) delete proAccessStore[key];
  });
  it('fingerprints scenarios coarsely', () => {
    expect(scenarioFingerprint(basic)).toBe(scenarioFingerprint({ ...basic, monthlyRent: 952 }));
    expect(scenarioFingerprint(basic)).not.toBe(scenarioFingerprint({ ...basic, region: 'Valencia' }));
  });

  it('allows viewing claimed scenario with zero credits left', () => {
    const fp = scenarioFingerprint(basic);
    const access = migrateProAccess({
      ...createProAccessFromPayment('cs_test_1'),
      reportsRemaining: 0,
      claimedScenarios: [fp],
    });
    expect(canViewProReport(access, fp).allowed).toBe(true);
  });

  it('blocks new scenario when no credits remain', () => {
    const access = migrateProAccess({
      ...createProAccessFromPayment('cs_test_1'),
      reportsRemaining: 0,
      claimedScenarios: [],
    });
    expect(canViewProReport(access, scenarioFingerprint(basic)).allowed).toBe(false);
  });

  it('flags repurchase when fingerprint is new and no credits remain', () => {
    const fp = scenarioFingerprint(basic);
    const access = migrateProAccess({
      ...createProAccessFromPayment('cs_test_1'),
      reportsRemaining: 0,
      claimedScenarios: [fp],
    });
    const other = scenarioFingerprint({ ...basic, region: 'Valencia' });
    expect(wouldRequireNewProPurchase(access, other)).toBe(true);
    expect(wouldRequireNewProPurchase(access, fp)).toBe(false);
  });

  it('allows up to two same-simulation exceptions', () => {
    const fp1 = scenarioFingerprint(basic);
    const fp2 = scenarioFingerprint({ ...basic, region: 'Valencia' });
    const fp3 = scenarioFingerprint({ ...basic, region: 'Barcelona' });
    const access = migrateProAccess({
      ...createProAccessFromPayment('cs_test_1'),
      reportsRemaining: 0,
      claimedScenarios: [fp1],
    });
    proAccessStore.es = access;

    expect(getSameSimulationExceptionsRemaining(access)).toBe(2);
    expect(applySameSimulationException('es', fp2)).toMatchObject({
      claimedScenarios: [fp1, fp2],
      sameSimulationExceptions: 1,
    });
    const afterTwo = applySameSimulationException('es', fp3);
    expect(afterTwo).toMatchObject({
      claimedScenarios: [fp1, fp2, fp3],
      sameSimulationExceptions: 2,
    });
    expect(getSameSimulationExceptionsRemaining(afterTwo)).toBe(0);
    expect(applySameSimulationException('es', scenarioFingerprint({ ...basic, region: 'Sevilla' }))).toBeNull();
  });
});
