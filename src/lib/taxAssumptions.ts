import type { MarketConfig } from '@/config/types';
import type { SimulatorInput } from './types';

export type ResolvedTaxAmounts = {
  transferTaxAmount: number;
  extraPurchaseTaxAmount: number;
  purchaseFixedCosts: number;
  annualPropertyTax: number;
  annualCommunity: number;
  annualInsurance: number;
  annualMaintenance: number;
  annualOther: number;
  managementPercent: number;
  effectiveRentalTaxRate: number;
};

function fieldValue(
  input: SimulatorInput,
  fieldId: string,
  fallback = 0,
): number {
  return input.taxValues?.[fieldId] ?? fallback;
}

function sumPurchasePercent(
  input: SimulatorInput,
  market: MarketConfig,
  buckets: Array<'transfer_tax' | 'purchase_tax_extra'>,
): number {
  let total = 0;
  for (const field of market.taxProfile.purchaseTaxFields) {
    if (!buckets.includes(field.bucket as 'transfer_tax' | 'purchase_tax_extra')) continue;
    if (field.inputType === 'percentage') {
      const rate = fieldValue(input, field.id, field.defaultRate ?? 0);
      total += input.purchasePrice * (rate / 100);
    }
  }
  return total;
}

function sumPurchaseFixed(input: SimulatorInput, market: MarketConfig): number {
  let total = 0;
  for (const field of market.taxProfile.purchaseTaxFields) {
    if (field.bucket !== 'purchase_fixed') continue;
    total += fieldValue(input, field.id, field.defaultAmount ?? 0);
  }
  return total;
}

function sumAnnual(input: SimulatorInput, market: MarketConfig, bucket: string): number {
  let total = 0;
  for (const field of market.taxProfile.annualCostFields) {
    if (field.bucket !== bucket) continue;
    if (field.inputType === 'amount') {
      total += fieldValue(input, field.id, field.defaultAmount ?? 0);
    } else if (field.inputType === 'percentage') {
      const rate = fieldValue(input, field.id, field.defaultRate ?? 0);
      total += input.monthlyRent * 12 * (rate / 100);
    }
  }
  return total;
}

function rentalTaxRate(input: SimulatorInput, market: MarketConfig): number {
  const field = market.taxProfile.rentalTaxFields.find((f) => f.bucket === 'rental_tax_rate');
  if (!field) return input.effectiveTaxRate;
  return fieldValue(input, field.id, field.defaultRate ?? input.effectiveTaxRate);
}

/** Resolve market tax fields into universal calculation buckets */
export function resolveTaxAmounts(input: SimulatorInput, market: MarketConfig): ResolvedTaxAmounts {
  // Legacy ES fields fallback when taxValues empty
  const legacy = !input.taxValues || Object.keys(input.taxValues).length === 0;

  if (legacy && input.marketSlug === 'es') {
    const transfer =
      input.propertyType === 'new_build'
        ? input.purchasePrice * (input.vatPercent / 100)
        : input.purchasePrice * (input.itpPercent / 100);
    const ajd = input.purchasePrice * (input.ajdPercent / 100);
    return {
      transferTaxAmount: transfer,
      extraPurchaseTaxAmount: ajd,
      purchaseFixedCosts: input.notaryAndRegistry,
      annualPropertyTax: input.ibi,
      annualCommunity: input.communityFees,
      annualInsurance: input.homeInsurance + input.rentDefaultInsurance,
      annualMaintenance: input.maintenance,
      annualOther: input.otherExpenses,
      managementPercent: input.managementPercent,
      effectiveRentalTaxRate: input.effectiveTaxRate,
    };
  }

  return {
    transferTaxAmount: sumPurchasePercent(input, market, ['transfer_tax']),
    extraPurchaseTaxAmount: sumPurchasePercent(input, market, ['purchase_tax_extra']),
    purchaseFixedCosts: sumPurchaseFixed(input, market),
    annualPropertyTax: sumAnnual(input, market, 'annual_property'),
    annualCommunity: sumAnnual(input, market, 'annual_community'),
    annualInsurance: sumAnnual(input, market, 'annual_insurance'),
    annualMaintenance: sumAnnual(input, market, 'annual_maintenance'),
    annualOther: sumAnnual(input, market, 'annual_other'),
    managementPercent: fieldValue(input, 'management', input.managementPercent),
    effectiveRentalTaxRate: rentalTaxRate(input, market),
  };
}

export function buildDefaultTaxValues(market: MarketConfig): Record<string, number> {
  const values: Record<string, number> = {};
  for (const field of [
    ...market.taxProfile.purchaseTaxFields,
    ...market.taxProfile.annualCostFields,
    ...market.taxProfile.rentalTaxFields,
  ]) {
    if (field.inputType === 'percentage') {
      values[field.id] = field.defaultRate ?? 0;
    } else {
      values[field.id] = field.defaultAmount ?? 0;
    }
  }
  return values;
}

export function buildDefaultSimulatorInput(market: MarketConfig): SimulatorInput {
  const mortgage = market.defaultMortgage;
  const purchasePrice = defaultPurchasePrice(market);
  const downPayment = Math.round(purchasePrice * (1 - mortgage.defaultLtv));

  return {
    purchasePrice,
    region: market.defaultRegion,
    propertyType: 'second_hand',
    squareMeters: market.defaultAreaUnit === 'sqft' ? 65 : 65,
    areaSqft: market.defaultAreaUnit === 'sqft' ? 700 : undefined,
    propertyStatus: 'ready',
    renovationCost: 0,
    furnitureCost: 0,
    monthlyRent: defaultRent(market),
    vacancyPercent: 8,
    rentGrowthPercent: 2,
    ibi: 0,
    communityFees: 0,
    homeInsurance: 0,
    rentDefaultInsurance: 0,
    maintenance: 0,
    managementPercent: 0,
    otherExpenses: 0,
    itpPercent: 6,
    vatPercent: 10,
    ajdPercent: 0.5,
    notaryAndRegistry: 0,
    liquidityReserve: defaultLiquidity(market),
    useMortgage: true,
    downPayment,
    financedAmount: purchasePrice - downPayment,
    interestRate: mortgage.defaultInterestRate,
    mortgageYears: mortgage.defaultYears,
    effectiveTaxRate: 0,
    projectionHorizon: 10,
    appreciationPercent: 2,
    saleCostPercent: 3,
    expenseInflationPercent: 2,
    marketSlug: market.slug,
    taxValues: buildDefaultTaxValues(market),
  };
}

function defaultPurchasePrice(market: MarketConfig): number {
  const map: Record<string, number> = {
    ES: 150_000, PT: 180_000, IT: 200_000, GB: 180_000,
    US: 280_000, MX: 2_500_000, AU: 550_000, IE: 320_000,
  };
  return map[market.code] ?? 150_000;
}

function defaultRent(market: MarketConfig): number {
  const map: Record<string, number> = {
    ES: 850, PT: 900, IT: 950, GB: 950,
    US: 1800, MX: 18_000, AU: 2200, IE: 1800,
  };
  return map[market.code] ?? 850;
}

function defaultLiquidity(market: MarketConfig): number {
  const map: Record<string, number> = {
    ES: 5000, PT: 5000, IT: 5000, GB: 3000,
    US: 5000, MX: 50_000, AU: 5000, IE: 5000,
  };
  return map[market.code] ?? 5000;
}
