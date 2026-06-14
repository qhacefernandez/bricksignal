import type { AmortizationMethod, MarketSlug } from '@/config/types';
import { TAX_PROFILES } from '@/config/taxProfiles';
import {
  firstYearMortgageInterest as mortgageFirstYearInterest,
  mortgageInterestForYear as scheduleInterestForYear,
  resolveAmortizationMethod,
} from '../mortgage';

export type MortgageInterestTaxMode = 'deduct_from_profit' | 'tax_credit' | 'none';

export type MarketRentalTaxConfig = {
  mode: MortgageInterestTaxMode;
  estimateTaxRatePercent: number;
  creditRatePercent?: number;
  note?: string;
};

/** @deprecated Usa getDefaultRentalTaxEstimateRate('es') */
export const ES_RENTAL_TAX_ESTIMATE_RATE = 19;

export function getMarketRentalTaxConfig(marketSlug?: MarketSlug): MarketRentalTaxConfig | null {
  if (!marketSlug) return null;
  return TAX_PROFILES[marketSlug].mortgageInterestTax;
}

export function marketAllowsMortgageInterestDeduction(marketSlug?: MarketSlug): boolean {
  const config = getMarketRentalTaxConfig(marketSlug);
  return config !== undefined && config.mode !== 'none';
}

export function getDefaultRentalTaxEstimateRate(marketSlug?: MarketSlug): number {
  return getMarketRentalTaxConfig(marketSlug)?.estimateTaxRatePercent ?? 0;
}

export function resolveRentalTaxRate(marketSlug: MarketSlug | undefined, configuredRate: number): number {
  if (configuredRate > 0) return configuredRate;
  return getDefaultRentalTaxEstimateRate(marketSlug);
}

export function firstYearMortgageInterest(
  principal: number,
  annualRatePercent: number,
  years: number,
  amortizationMethod?: AmortizationMethod,
  marketSlug?: MarketSlug,
): number {
  const method = resolveAmortizationMethod(amortizationMethod, marketSlug);
  return mortgageFirstYearInterest(principal, annualRatePercent, years, method);
}

export function mortgageInterestForYear(
  principal: number,
  annualRatePercent: number,
  years: number,
  year: number,
  amortizationMethod?: AmortizationMethod,
  marketSlug?: MarketSlug,
): number {
  const method = resolveAmortizationMethod(amortizationMethod, marketSlug);
  return scheduleInterestForYear(principal, annualRatePercent, years, year, method);
}

export function estimateRentalTax(params: {
  noi: number;
  debtService: number;
  annualMortgageInterest: number;
  taxRatePercent: number;
  mode: MortgageInterestTaxMode;
  creditRatePercent?: number;
}): number {
  const { noi, annualMortgageInterest, taxRatePercent, mode, creditRatePercent } = params;
  if (taxRatePercent <= 0 || mode === 'none') return 0;

  if (mode === 'tax_credit') {
    const creditRate = creditRatePercent ?? 20;
    const taxOnProfit = Math.max(0, noi) * (taxRatePercent / 100);
    const interestCredit = annualMortgageInterest * (creditRate / 100);
    return Math.max(0, taxOnProfit - interestCredit);
  }

  if (mode === 'deduct_from_profit') {
    const taxable = Math.max(0, noi - annualMortgageInterest);
    return taxable * (taxRatePercent / 100);
  }

  const beforeTax = noi - params.debtService;
  return beforeTax > 0 ? beforeTax * (taxRatePercent / 100) : 0;
}

export function estimateInterestTaxSaving(params: {
  noi: number;
  annualMortgageInterest: number;
  taxRatePercent: number;
  mode: MortgageInterestTaxMode;
  creditRatePercent?: number;
}): number {
  const { noi, annualMortgageInterest, taxRatePercent, mode, creditRatePercent } = params;
  if (taxRatePercent <= 0 || annualMortgageInterest <= 0 || mode === 'none') return 0;

  const taxBefore = estimateRentalTax({
    noi,
    debtService: 0,
    annualMortgageInterest: 0,
    taxRatePercent,
    mode: 'deduct_from_profit',
  });
  const taxAfter = estimateRentalTax({
    noi,
    debtService: 0,
    annualMortgageInterest,
    taxRatePercent,
    mode,
    creditRatePercent,
  });
  return Math.max(0, taxBefore - taxAfter);
}

export function estimateRentalTaxForMarket(
  marketSlug: MarketSlug | undefined,
  params: Omit<Parameters<typeof estimateRentalTax>[0], 'mode' | 'creditRatePercent'>,
): number {
  const config = getMarketRentalTaxConfig(marketSlug);
  if (!config) {
    return estimateRentalTax({ ...params, mode: 'none' });
  }
  return estimateRentalTax({
    ...params,
    mode: config.mode,
    creditRatePercent: config.creditRatePercent,
  });
}

export type InterestTaxSavingParams = {
  noi: number;
  principal: number;
  annualRatePercent: number;
  years: number;
  taxRatePercent: number;
  amortizationMethod?: AmortizationMethod;
};

export function estimateInterestTaxSavingForMarket(
  marketSlug: MarketSlug | undefined,
  params: InterestTaxSavingParams,
): number {
  const config = getMarketRentalTaxConfig(marketSlug);
  if (!config || config.mode === 'none') return 0;
  const method = resolveAmortizationMethod(params.amortizationMethod, marketSlug);
  const annualInterest = mortgageFirstYearInterest(
    params.principal,
    params.annualRatePercent,
    params.years,
    method,
  );
  return estimateInterestTaxSaving({
    noi: params.noi,
    annualMortgageInterest: annualInterest,
    taxRatePercent: params.taxRatePercent,
    mode: config.mode,
    creditRatePercent: config.creditRatePercent,
  });
}
