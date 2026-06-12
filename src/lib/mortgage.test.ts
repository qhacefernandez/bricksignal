import { describe, expect, it } from 'vitest';
import { frenchMonthlyPayment, remainingBalanceAfterYears } from './mortgage';

describe('frenchMonthlyPayment', () => {
  it('calculates standard mortgage payment', () => {
    const payment = frenchMonthlyPayment(100_000, 3, 20);
    expect(payment).toBeGreaterThan(500);
    expect(payment).toBeLessThan(600);
  });

  it('handles zero interest rate', () => {
    const payment = frenchMonthlyPayment(120_000, 0, 10);
    expect(payment).toBeCloseTo(1000, 2);
  });

  it('returns 0 for zero principal', () => {
    expect(frenchMonthlyPayment(0, 3, 20)).toBe(0);
  });
});

describe('remainingBalanceAfterYears', () => {
  it('decreases over time', () => {
    const after5 = remainingBalanceAfterYears(100_000, 3, 20, 5);
    const after10 = remainingBalanceAfterYears(100_000, 3, 20, 10);
    expect(after10).toBeLessThan(after5);
    expect(after5).toBeLessThan(100_000);
  });

  it('reaches zero at end of term', () => {
    const balance = remainingBalanceAfterYears(100_000, 3, 20, 20);
    expect(balance).toBeCloseTo(0, 0);
  });
});
