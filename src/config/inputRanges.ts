import type { CurrencyCode, MarketSlug } from './types';

export type SliderRangeConfig = {
  min: number;
  max: number;
  step: number;
  softMin?: number;
  softMax?: number;
  defaultValue: number;
};

export type MarketInputRanges = {
  purchasePrice: SliderRangeConfig;
  monthlyRent: SliderRangeConfig;
  downPayment: SliderRangeConfig;
  interestRate: SliderRangeConfig;
  mortgageYears: SliderRangeConfig;
  purchaseCostsPercent: SliderRangeConfig;
  annualExpensesPercent: SliderRangeConfig;
  vacancyRate: SliderRangeConfig;
  renovationCost: SliderRangeConfig;
  furnitureCost: SliderRangeConfig;
  rentGrowth: SliderRangeConfig;
  expenseGrowth: SliderRangeConfig;
  propertyAppreciation: SliderRangeConfig;
  effectiveTaxRate: SliderRangeConfig;
  sellingCostsPercent: SliderRangeConfig;
  projectionYears: SliderRangeConfig;
};

const EUR_CLUSTER: MarketInputRanges = {
  purchasePrice: { min: 50_000, max: 600_000, step: 5_000, defaultValue: 180_000 },
  monthlyRent: { min: 300, max: 3_000, step: 25, defaultValue: 950 },
  downPayment: { min: 0, max: 300_000, step: 1_000, defaultValue: 50_000 },
  interestRate: { min: 0, max: 8, step: 0.05, defaultValue: 3.25 },
  mortgageYears: { min: 5, max: 40, step: 1, defaultValue: 25 },
  purchaseCostsPercent: { min: 0, max: 20, step: 0.25, defaultValue: 10 },
  annualExpensesPercent: { min: 0, max: 50, step: 1, defaultValue: 15 },
  vacancyRate: { min: 0, max: 25, step: 0.5, defaultValue: 5 },
  renovationCost: { min: 0, max: 100_000, step: 1_000, defaultValue: 0 },
  furnitureCost: { min: 0, max: 50_000, step: 500, defaultValue: 0 },
  rentGrowth: { min: -5, max: 8, step: 0.25, defaultValue: 2 },
  expenseGrowth: { min: 0, max: 8, step: 0.25, defaultValue: 2 },
  propertyAppreciation: { min: -5, max: 8, step: 0.25, defaultValue: 2 },
  effectiveTaxRate: { min: 0, max: 50, step: 1, defaultValue: 0 },
  sellingCostsPercent: { min: 0, max: 10, step: 0.25, defaultValue: 3 },
  projectionYears: { min: 5, max: 30, step: 1, defaultValue: 20 },
};

const UK_RANGES: MarketInputRanges = {
  ...EUR_CLUSTER,
  purchasePrice: { min: 75_000, max: 900_000, step: 5_000, defaultValue: 250_000 },
  monthlyRent: { min: 400, max: 4_500, step: 25, defaultValue: 1_300 },
  downPayment: { min: 0, max: 450_000, step: 1_000, defaultValue: 75_000 },
  interestRate: { min: 0, max: 9, step: 0.05, defaultValue: 5 },
  purchaseCostsPercent: { min: 0, max: 25, step: 0.25, defaultValue: 8 },
  annualExpensesPercent: { min: 0, max: 50, step: 1, defaultValue: 18 },
};

const US_RANGES: MarketInputRanges = {
  ...EUR_CLUSTER,
  purchasePrice: { min: 75_000, max: 1_200_000, step: 5_000, defaultValue: 300_000 },
  monthlyRent: { min: 500, max: 7_000, step: 50, defaultValue: 2_200 },
  downPayment: { min: 0, max: 600_000, step: 1_000, defaultValue: 75_000 },
  interestRate: { min: 0, max: 10, step: 0.05, defaultValue: 6.5 },
  mortgageYears: { min: 5, max: 40, step: 1, defaultValue: 30 },
  purchaseCostsPercent: { min: 0, max: 15, step: 0.25, defaultValue: 4 },
  annualExpensesPercent: { min: 0, max: 60, step: 1, defaultValue: 25 },
  vacancyRate: { min: 0, max: 30, step: 0.5, defaultValue: 5 },
  sellingCostsPercent: { min: 0, max: 10, step: 0.25, defaultValue: 6 },
};

const MX_RANGES: MarketInputRanges = {
  ...EUR_CLUSTER,
  purchasePrice: { min: 500_000, max: 12_000_000, step: 50_000, defaultValue: 3_000_000 },
  monthlyRent: { min: 5_000, max: 80_000, step: 500, defaultValue: 18_000 },
  downPayment: { min: 0, max: 6_000_000, step: 25_000, defaultValue: 750_000 },
  interestRate: { min: 0, max: 15, step: 0.1, defaultValue: 10.5 },
  mortgageYears: { min: 5, max: 30, step: 1, defaultValue: 20 },
  purchaseCostsPercent: { min: 0, max: 20, step: 0.25, defaultValue: 7 },
  annualExpensesPercent: { min: 0, max: 50, step: 1, defaultValue: 15 },
  vacancyRate: { min: 0, max: 30, step: 0.5, defaultValue: 6 },
  renovationCost: { min: 0, max: 2_000_000, step: 25_000, defaultValue: 0 },
  furnitureCost: { min: 0, max: 1_000_000, step: 10_000, defaultValue: 0 },
  rentGrowth: { min: -5, max: 10, step: 0.25, defaultValue: 3 },
  expenseGrowth: { min: 0, max: 10, step: 0.25, defaultValue: 3 },
  propertyAppreciation: { min: -5, max: 10, step: 0.25, defaultValue: 3 },
  sellingCostsPercent: { min: 0, max: 10, step: 0.25, defaultValue: 4 },
};

const AU_RANGES: MarketInputRanges = {
  ...EUR_CLUSTER,
  purchasePrice: { min: 150_000, max: 1_500_000, step: 10_000, defaultValue: 600_000 },
  monthlyRent: { min: 800, max: 7_000, step: 50, defaultValue: 2_800 },
  downPayment: { min: 0, max: 750_000, step: 5_000, defaultValue: 150_000 },
  interestRate: { min: 0, max: 10, step: 0.05, defaultValue: 6 },
  mortgageYears: { min: 5, max: 40, step: 1, defaultValue: 30 },
  purchaseCostsPercent: { min: 0, max: 20, step: 0.25, defaultValue: 6 },
  annualExpensesPercent: { min: 0, max: 60, step: 1, defaultValue: 22 },
  vacancyRate: { min: 0, max: 30, step: 0.5, defaultValue: 5 },
};

export const MARKET_INPUT_RANGES: Record<MarketSlug, MarketInputRanges> = {
  es: EUR_CLUSTER,
  pt: EUR_CLUSTER,
  it: EUR_CLUSTER,
  ie: EUR_CLUSTER,
  uk: UK_RANGES,
  us: US_RANGES,
  mx: MX_RANGES,
  au: AU_RANGES,
};

export function getMarketInputRanges(marketSlug: MarketSlug): MarketInputRanges {
  return MARKET_INPUT_RANGES[marketSlug];
}

/** Vacancia fija en capa gratuita — estimación optimista, no editable */
export const FREE_LOCKED_VACANCY_PERCENT = 0;

/** Expande el máximo del slider si el valor supera el rango visual */
export function expandSliderRange(range: SliderRangeConfig, value: number): SliderRangeConfig {
  if (!Number.isFinite(value) || value <= range.max) return range;
  const step = range.step > 0 ? range.step : 1;
  let newMax = Math.ceil(value / step) * step + step * 2;
  if (value >= 100_000) {
    const bucket = value >= 1_000_000 ? 100_000 : 50_000;
    newMax = Math.ceil(value / bucket) * bucket + bucket;
  }
  return { ...range, max: newMax };
}

export const BASIC_CASHFLOW_WARNING_THRESHOLD: Record<CurrencyCode, number> = {
  EUR: -100,
  GBP: -100,
  USD: -150,
  MXN: -2_000,
  AUD: -150,
};

export function getCashflowWarningThreshold(currency: CurrencyCode): number {
  return BASIC_CASHFLOW_WARNING_THRESHOLD[currency];
}

/** Analytics bucket — no exact values */
export function valueBucket(value: number, min: number, max: number): string {
  if (!Number.isFinite(value)) return 'unknown';
  const span = max - min || 1;
  const ratio = (value - min) / span;
  if (ratio < 0) return 'below_range';
  if (ratio > 1) return 'above_range';
  if (ratio < 0.25) return 'low';
  if (ratio < 0.5) return 'mid_low';
  if (ratio < 0.75) return 'mid_high';
  return 'high';
}

export function vacancyBucket(rate: number): string {
  if (rate <= 3) return 'very_low';
  if (rate <= 7) return 'low';
  if (rate <= 12) return 'moderate';
  if (rate <= 18) return 'high';
  return 'very_high';
}
