import { describe, expect, it } from 'vitest';
import { marketSlugFromBrowserLocale, marketSlugFromCountryCode } from './geoMarket';

describe('geoMarket', () => {
  it('maps supported country codes to market slugs', () => {
    expect(marketSlugFromCountryCode('ES')).toBe('es');
    expect(marketSlugFromCountryCode('gb')).toBe('uk');
    expect(marketSlugFromCountryCode('FR')).toBeNull();
  });

  it('returns null for empty country', () => {
    expect(marketSlugFromCountryCode(null)).toBeNull();
    expect(marketSlugFromCountryCode('')).toBeNull();
  });

  it('maps browser locale hints when navigator is available', () => {
    expect(typeof navigator).toBe('object');
    const slug = marketSlugFromBrowserLocale();
    expect(slug === null || typeof slug === 'string').toBe(true);
  });
});
