import { describe, expect, it } from 'vitest';
import { calculateMarketPulseConfidence, calculateMarketPulseScore } from './scoring';
import type { MarketPulseReport } from './types';

const baseReport: Pick<MarketPulseReport, 'metrics' | 'confidence'> = {
  confidence: 'high',
  metrics: {
    priceTrendYoY: 5,
    rentTrendYoY: 6,
    mortgageRateTrend: 'flat',
    transactionVolumeYoY: 2,
    affordabilityPressure: 'medium',
    regulatoryRisk: 'low',
  },
};

const scenario = {
  monthlyCashflow: 120,
  breakEvenRent: 700,
  estimatedMonthlyRent: 850,
  netYield: 5,
};

describe('market pulse scoring', () => {
  it('calculates score between 0 and 100', () => {
    const score = calculateMarketPulseScore(baseReport, scenario);
    expect(score).toBeGreaterThanOrEqual(0);
    expect(score).toBeLessThanOrEqual(100);
  });

  it('reduces score when margin of safety is low', () => {
    const highMargin = calculateMarketPulseScore(baseReport, scenario);
    const lowMargin = calculateMarketPulseScore(baseReport, {
      ...scenario,
      estimatedMonthlyRent: 710,
      breakEvenRent: 700,
    });
    expect(lowMargin).toBeLessThan(highMargin);
  });

  it('reduces confidence when few sources', () => {
    expect(calculateMarketPulseConfidence([{ date: '2020-01' }])).toBe('low');
    expect(
      calculateMarketPulseConfidence([
        { date: '2026-05' },
        { date: '2026-04' },
        { date: '2026-03' },
        { date: '2026-02' },
      ]),
    ).toBe('high');
  });
});
