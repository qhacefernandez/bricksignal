import { describe, expect, it } from 'vitest';
import { getLatestPulseRaw, loadMarketPulse } from './loadMarketPulse';

describe('loadMarketPulse', () => {
  it('loads latest report for market', () => {
    const raw = getLatestPulseRaw('es');
    expect(raw).not.toBeNull();
    expect(raw?.period).toBe('2026-06');
  });

  it('returns enriched report with score', () => {
    const report = loadMarketPulse('es', {
      monthlyCashflow: 100,
      breakEvenRent: 650,
      estimatedMonthlyRent: 850,
      netYield: 5,
    });
    expect(report).not.toBeNull();
    expect(report!.score).toBeGreaterThanOrEqual(0);
    expect(report!.score).toBeLessThanOrEqual(100);
    expect(report!.lastUpdatedLabel).toMatch(/Actualizado|Última actualización/);
  });

  it('applies regional override for Spain', () => {
    const national = loadMarketPulse('es', {
      monthlyCashflow: 100,
      breakEvenRent: 650,
      estimatedMonthlyRent: 850,
      netYield: 5,
    });
    const madrid = loadMarketPulse('es', {
      monthlyCashflow: 100,
      breakEvenRent: 650,
      estimatedMonthlyRent: 850,
      netYield: 5,
    }, 'Madrid');
    expect(madrid?.geographyName).toBe('Madrid');
    expect(madrid?.geographyLevel).toBe('region');
    expect(madrid?.metrics.priceTrendYoY).not.toBe(national?.metrics.priceTrendYoY);
  });
});
