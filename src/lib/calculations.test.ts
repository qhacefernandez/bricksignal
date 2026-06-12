import { describe, expect, it } from 'vitest';
import {
  assessViability,
  calculateInvestment,
  computeBreakEvenRent,
  computeCashOnCash,
  computeDSCR,
  computeEffectiveAnnualRent,
  computeGrossYield,
  computeInitialInvestment,
  computeMonthlyMortgagePayment,
  computeNetYield,
  computeNOI,
} from './calculations';
import { frenchMonthlyPayment } from './mortgage';
import { DEFAULT_INPUT, type SimulatorInput } from './types';

const baseInput: SimulatorInput = { ...DEFAULT_INPUT };

describe('computeInitialInvestment', () => {
  it('sums down payment, taxes, costs and reserve', () => {
    const investment = computeInitialInvestment(baseInput);
    expect(investment).toBeGreaterThan(baseInput.downPayment);
  });
});

describe('computeEffectiveAnnualRent', () => {
  it('applies vacancy rate', () => {
    const rent = computeEffectiveAnnualRent({ ...baseInput, vacancyPercent: 10 });
    expect(rent).toBeCloseTo(baseInput.monthlyRent * 12 * 0.9, 0);
  });
});

describe('computeNOI', () => {
  it('subtracts operating expenses from effective rent', () => {
    const noi = computeNOI(baseInput);
    expect(noi).toBeLessThan(computeEffectiveAnnualRent(baseInput));
  });
});

describe('yields and ratios', () => {
  it('computes gross yield', () => {
    const yield_ = computeGrossYield(baseInput);
    expect(yield_).toBeCloseTo((850 * 12 / 150_000) * 100, 1);
  });

  it('computes net yield', () => {
    expect(computeNetYield(baseInput)).toBeGreaterThan(0);
  });

  it('computes cash-on-cash', () => {
    expect(computeCashOnCash(baseInput)).toBeDefined();
  });

  it('computes DSCR when mortgaged', () => {
    const dscr = computeDSCR(baseInput);
    expect(dscr).toBeGreaterThan(0);
  });
});

describe('computeBreakEvenRent', () => {
  it('returns positive rent threshold', () => {
    expect(computeBreakEvenRent(baseInput)).toBeGreaterThan(0);
  });
});

describe('assessViability', () => {
  it('returns green for positive cashflow and high DSCR', () => {
    expect(assessViability(200, 1.5).status).toBe('green');
  });

  it('returns red for low DSCR', () => {
    expect(assessViability(100, 0.8).status).toBe('red');
  });
});

describe('calculateInvestment', () => {
  it('returns complete results object', () => {
    const results = calculateInvestment(baseInput);
    expect(results.grossYield).toBeGreaterThan(0);
    expect(results.sensitivity.length).toBeGreaterThan(0);
    expect(results.annualCashflows.length).toBeGreaterThanOrEqual(20);
  });

  it('is deterministic', () => {
    const a = calculateInvestment(baseInput);
    const b = calculateInvestment(baseInput);
    expect(a.monthlyCashflow).toBe(b.monthlyCashflow);
    expect(a.irr).toBe(b.irr);
  });
});

describe('french formula consistency', () => {
  it('matches mortgage module', () => {
    const fromMortgage = frenchMonthlyPayment(105_000, 3.2, 25);
    expect(fromMortgage).toBeCloseTo(computeMonthlyMortgagePayment(baseInput), 2);
  });
});
