import { describe, expect, it } from 'vitest';
import { validateBasicScenario, validateVacancyRate } from './scenarioValidation';
import { basicFixture } from '@/lib/calculations/testFixtures';

const base = basicFixture({ vacancyPercent: 5 });

describe('validationWarnings', () => {
  it('errors on zero purchase price', () => {
    expect(validateBasicScenario({ ...base, purchasePrice: 0 }).some((m) => m.type === 'error')).toBe(true);
  });

  it('warns on low annual expenses', () => {
    expect(validateBasicScenario({ ...base, annualExpensesPercent: 3 }).some((m) => m.type === 'warning')).toBe(true);
  });

  it('warns on high vacancy in PRO', () => {
    expect(validateVacancyRate(18).length).toBeGreaterThan(0);
  });
});
