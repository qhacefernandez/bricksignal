import { describe, expect, it } from 'vitest';
import {
  calculateBasicInvestment,
  DEFAULT_BASIC_INPUT,
  type BasicCalculationResults,
} from './basic';

describe('basic calculations', () => {
  const results = calculateBasicInvestment(DEFAULT_BASIC_INPUT);

  it('returns gross and net yield', () => {
    expect(results.grossYield).toBeGreaterThan(0);
    expect(results.netYield).toBeGreaterThan(0);
  });

  it('does not expose IRR', () => {
    expect((results as BasicCalculationResults).irr).toBeUndefined();
  });

  it('does not expose DSCR', () => {
    expect((results as BasicCalculationResults).dscr).toBeUndefined();
  });

  it('does not expose sensitivity', () => {
    expect('sensitivity' in results).toBe(false);
  });

  it('computes viability traffic light', () => {
    expect(['green', 'yellow', 'red']).toContain(results.viability);
  });
});
