import { frenchMonthlyPayment } from '../mortgage';
import type { MarketSlug } from '@/config/types';
import type { ViabilityStatus } from '../types';

export type ExpenseInputMode = 'percent' | 'absolute';
export type VacancyInputMode = 'percent' | 'months';

export interface BasicSimulatorInput {
  purchasePrice: number;
  monthlyRent: number;
  region: string;
  useMortgage: boolean;
  downPayment: number;
  interestRate: number;
  mortgageYears: number;
  purchaseCostsPercent: number;
  annualExpensesPercent: number;
  annualExpensesMode: ExpenseInputMode;
  annualExpensesAbsolute: number;
  vacancyPercent: number;
  vacancyMode: VacancyInputMode;
  vacancyMonths: number;
  marketSlug?: MarketSlug;
}

export interface BasicCalculationResults {
  grossYield: number;
  netYield: number;
  monthlyMortgagePayment: number;
  initialInvestment: number;
  monthlyCashflow: number;
  viability: ViabilityStatus;
  viabilityLabel: string;
  viabilityReason: string;
  /** Internal — not exposed in free UI */
  _noi?: never;
  irr?: never;
  dscr?: never;
}

export const DEFAULT_BASIC_INPUT: BasicSimulatorInput = {
  purchasePrice: 150_000,
  monthlyRent: 850,
  region: 'Madrid',
  useMortgage: true,
  downPayment: 45_000,
  interestRate: 3.2,
  mortgageYears: 25,
  purchaseCostsPercent: 8,
  annualExpensesPercent: 25,
  annualExpensesMode: 'percent',
  annualExpensesAbsolute: 2_550,
  vacancyPercent: 8,
  vacancyMode: 'percent',
  vacancyMonths: 0,
  marketSlug: 'es',
};

export function annualRentGross(monthlyRent: number): number {
  return monthlyRent * 12;
}

export function percentToAnnualExpense(monthlyRent: number, percent: number): number {
  return annualRentGross(monthlyRent) * (percent / 100);
}

export function annualExpenseToPercent(monthlyRent: number, annualAbsolute: number): number {
  const gross = annualRentGross(monthlyRent);
  if (gross <= 0) return 0;
  return (annualAbsolute / gross) * 100;
}

export function resolveBasicVacancyRate(input: BasicSimulatorInput): number {
  if (input.vacancyMode === 'months') {
    return Math.min(1, Math.max(0, input.vacancyMonths / 12));
  }
  return Math.min(1, Math.max(0, input.vacancyPercent / 100));
}

export function calculateBasicMortgagePayment(input: BasicSimulatorInput): number {
  if (!input.useMortgage) return 0;
  const financed = Math.max(0, input.purchasePrice - input.downPayment);
  if (financed <= 0) return 0;
  return frenchMonthlyPayment(financed, input.interestRate, input.mortgageYears);
}

export function calculateBasicPurchaseCosts(input: BasicSimulatorInput): number {
  return input.purchasePrice * (input.purchaseCostsPercent / 100);
}

export function calculateBasicInitialInvestment(input: BasicSimulatorInput): number {
  const purchaseCosts = calculateBasicPurchaseCosts(input);
  const equity = input.useMortgage ? input.downPayment : input.purchasePrice;
  return equity + purchaseCosts;
}

export function calculateBasicEffectiveAnnualRent(input: BasicSimulatorInput): number {
  return input.monthlyRent * 12 * (1 - resolveBasicVacancyRate(input));
}

export function calculateBasicOperatingExpenses(input: BasicSimulatorInput): number {
  if (input.annualExpensesMode === 'absolute') {
    return input.annualExpensesAbsolute;
  }
  return percentToAnnualExpense(input.monthlyRent, input.annualExpensesPercent);
}

export function calculateBasicNOI(input: BasicSimulatorInput): number {
  return calculateBasicEffectiveAnnualRent(input) - calculateBasicOperatingExpenses(input);
}

export function calculateBasicGrossYield(input: BasicSimulatorInput): number {
  if (input.purchasePrice <= 0) return 0;
  return (input.monthlyRent * 12 / input.purchasePrice) * 100;
}

export function calculateBasicNetYield(input: BasicSimulatorInput): number {
  const acquisition = input.purchasePrice + calculateBasicPurchaseCosts(input);
  if (acquisition <= 0) return 0;
  return (calculateBasicNOI(input) / acquisition) * 100;
}

export function calculateBasicMonthlyCashflow(input: BasicSimulatorInput): number {
  const noi = calculateBasicNOI(input);
  const debtService = calculateBasicMortgagePayment(input) * 12;
  return (noi - debtService) / 12;
}

export type BasicCalculationOptions = {
  cashflowWarningThreshold?: number;
};

export function calculateBasicViability(
  monthlyCashflow: number,
  netYield: number,
  cashflowWarningThreshold = -100,
): { status: ViabilityStatus; label: string; reason: string } {
  if (monthlyCashflow > 0 && netYield >= 4) {
    return {
      status: 'green',
      label: 'Viable',
      reason: 'Cashflow mensual positivo y rentabilidad neta simplificada ≥ 4%.',
    };
  }
  if (monthlyCashflow < cashflowWarningThreshold || netYield < 2.5) {
    return {
      status: 'red',
      label: 'Riesgo alto',
      reason:
        monthlyCashflow < cashflowWarningThreshold
          ? `Cashflow mensual muy negativo (umbral ${cashflowWarningThreshold}/mes).`
          : 'Rentabilidad neta simplificada inferior al 2,5%.',
    };
  }
  return {
    status: 'yellow',
    label: 'Ajustado',
    reason: 'Cashflow ajustado o rentabilidad neta entre 2,5% y 4%. Conviene analizar en detalle.',
  };
}

export function calculateBasicInvestment(
  input: BasicSimulatorInput,
  options: BasicCalculationOptions = {},
): BasicCalculationResults {
  const threshold = options.cashflowWarningThreshold ?? -100;
  const monthlyMortgagePayment = calculateBasicMortgagePayment(input);
  const netYield = calculateBasicNetYield(input);
  const monthlyCashflow = calculateBasicMonthlyCashflow(input);
  const viability = calculateBasicViability(monthlyCashflow, netYield, threshold);

  return {
    grossYield: calculateBasicGrossYield(input),
    netYield,
    monthlyMortgagePayment,
    initialInvestment: calculateBasicInitialInvestment(input),
    monthlyCashflow,
    viability: viability.status,
    viabilityLabel: viability.label,
    viabilityReason: viability.reason,
  };
}
