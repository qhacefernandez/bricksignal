import { describe, expect, it } from 'vitest';
import { MARKET_SLUGS } from './markets';
import { TAX_PROFILES } from './taxProfiles';
import { buildDefaultTaxValues } from '@/lib/taxAssumptions';
import { getMarket } from './markets';

describe('taxProfiles', () => {
  it('each market has tax fields', () => {
    for (const slug of MARKET_SLUGS) {
      const profile = TAX_PROFILES[slug];
      expect(profile.purchaseTaxFields.length).toBeGreaterThan(0);
      expect(profile.annualCostFields.length).toBeGreaterThan(0);
      expect(profile.disclaimer.length).toBeGreaterThan(10);
      expect(profile.mortgageInterestTax.mode).not.toBe('none');
      expect(profile.mortgageInterestTax.estimateTaxRatePercent).toBeGreaterThan(0);
    }
  });

  it('builds default tax values from config', () => {
    const values = buildDefaultTaxValues(getMarket('es'));
    expect(values.itp).toBe(6);
    expect(values.ibi).toBe(450);
  });
});
