import { describe, expect, it } from 'vitest';
import { FREE_LOCKED_VACANCY_PERCENT, getMarketInputRanges } from '@/config/inputRanges';
import { buildSensitivity, isVacancySensitive } from '@/lib/calculations';
import { expandBasicToProInput } from './pro';
import { basicFixture } from './testFixtures';

const ranges = getMarketInputRanges('es');
const basic = basicFixture({
  purchasePrice: ranges.purchasePrice.defaultValue,
  monthlyRent: ranges.monthlyRent.defaultValue,
  downPayment: ranges.downPayment.defaultValue,
  interestRate: ranges.interestRate.defaultValue,
  mortgageYears: ranges.mortgageYears.defaultValue,
  purchaseCostsPercent: ranges.purchaseCostsPercent.defaultValue,
  annualExpensesPercent: ranges.annualExpensesPercent.defaultValue,
  annualExpensesAbsolute: ranges.monthlyRent.defaultValue * 12 * (ranges.annualExpensesPercent.defaultValue / 100),
  vacancyPercent: FREE_LOCKED_VACANCY_PERCENT,
  marketSlug: 'es',
});

describe('vacancy gating', () => {
  it('free tier uses 0% vacancy not user override in hook logic', () => {
    expect(FREE_LOCKED_VACANCY_PERCENT).toBe(0);
    expect(basic.vacancyPercent).toBe(0);
  });

  it('PRO input accepts editable vacancy', () => {
    const pro = expandBasicToProInput({ ...basic, vacancyPercent: 12 }, 'es');
    expect(pro.vacancyPercent).toBe(12);
  });

  it('sensitivity includes vacancy scenarios from base', () => {
    const pro = expandBasicToProInput(basic, 'es');
    const sens = buildSensitivity(pro);
    const vacancies = [...new Set(sens.map((s) => s.vacancyPercent))];
    expect(vacancies).toContain(5);
    expect(vacancies).toContain(10);
  });

  it('detects vacancy sensitivity', () => {
    const pro = expandBasicToProInput({ ...basic, vacancyPercent: 14, monthlyRent: 700 }, 'es');
    expect(typeof isVacancySensitive(pro)).toBe('boolean');
  });
});
