import { describe, expect, it } from 'vitest';
import { FREE_LOCKED_VACANCY_PERCENT, getMarketInputRanges, valueBucket, vacancyBucket } from './inputRanges';

describe('inputRanges', () => {
  it('returns different defaults per market', () => {
    expect(getMarketInputRanges('es').purchasePrice.defaultValue).toBe(180_000);
    expect(getMarketInputRanges('us').purchasePrice.defaultValue).toBe(300_000);
    expect(getMarketInputRanges('mx').purchasePrice.defaultValue).toBe(3_000_000);
  });

  it('PRO vacancy default stays at 5% for EUR cluster', () => {
    expect(getMarketInputRanges('es').vacancyRate.defaultValue).toBe(5);
  });

  it('free tier locks vacancy at 0%', () => {
    expect(FREE_LOCKED_VACANCY_PERCENT).toBe(0);
  });

  it('buckets values for analytics', () => {
    expect(valueBucket(50_000, 50_000, 600_000)).toBe('low');
    expect(vacancyBucket(5)).toBe('low');
  });
});
