import { describe, expect, it } from 'vitest';
import { FREE_LOCKED_VACANCY_PERCENT } from '@/config/inputRanges';
import { calculateBasicInvestment } from '@/lib/calculations/basic';

describe('investment scenario hook logic', () => {
  it('forces locked vacancy for free tier calculation', () => {
    const locked = FREE_LOCKED_VACANCY_PERCENT;
    const withUserVacancy = {
      purchasePrice: 180_000,
      monthlyRent: 950,
      region: 'Madrid',
      useMortgage: true,
      downPayment: 50_000,
      interestRate: 3.25,
      mortgageYears: 25,
      purchaseCostsPercent: 10,
      annualExpensesPercent: 15,
      annualExpensesMode: 'percent' as const,
      annualExpensesAbsolute: 1_710,
      vacancyPercent: 20,
      vacancyMode: 'percent' as const,
      vacancyMonths: 0,
    };
    const lockedInput = { ...withUserVacancy, vacancyPercent: locked };
    const freeResult = calculateBasicInvestment(lockedInput);
    const wrongResult = calculateBasicInvestment(withUserVacancy);
    expect(freeResult.monthlyCashflow).not.toBe(wrongResult.monthlyCashflow);
  });
});
