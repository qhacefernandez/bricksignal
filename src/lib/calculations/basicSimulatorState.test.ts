import { describe, expect, it } from 'vitest';
import { getMarketInputRanges } from '@/config/inputRanges';
import { calculateBasicInvestment } from './basic';
import { basicFixture } from './testFixtures';

describe('basic simulator state', () => {
  const ranges = getMarketInputRanges('es');
  const input = basicFixture({
    purchasePrice: ranges.purchasePrice.defaultValue,
    monthlyRent: ranges.monthlyRent.defaultValue,
    downPayment: ranges.downPayment.defaultValue,
    interestRate: ranges.interestRate.defaultValue,
    mortgageYears: ranges.mortgageYears.defaultValue,
    purchaseCostsPercent: ranges.purchaseCostsPercent.defaultValue,
    annualExpensesPercent: ranges.annualExpensesPercent.defaultValue,
    annualExpensesAbsolute: ranges.monthlyRent.defaultValue * 12 * (ranges.annualExpensesPercent.defaultValue / 100),
    vacancyPercent: ranges.vacancyRate.defaultValue,
  });

  it('uses locked vacancy default from ranges', () => {
    const r = calculateBasicInvestment({ ...input, vacancyPercent: ranges.vacancyRate.defaultValue });
    expect(r.grossYield).toBeGreaterThan(0);
  });

  it('recalculates when price changes', () => {
    const a = calculateBasicInvestment(input);
    const b = calculateBasicInvestment({ ...input, purchasePrice: input.purchasePrice + 20_000 });
    expect(b.grossYield).toBeLessThan(a.grossYield);
  });

  it('recalculates when rent changes', () => {
    const a = calculateBasicInvestment(input);
    const b = calculateBasicInvestment({ ...input, monthlyRent: input.monthlyRent + 100 });
    expect(b.monthlyCashflow).toBeGreaterThan(a.monthlyCashflow);
  });

  it('cashflow reacts to interest rate', () => {
    const a = calculateBasicInvestment(input);
    const b = calculateBasicInvestment({ ...input, interestRate: input.interestRate + 1 });
    expect(b.monthlyCashflow).toBeLessThan(a.monthlyCashflow);
  });
});
