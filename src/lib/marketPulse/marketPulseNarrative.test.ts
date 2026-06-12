import { describe, expect, it } from 'vitest';
import { generateMarketPulseNarrative } from './narrative';

describe('market pulse narrative', () => {
  it('warns on high price trend', () => {
    const n = generateMarketPulseNarrative(
      { priceTrendYoY: 10, rentTrendYoY: 3, mortgageRateTrend: 'flat' },
      { monthlyCashflow: 50, breakEvenRent: 600, estimatedMonthlyRent: 850, netYield: 4 },
      'high',
    );
    expect(n.risks.some((r) => r.includes('tendencia fuerte al alza'))).toBe(true);
  });

  it('notes low confidence', () => {
    const n = generateMarketPulseNarrative(
      { priceTrendYoY: 3 },
      { monthlyCashflow: 50, breakEvenRent: 600, estimatedMonthlyRent: 850, netYield: 4 },
      'low',
    );
    expect(n.watchlist.some((w) => w.includes('confianza limitada'))).toBe(true);
  });
});
