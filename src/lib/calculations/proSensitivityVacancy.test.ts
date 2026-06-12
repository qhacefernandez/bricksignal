import { describe, expect, it } from 'vitest';
import { buildSensitivity } from '@/lib/calculations';
import { expandBasicToProInput } from './pro';
import { basicFixture } from './testFixtures';
import { getMarketInputRanges } from '@/config/inputRanges';

describe('pro sensitivity vacancy', () => {
  it('includes expense multiplier scenarios', () => {
    const ranges = getMarketInputRanges('es');
    const pro = expandBasicToProInput(basicFixture({
      purchasePrice: ranges.purchasePrice.defaultValue,
      monthlyRent: ranges.monthlyRent.defaultValue,
      downPayment: ranges.downPayment.defaultValue,
      interestRate: ranges.interestRate.defaultValue,
      mortgageYears: ranges.mortgageYears.defaultValue,
      vacancyPercent: 5,
      marketSlug: 'es',
    }), 'es');
    const sens = buildSensitivity(pro);
    const multipliers = [...new Set(sens.map((s) => s.expenseMultiplier ?? 1))];
    expect(multipliers).toContain(1);
    expect(multipliers).toContain(1.1);
    expect(multipliers).toContain(1.2);
  });
});
