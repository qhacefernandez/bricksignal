import { getMarketInputRanges } from '@/config/inputRanges';
import { expandBasicToProInput } from '@/lib/calculations/pro';
import { marketPath } from '@/i18n/routes';
import { saveBasicScenario, saveScenario } from '@/lib/marketStorage';
import type { BasicSimulatorInput } from '../calculations/basic';
import type { SimulatorInput } from '../types';
import type { InvestorCriteria, Listing } from './types';

const NOTARY_DEFAULT = 2_500;
const LIQUIDITY_RESERVE = 3_000;
const ITP_DEFAULT = 6;
const AJD_DEFAULT = 0.5;

export function listingToBasicSimulatorInput(
  listing: Listing,
  criteria: InvestorCriteria,
  marketSlug: NonNullable<SimulatorInput['marketSlug']>,
): BasicSimulatorInput {
  const ranges = getMarketInputRanges(marketSlug);
  const useMortgage = criteria.mortgageLtv > 0 && criteria.mortgageLtv < 1;
  const downPayment = Math.min(
    listing.price * (1 - criteria.mortgageLtv),
    criteria.availableCash,
  );
  const roomMultiplier = criteria.strategy === 'room_rental' ? 1.15 : 1;

  return {
    purchasePrice: listing.price,
    monthlyRent: Math.round(listing.estimatedMonthlyRent * roomMultiplier),
    region: listing.city,
    useMortgage,
    downPayment: useMortgage ? downPayment : listing.price,
    interestRate: criteria.interestRate,
    mortgageYears: criteria.mortgageYears,
    purchaseCostsPercent: ranges.purchaseCostsPercent.defaultValue,
    annualExpensesPercent: ranges.annualExpensesPercent.defaultValue,
    annualExpensesMode: 'percent',
    annualExpensesAbsolute:
      listing.estimatedMonthlyRent * 12 * (ranges.annualExpensesPercent.defaultValue / 100),
    vacancyPercent: 0,
    vacancyMode: 'percent',
    vacancyMonths: 0,
    marketSlug,
  };
}

export function listingToSimulatorInput(
  listing: Listing,
  criteria: InvestorCriteria,
  marketSlug?: SimulatorInput['marketSlug'],
): SimulatorInput {
  const slug = marketSlug ?? 'es';
  const basic = listingToBasicSimulatorInput(listing, criteria, slug);
  const full = expandBasicToProInput(basic, slug);
  const needsRenovation =
    listing.condition === 'needs_renovation' || listing.estimatedRenovationCost > 0;

  return {
    ...full,
    purchasePrice: listing.price,
    region: listing.city,
    squareMeters: listing.sizeM2,
    propertyStatus: needsRenovation ? 'needs_renovation' : 'ready',
    renovationCost: listing.estimatedRenovationCost,
    furnitureCost: criteria.strategy === 'room_rental' ? 3_000 : 0,
    monthlyRent: basic.monthlyRent,
    vacancyPercent: Math.round(criteria.vacancyRate * 100),
    rentGrowthPercent: criteria.rentGrowth,
    ibi: listing.ibiAnnual,
    communityFees: listing.communityFeesAnnual,
    homeInsurance: Math.max(150, listing.price * 0.001),
    rentDefaultInsurance: 0,
    maintenance: Math.max(400, listing.sizeM2 * 8),
    managementPercent: criteria.strategy === 'room_rental' ? 8 : 0,
    otherExpenses: listing.otherAnnualCosts,
    itpPercent: ITP_DEFAULT,
    vatPercent: 10,
    ajdPercent: AJD_DEFAULT,
    notaryAndRegistry: NOTARY_DEFAULT,
    liquidityReserve: LIQUIDITY_RESERVE,
    useMortgage: basic.useMortgage,
    downPayment: basic.downPayment,
    financedAmount: basic.useMortgage ? Math.max(0, listing.price - basic.downPayment) : 0,
    interestRate: criteria.interestRate,
    mortgageYears: criteria.mortgageYears,
    appreciationPercent: criteria.propertyAppreciation,
    expenseInflationPercent: criteria.expenseGrowth,
    marketSlug: slug,
  };
}

export function pushListingToSimulator(
  listing: Listing,
  criteria: InvestorCriteria,
  marketSlug: NonNullable<SimulatorInput['marketSlug']> = 'es',
): void {
  const basic = listingToBasicSimulatorInput(listing, criteria, marketSlug);
  const pro = listingToSimulatorInput(listing, criteria, marketSlug);
  saveBasicScenario(marketSlug, basic);
  saveScenario(marketSlug, pro);
  window.location.href = marketPath(marketSlug, 'simulator');
}
