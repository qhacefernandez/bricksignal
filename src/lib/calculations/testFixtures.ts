import type { BasicSimulatorInput } from './basic';

export function basicFixture(overrides: Partial<BasicSimulatorInput> = {}): BasicSimulatorInput {
  return {
    purchasePrice: 180_000,
    monthlyRent: 950,
    region: 'Madrid',
    useMortgage: true,
    downPayment: 50_000,
    interestRate: 3.25,
    mortgageYears: 25,
    purchaseCostsPercent: 10,
    annualExpensesPercent: 15,
    annualExpensesMode: 'percent',
    annualExpensesAbsolute: 1_710,
    vacancyPercent: 0,
    vacancyMode: 'percent',
    vacancyMonths: 0,
    ...overrides,
  };
}
