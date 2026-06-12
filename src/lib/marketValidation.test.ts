import { describe, expect, it } from 'vitest';
import { MARKET_SLUGS } from '@/config/markets';
import { getValidatedMarket, InvalidMarketError, validateMarketSlug } from './marketValidation';

describe('marketValidation', () => {
  it('validates all market slugs', () => {
    for (const slug of MARKET_SLUGS) {
      expect(validateMarketSlug(slug)).toBe(slug);
      expect(getValidatedMarket(slug).slug).toBe(slug);
    }
  });

  it('throws on invalid slug', () => {
    expect(() => validateMarketSlug('fr')).toThrow(InvalidMarketError);
  });

  it('uk uses GB code internally', () => {
    expect(getValidatedMarket('uk').code).toBe('GB');
  });

  it('US requires region', () => {
    expect(getValidatedMarket('us').taxProfile.requiresRegionSelection).toBe(true);
  });

  it('AU requires state', () => {
    expect(getValidatedMarket('au').taxProfile.requiresRegionSelection).toBe(true);
  });
});
