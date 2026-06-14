import { describe, expect, it } from 'vitest';
import {
  annualMortgageSchedule,
  averageMonthlyPaymentYear1,
  buildAmortizationSchedule,
  frenchMonthlyPayment,
  mortgageInterestForYear,
  remainingBalanceAfterYears,
} from './mortgage';

const PRINCIPAL = 105_000;
const RATE = 3.2;
const YEARS = 25;

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

describe('amortization methods', () => {
  it('french year-1 interest exceeds linear year-1 interest', () => {
    const french = mortgageInterestForYear(PRINCIPAL, RATE, YEARS, 1, 'french');
    const linear = mortgageInterestForYear(PRINCIPAL, RATE, YEARS, 1, 'linear');
    expect(french).toBeGreaterThan(linear);
  });

  it('interest-only keeps stable annual interest until balloon year', () => {
    const y1 = mortgageInterestForYear(PRINCIPAL, RATE, YEARS, 1, 'interest_only');
    const y5 = mortgageInterestForYear(PRINCIPAL, RATE, YEARS, 5, 'interest_only');
    expect(y1).toBeCloseTo(y5, 0);
    expect(y1).toBeCloseTo(PRINCIPAL * (RATE / 100), -2);
  });

  it('french interest declines over loan life', () => {
    const y1 = mortgageInterestForYear(PRINCIPAL, RATE, YEARS, 1, 'french');
    const y10 = mortgageInterestForYear(PRINCIPAL, RATE, YEARS, 10, 'french');
    expect(y10).toBeLessThan(y1);
  });

  it('linear pays down principal faster than french early on', () => {
    const frenchBalance = remainingBalanceAfterYears(PRINCIPAL, RATE, YEARS, 5, 'french');
    const linearBalance = remainingBalanceAfterYears(PRINCIPAL, RATE, YEARS, 5, 'linear');
    expect(linearBalance).toBeLessThan(frenchBalance);
  });

  it('schedules sum principal to zero at maturity', () => {
    for (const method of ['french', 'linear', 'interest_only'] as const) {
      const schedule = buildAmortizationSchedule(PRINCIPAL, RATE, YEARS, method);
      expect(schedule[schedule.length - 1]?.balance).toBeCloseTo(0, 0);
    }
  });

  it('average monthly payment year 1 matches french constant payment', () => {
    const avg = averageMonthlyPaymentYear1(PRINCIPAL, RATE, YEARS, 'french');
    expect(avg).toBeCloseTo(frenchMonthlyPayment(PRINCIPAL, RATE, YEARS), 0);
  });

  it('annual schedule aggregates 12 months', () => {
    const annual = annualMortgageSchedule(PRINCIPAL, RATE, YEARS, 'french')[0];
    const monthly = buildAmortizationSchedule(PRINCIPAL, RATE, YEARS, 'french').slice(0, 12);
    expect(annual?.interest).toBeCloseTo(
      monthly.reduce((s, r) => s + r.interest, 0),
      0,
    );
  });
});

describe('remainingBalanceAfterYears', () => {
  it('decreases over time with french method', () => {
    const after5 = remainingBalanceAfterYears(100_000, 3, 20, 5, 'french');
    const after10 = remainingBalanceAfterYears(100_000, 3, 20, 10, 'french');
    expect(after10).toBeLessThan(after5);
    expect(after5).toBeLessThan(100_000);
  });

  it('reaches zero at end of term', () => {
    const balance = remainingBalanceAfterYears(100_000, 3, 20, 20, 'french');
    expect(balance).toBeCloseTo(0, 0);
  });
});
