import { describe, expect, it } from 'vitest';
import { MARKET_SLUGS } from '@/config/markets';
import {
  estimateInterestTaxSaving,
  estimateInterestTaxSavingForMarket,
  estimateRentalTax,
  firstYearMortgageInterest,
  getDefaultRentalTaxEstimateRate,
  marketAllowsMortgageInterestDeduction,
} from './rentalTax';
import { calculateBasicViability } from './basic';

describe('rentalTax', () => {
  it('enables mortgage interest treatment for all configured markets', () => {
    for (const slug of MARKET_SLUGS) {
      expect(marketAllowsMortgageInterestDeduction(slug)).toBe(true);
      expect(getDefaultRentalTaxEstimateRate(slug)).toBeGreaterThan(0);
    }
  });

  it('computes first-year mortgage interest with amortization method', () => {
    const french = firstYearMortgageInterest(105_000, 3.2, 25, 'french', 'es');
    const linear = firstYearMortgageInterest(105_000, 3.2, 25, 'linear', 'es');
    expect(french).toBeGreaterThan(linear);
  });

  it('reduces tax when interest is deductible from profit', () => {
    const noi = 8_000;
    const interest = 3_000;
    const saving = estimateInterestTaxSaving({
      noi,
      annualMortgageInterest: interest,
      taxRatePercent: 19,
      mode: 'deduct_from_profit',
    });
    expect(saving).toBeCloseTo(570, 0);

    const taxWithDeduction = estimateRentalTax({
      noi,
      debtService: 7_200,
      annualMortgageInterest: interest,
      taxRatePercent: 19,
      mode: 'deduct_from_profit',
    });
    expect(taxWithDeduction).toBeCloseTo(950, 0);
  });

  it('applies UK tax credit on interest', () => {
    const noi = 10_000;
    const saving = estimateInterestTaxSavingForMarket('uk', {
      noi,
      principal: 120_000,
      annualRatePercent: 4.8,
      years: 25,
      taxRatePercent: 20,
      amortizationMethod: 'interest_only',
    });
    expect(saving).toBeCloseTo(1_152, 0);
  });

  it('uses lower tax saving with linear vs french amortization', () => {
    const params = {
      noi: 8_000,
      principal: 105_000,
      annualRatePercent: 3.2,
      years: 25,
      taxRatePercent: 19,
    };
    const frenchSaving = estimateInterestTaxSavingForMarket('es', {
      ...params,
      amortizationMethod: 'french',
    });
    const linearSaving = estimateInterestTaxSavingForMarket('es', {
      ...params,
      amortizationMethod: 'linear',
    });
    expect(frenchSaving).toBeGreaterThan(linearSaving);
  });
});

describe('calculateBasicViability labels', () => {
  it('uses only Viable or No viable', () => {
    expect(calculateBasicViability(200, 5).label).toBe('Viable');
    expect(calculateBasicViability(-200, 1).label).toBe('No viable');
    expect(calculateBasicViability(50, 3).label).toBe('No viable');
  });

  it('does not expose profitability reason text', () => {
    expect(calculateBasicViability(200, 5).reason).toBe('');
  });
});
