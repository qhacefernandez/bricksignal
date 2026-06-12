import { describe, expect, it } from 'vitest';
import { createMockProvider } from './providers/mockProvider';
import { DEFAULT_INVESTOR_CRITERIA } from './types';

describe('mockProvider', () => {
  it('returns only mock source listings', async () => {
    const provider = createMockProvider('uk');
    const listings = await provider.search({ ...DEFAULT_INVESTOR_CRITERIA, targetCity: 'Manchester', maxPrice: 500_000 });
    expect(listings.length).toBeGreaterThan(0);
    expect(listings.every((l) => l.source === 'mock')).toBe(true);
    expect(listings.every((l) => !l.sourceUrl?.includes('idealista'))).toBe(true);
  });

  it('generates per-market cities', async () => {
    const us = await createMockProvider('us').search({ ...DEFAULT_INVESTOR_CRITERIA, targetCity: 'Dallas', maxPrice: 1_000_000 });
    expect(us.some((l) => l.city === 'Dallas')).toBe(true);
  });
});
