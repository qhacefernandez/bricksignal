import { describe, expect, it } from 'vitest';
import { scoreListing, scoreListings, validateInvestorCriteria } from './scoring';
import type { InvestorCriteria, Listing } from './types';
import { DEFAULT_INVESTOR_CRITERIA } from './types';

const baseCriteria: InvestorCriteria = { ...DEFAULT_INVESTOR_CRITERIA };

function makeListing(overrides: Partial<Listing> = {}): Listing {
  return {
    id: 'test-001',
    source: 'mock',
    title: 'Piso test',
    city: 'Madrid',
    district: 'Test',
    price: 150_000,
    sizeM2: 60,
    rooms: 2,
    bathrooms: 1,
    condition: 'ready',
    estimatedRenovationCost: 0,
    estimatedMonthlyRent: 900,
    communityFeesAnnual: 600,
    ibiAnnual: 400,
    otherAnnualCosts: 100,
    publishedAt: '2026-01-01',
    updatedAt: '2026-01-01',
    ...overrides,
  };
}

describe('scoreListing', () => {
  it('scores opportunity with mortgage', () => {
    const result = scoreListing(makeListing(), baseCriteria);
    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(result.score).toBeLessThanOrEqual(100);
    expect(result.dscr).toBeGreaterThan(0);
    expect(result.monthlyCashflow).toBeDefined();
  });

  it('scores opportunity without mortgage', () => {
    const criteria: InvestorCriteria = { ...baseCriteria, mortgageLtv: 0, availableCash: 200_000 };
    const result = scoreListing(makeListing(), criteria);
    expect(result.dscr).toBe(Infinity);
    expect(result.score).toBeGreaterThan(0);
  });

  it('penalizes negative cashflow', () => {
    const result = scoreListing(
      makeListing({ price: 350_000, estimatedMonthlyRent: 900 }),
      baseCriteria,
    );
    expect(result.monthlyCashflow).toBeLessThan(0);
    expect(result.reasons.some((r) => r.includes('Cashflow negativo'))).toBe(true);
    expect(result.score).toBeLessThan(60);
  });

  it('flags low DSCR', () => {
    const result = scoreListing(
      makeListing({ price: 280_000, estimatedMonthlyRent: 850 }),
      { ...baseCriteria, mortgageLtv: 0.8 },
    );
    if (result.dscr < 1.1) {
      expect(result.reasons.some((r) => r.includes('DSCR'))).toBe(true);
    }
    expect(['low', 'medium', 'high']).toContain(result.riskLevel);
  });

  it('includes gross and net yield', () => {
    const result = scoreListing(makeListing(), baseCriteria);
    expect(result.grossYield).toBeGreaterThan(0);
    expect(result.netYield).toBeGreaterThan(0);
  });
});

describe('scoreListings sorting', () => {
  it('orders by score descending', () => {
    const listings = [
      makeListing({ id: 'low', price: 350_000, estimatedMonthlyRent: 800 }),
      makeListing({ id: 'high', price: 130_000, estimatedMonthlyRent: 950 }),
      makeListing({ id: 'mid', price: 180_000, estimatedMonthlyRent: 900 }),
    ];
    const scored = scoreListings(listings, baseCriteria);
    expect(scored[0]!.score.score).toBeGreaterThanOrEqual(scored[1]!.score.score);
    expect(scored[1]!.score.score).toBeGreaterThanOrEqual(scored[2]!.score.score);
  });
});

describe('validateInvestorCriteria', () => {
  it('accepts valid criteria', () => {
    const result = validateInvestorCriteria(baseCriteria);
    expect(result.success).toBe(true);
  });

  it('rejects invalid max price', () => {
    const result = validateInvestorCriteria({ ...baseCriteria, maxPrice: 100 });
    expect(result.success).toBe(false);
  });

  it('rejects invalid vacancy rate', () => {
    const result = validateInvestorCriteria({ ...baseCriteria, vacancyRate: 1.5 });
    expect(result.success).toBe(false);
  });
});
