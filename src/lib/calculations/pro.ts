import {
  buildAnnualCashflows,
  buildSaleScenario,
  buildSensitivity,
  calculateInvestment,
  computeBreakEvenRent,
  computeCashOnCash,
  computeDSCR,
  computeInitialInvestment,
  computeNOI,
  computeDebtServiceAnnual,
} from '../calculations';
import { buildIRRCashflows, calculateIRR } from '../irr';
import { calculateProjectionAtHorizon } from '../calculations';
import type { BasicSimulatorInput } from './basic';
import { calculateBasicOperatingExpenses, resolveBasicVacancyRate } from './basic';
import { buildDefaultSimulatorInput } from '../taxAssumptions';
import { getMarket } from '@/config/markets';
import type { MarketSlug } from '@/config/types';
import type {
  AnnualCashflowRow,
  CalculationResults,
  SensitivityScenario,
  SimulatorInput,
} from '../types';

export function expandBasicToProInput(
  basic: BasicSimulatorInput,
  marketSlug: MarketSlug,
): SimulatorInput {
  const market = getMarket(marketSlug);
  const full = buildDefaultSimulatorInput(market);

  const purchaseCosts = basic.purchasePrice * (basic.purchaseCostsPercent / 100);
  const financed = basic.useMortgage
    ? Math.max(0, basic.purchasePrice - basic.downPayment)
    : 0;

  const opEx = calculateBasicOperatingExpenses(basic);
  const vacancyRate = resolveBasicVacancyRate(basic);

  return {
    ...full,
    marketSlug,
    purchasePrice: basic.purchasePrice,
    monthlyRent: basic.monthlyRent,
    region: basic.region,
    vacancyPercent: vacancyRate * 100,
    vacancyMonths: basic.vacancyMode === 'months' ? basic.vacancyMonths : undefined,
    useMortgage: basic.useMortgage,
    downPayment: basic.useMortgage ? basic.downPayment : basic.purchasePrice,
    financedAmount: financed,
    interestRate: basic.interestRate,
    mortgageYears: basic.mortgageYears,
    amortizationMethod: basic.amortizationMethod,
    itpPercent: basic.purchaseCostsPercent * 0.75,
    notaryAndRegistry: purchaseCosts * 0.25,
    ibi: opEx * 0.15,
    communityFees: opEx * 0.25,
    homeInsurance: opEx * 0.1,
    maintenance: opEx * 0.35,
    otherExpenses: opEx * 0.15,
    managementPercent: 0,
  };
}

export function calculateProAnalysis(input: SimulatorInput): CalculationResults {
  return calculateInvestment(input);
}

export {
  calculateInvestment as calculateDetailedAnalysis,
  computeInitialInvestment as calculateDetailedInitialInvestment,
  computeNOI,
  computeDebtServiceAnnual as calculateDebtService,
  computeCashOnCash,
  computeDSCR,
  computeBreakEvenRent,
  buildAnnualCashflows as calculateAnnualProjection,
  buildSensitivity as calculateSensitivity,
  buildSaleScenario as calculateExitScenario,
  calculateProjectionAtHorizon,
};

export function calculateIRRFromResults(
  input: SimulatorInput,
  results: CalculationResults,
): number {
  const flows = buildIRRCashflows(
    results.initialInvestment,
    results.annualCashflows.map((r) => r.cashflowAfterTax),
    input.projectionHorizon,
    results.saleScenario.netSaleProceeds,
  );
  return calculateIRR(flows) * 100;
}

export type ProAnalysisBundle = CalculationResults & {
  annualCashflows: AnnualCashflowRow[];
  sensitivity: SensitivityScenario[];
};

export function runFullProAnalysis(basic: BasicSimulatorInput): {
  input: SimulatorInput;
  results: ProAnalysisBundle;
} {
  const marketSlug = basic.marketSlug ?? 'es';
  const input = expandBasicToProInput(basic, marketSlug);
  const results = calculateProAnalysis(input);
  return { input, results };
}
