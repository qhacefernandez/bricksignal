import { getMarket } from '@/config/markets';
import { buildIRRCashflows, calculateIRR } from './irr';
import { AMORTIZATION_METHOD_LABELS, averageMonthlyPaymentYear1, mortgageDebtServiceForYear, mortgageInterestForYear, remainingBalanceAfterYears, resolveAmortizationMethod } from './mortgage';
import { resolveTaxAmounts } from './taxAssumptions';
import {
  estimateRentalTaxForMarket,
  marketAllowsMortgageInterestDeduction,
  resolveRentalTaxRate,
} from './calculations/rentalTax';
import type {
  AnnualCashflowRow,
  CalculationResults,
  SensitivityScenario,
  SimulatorInput,
  ViabilityStatus,
} from './types';

function getResolved(input: SimulatorInput) {
  if (input.marketSlug) {
    return resolveTaxAmounts(input, getMarket(input.marketSlug));
  }
  return null;
}

export function getVacancyRate(input: SimulatorInput): number {
  if (input.vacancyMonths !== undefined && input.vacancyMonths > 0) {
    return input.vacancyMonths / 12;
  }
  return (input.vacancyPercent ?? 0) / 100;
}

export function computeTransferTax(input: SimulatorInput): number {
  const resolved = getResolved(input);
  if (resolved) return resolved.transferTaxAmount;
  if (input.propertyType === 'new_build') {
    return input.purchasePrice * (input.vatPercent / 100);
  }
  return input.purchasePrice * (input.itpPercent / 100);
}

export function computeAjd(input: SimulatorInput): number {
  const resolved = getResolved(input);
  if (resolved) return resolved.extraPurchaseTaxAmount;
  return input.purchasePrice * (input.ajdPercent / 100);
}

export function computeAcquisitionCost(input: SimulatorInput): number {
  const resolved = getResolved(input);
  if (resolved) {
    return input.purchasePrice + resolved.transferTaxAmount + resolved.extraPurchaseTaxAmount + resolved.purchaseFixedCosts;
  }
  return (
    input.purchasePrice +
    computeTransferTax(input) +
    computeAjd(input) +
    input.notaryAndRegistry
  );
}

export function computeInitialInvestment(input: SimulatorInput): number {
  const renovation = input.propertyStatus === 'needs_renovation' ? input.renovationCost : 0;
  const downPayment = input.useMortgage ? input.downPayment : input.purchasePrice;
  const resolved = getResolved(input);

  if (resolved) {
    return (
      downPayment +
      resolved.transferTaxAmount +
      resolved.extraPurchaseTaxAmount +
      resolved.purchaseFixedCosts +
      renovation +
      input.furnitureCost +
      input.liquidityReserve
    );
  }

  return (
    downPayment +
    computeTransferTax(input) +
    computeAjd(input) +
    input.notaryAndRegistry +
    renovation +
    input.furnitureCost +
    input.liquidityReserve
  );
}

export function computeOperatingExpenses(input: SimulatorInput, annualRent?: number): number {
  const rent = annualRent ?? input.monthlyRent * 12;
  const resolved = getResolved(input);

  if (resolved) {
    const management = rent * (resolved.managementPercent / 100);
    return (
      resolved.annualPropertyTax +
      resolved.annualCommunity +
      resolved.annualInsurance +
      resolved.annualMaintenance +
      resolved.annualOther +
      management
    );
  }

  const management = rent * (input.managementPercent / 100);
  return (
    input.ibi +
    input.communityFees +
    input.homeInsurance +
    input.rentDefaultInsurance +
    input.maintenance +
    input.otherExpenses +
    management
  );
}

export function getEffectiveTaxRate(input: SimulatorInput): number {
  const resolved = getResolved(input);
  return resolved?.effectiveRentalTaxRate ?? input.effectiveTaxRate;
}

export function computeEffectiveAnnualRent(input: SimulatorInput, monthlyRent?: number): number {
  const rent = monthlyRent ?? input.monthlyRent;
  const vacancy = getVacancyRate(input);
  return rent * 12 * (1 - vacancy);
}

export function computeNOI(input: SimulatorInput, overrides?: Partial<{ monthlyRent: number; operatingExpenses: number }>): number {
  const effectiveRent = computeEffectiveAnnualRent(input, overrides?.monthlyRent);
  const grossRent = (overrides?.monthlyRent ?? input.monthlyRent) * 12;
  const operating = overrides?.operatingExpenses ?? computeOperatingExpenses(input, grossRent);
  return effectiveRent - operating;
}

function mortgageParams(input: SimulatorInput, interestRate?: number) {
  return {
    principal: input.financedAmount,
    rate: interestRate ?? input.interestRate,
    years: input.mortgageYears,
    method: resolveAmortizationMethod(input.amortizationMethod, input.marketSlug),
  };
}

export function computeMonthlyMortgagePayment(input: SimulatorInput, interestRate?: number): number {
  if (!input.useMortgage || input.financedAmount <= 0) return 0;
  const { principal, rate, years, method } = mortgageParams(input, interestRate);
  return averageMonthlyPaymentYear1(principal, rate, years, method);
}

export function computeDebtServiceAnnual(
  input: SimulatorInput,
  interestRate?: number,
  year = 1,
): number {
  if (!input.useMortgage || input.financedAmount <= 0) return 0;
  const { principal, rate, years, method } = mortgageParams(input, interestRate);
  return mortgageDebtServiceForYear(principal, rate, years, year, method);
}

export function applyTax(cashflowBeforeTax: number, taxRate: number): number {
  if (cashflowBeforeTax <= 0) return cashflowBeforeTax;
  return cashflowBeforeTax * (1 - taxRate / 100);
}

function resolveTaxRateForRental(input: SimulatorInput): number {
  return resolveRentalTaxRate(input.marketSlug, getEffectiveTaxRate(input));
}

function computeRentalTaxAmount(
  input: SimulatorInput,
  noi: number,
  debtService: number,
  annualInterest: number,
): number {
  if (!marketAllowsMortgageInterestDeduction(input.marketSlug)) {
    const taxRate = resolveTaxRateForRental(input);
    if (taxRate <= 0) return 0;
    const beforeTax = noi - debtService;
    return beforeTax > 0 ? beforeTax * (taxRate / 100) : 0;
  }
  return estimateRentalTaxForMarket(input.marketSlug, {
    noi,
    debtService,
    annualMortgageInterest: annualInterest,
    taxRatePercent: resolveTaxRateForRental(input),
  });
}

export function computeCashflowAfterTax(input: SimulatorInput, overrides?: {
  monthlyRent?: number;
  interestRate?: number;
  operatingExpenses?: number;
  mortgageYear?: number;
}): number {
  const noi = computeNOI(input, {
    monthlyRent: overrides?.monthlyRent,
    operatingExpenses: overrides?.operatingExpenses,
  });
  const interestRate = overrides?.interestRate ?? input.interestRate;
  const year = overrides?.mortgageYear ?? 1;
  const { principal, rate, years, method } = mortgageParams(input, interestRate);
  const debtService = computeDebtServiceAnnual(input, interestRate, year);
  const annualInterest = input.useMortgage && principal > 0
    ? mortgageInterestForYear(principal, rate, years, year, method)
    : 0;
  const tax = computeRentalTaxAmount(input, noi, debtService, annualInterest);
  return noi - debtService - tax;
}

export function computeGrossYield(input: SimulatorInput, monthlyRent?: number): number {
  if (input.purchasePrice <= 0) return 0;
  return ((monthlyRent ?? input.monthlyRent) * 12 / input.purchasePrice) * 100;
}

export function computeNetYield(input: SimulatorInput): number {
  const acquisition = computeAcquisitionCost(input);
  if (acquisition <= 0) return 0;
  return (computeNOI(input) / acquisition) * 100;
}

export function computeCashOnCash(input: SimulatorInput): number {
  const investment = computeInitialInvestment(input);
  if (investment <= 0) return 0;
  return (computeCashflowAfterTax(input) / investment) * 100;
}

export function computeDSCR(input: SimulatorInput, overrides?: { monthlyRent?: number; interestRate?: number }): number {
  const debtService = computeDebtServiceAnnual(input, overrides?.interestRate);
  if (debtService <= 0) return Infinity;
  return computeNOI(input, { monthlyRent: overrides?.monthlyRent }) / debtService;
}

export function computeBreakEvenRent(input: SimulatorInput, targetMonthlyCashflow = 0): number {
  const vacancy = getVacancyRate(input);
  const denominator = 12 * (1 - vacancy);
  if (denominator <= 0) return 0;

  const operating = computeOperatingExpenses(input);
  const debtService = computeDebtServiceAnnual(input);
  const annualTarget = targetMonthlyCashflow * 12;

  let requiredBeforeTax = operating + debtService + annualTarget;
  const taxRate = getEffectiveTaxRate(input);
  if (taxRate > 0 && requiredBeforeTax > 0) {
    requiredBeforeTax = requiredBeforeTax / (1 - taxRate / 100);
  }

  return requiredBeforeTax / denominator;
}

export function assessViability(
  monthlyCashflow: number,
  dscr: number,
): { status: ViabilityStatus; label: string; reason: string } {
  const strongNegative = monthlyCashflow < -100;
  const slightlyNegative = monthlyCashflow < 0 && monthlyCashflow >= -100;

  if (monthlyCashflow > 0 && dscr >= 1.25) {
    return {
      status: 'green',
      label: 'Viable',
      reason: 'Cashflow mensual positivo y cobertura de deuda sólida (DSCR ≥ 1,25).',
    };
  }

  if (strongNegative || dscr < 1.0) {
    return {
      status: 'red',
      label: 'Riesgo alto',
      reason:
        monthlyCashflow < -100
          ? 'Cashflow mensual muy negativo. Revisa renta, gastos o financiación.'
          : 'La deuda no queda bien cubierta por el NOI (DSCR < 1,0).',
    };
  }

  if (slightlyNegative || (dscr >= 1.0 && dscr < 1.25)) {
    return {
      status: 'yellow',
      label: 'Ajustado',
      reason: slightlyNegative
        ? 'Cashflow mensual ligeramente negativo. Margen de mejora limitado.'
        : 'Cobertura de deuda aceptable pero sin mucho colchón (DSCR 1,0–1,25).',
    };
  }

  return {
    status: 'yellow',
    label: 'Ajustado',
    reason: 'Revisa los supuestos: el escenario no encaja claramente en verde o rojo.',
  };
}

export function buildAnnualCashflows(input: SimulatorInput, maxYears: number): AnnualCashflowRow[] {
  const rows: AnnualCashflowRow[] = [];
  let propertyValue = input.purchasePrice;

  for (let year = 1; year <= maxYears; year++) {
    const rentGrowth = Math.pow(1 + input.rentGrowthPercent / 100, year - 1);
    const expenseGrowth = Math.pow(1 + input.expenseInflationPercent / 100, year - 1);
    const monthlyRent = input.monthlyRent * rentGrowth;
    const grossRent = monthlyRent * 12;
    const vacancy = getVacancyRate(input);
    const vacancyLoss = grossRent * vacancy;
    const effectiveRent = grossRent - vacancyLoss;

    const baseOperating = computeOperatingExpenses(input, grossRent);
    const operatingExpenses = baseOperating * expenseGrowth;
    const noi = effectiveRent - operatingExpenses;
    const debtService = computeDebtServiceAnnual(input, undefined, year);
    const { principal, rate, years, method } = mortgageParams(input);
    const annualInterest = input.useMortgage && principal > 0
      ? mortgageInterestForYear(principal, rate, years, year, method)
      : 0;
    const cashflowBeforeTax = noi - debtService;
    const taxes = computeRentalTaxAmount(input, noi, debtService, annualInterest);
    const cashflowAfterTax = noi - debtService - taxes;

    propertyValue *= 1 + input.appreciationPercent / 100;
    const remainingDebt = input.useMortgage
      ? remainingBalanceAfterYears(
          input.financedAmount,
          input.interestRate,
          input.mortgageYears,
          year,
          method,
        )
      : 0;

    rows.push({
      year,
      grossRent,
      vacancyLoss,
      effectiveRent,
      operatingExpenses,
      noi,
      debtService,
      cashflowBeforeTax,
      taxes,
      cashflowAfterTax,
      propertyValue,
      remainingDebt,
      equity: propertyValue - remainingDebt,
    });
  }

  return rows;
}

export function buildSaleScenario(input: SimulatorInput, horizonYears: number) {
  const cashflows = buildAnnualCashflows(input, horizonYears);
  const last = cashflows[cashflows.length - 1];
  const propertyValue = last?.propertyValue ?? input.purchasePrice;
  const remainingDebt = last?.remainingDebt ?? 0;
  const saleCosts = propertyValue * (input.saleCostPercent / 100);
  const netSaleProceeds = propertyValue - saleCosts - remainingDebt;
  const initialInvestment = computeInitialInvestment(input);
  const totalCashflow = cashflows.reduce((s, r) => s + r.cashflowAfterTax, 0);

  return {
    horizonYears,
    propertyValue,
    saleCosts,
    netSaleProceeds,
    remainingDebt,
    netEquity: propertyValue - remainingDebt,
    totalReturn: totalCashflow + netSaleProceeds - initialInvestment,
  };
}

export function buildSensitivity(input: SimulatorInput): SensitivityScenario[] {
  const rentMultipliers = [
    { multiplier: 0.9, label: '-10%' },
    { multiplier: 1, label: 'Base' },
    { multiplier: 1.1, label: '+10%' },
  ];
  const baseVacancy = input.vacancyPercent ?? 5;
  const vacancyRates = [
    baseVacancy,
    Math.min(30, baseVacancy + 5),
    Math.min(30, baseVacancy + 10),
    Math.min(30, baseVacancy + 15),
  ];
  const rateDeltas = [0, 1, 2];
  const expenseMultipliers = [1, 1.1, 1.2];
  const scenarios: SensitivityScenario[] = [];

  for (const rent of rentMultipliers) {
    for (const vacancy of vacancyRates) {
      for (const delta of rateDeltas) {
        for (const expMul of expenseMultipliers) {
        const modifiedInput: SimulatorInput = {
          ...input,
          vacancyPercent: vacancy,
          vacancyMonths: undefined,
        };
        const monthlyRent = input.monthlyRent * rent.multiplier;
        const interestRate = input.interestRate + delta;
        const grossRent = monthlyRent * 12;
        const baseOpEx = computeOperatingExpenses(input, grossRent);
        const annualCF = computeCashflowAfterTax(modifiedInput, {
          monthlyRent,
          interestRate,
          operatingExpenses: baseOpEx * expMul,
        });
        const monthlyCF = annualCF / 12;
        const dscr = computeDSCR(modifiedInput, { monthlyRent, interestRate });
        const viability = assessViability(monthlyCF, dscr);

        scenarios.push({
          rentMultiplier: rent.multiplier,
          rentLabel: rent.label,
          vacancyPercent: vacancy,
          interestRate,
          expenseMultiplier: expMul,
          cell: {
            monthlyCashflow: monthlyCF,
            netYield: computeNetYieldForRent(modifiedInput, monthlyRent),
            dscr,
            viability: viability.status,
          },
        });
        }
      }
    }
  }

  return scenarios;
}

/** Vacancy stress from base scenario — for PRO alerts */
export function isVacancySensitive(input: SimulatorInput): boolean {
  const base = input.vacancyPercent ?? 5;
  const stressed = { ...input, vacancyPercent: Math.min(30, base + 5), vacancyMonths: undefined };
  const baseCf = computeCashflowAfterTax(input) / 12;
  const stressedCf = computeCashflowAfterTax(stressed) / 12;
  return baseCf > 0 && stressedCf <= 0;
}

export function buildAssumptions(input: SimulatorInput): Record<string, string> {
  const vacancy = getVacancyRate(input);
  const method = resolveAmortizationMethod(input.amortizationMethod, input.marketSlug);
  return {
    'Precio de compra': `${input.purchasePrice.toLocaleString('es-ES')} €`,
    'Comunidad autónoma': input.region,
    'Tipo de inmueble': input.propertyType === 'new_build' ? 'Obra nueva' : 'Segunda mano',
    'Renta mensual': `${input.monthlyRent.toLocaleString('es-ES')} €`,
    'Vacancia': `${(vacancy * 100).toFixed(1)} %`,
    'Amortización': AMORTIZATION_METHOD_LABELS[method].es,
    'Tipo de interés': `${input.interestRate} %`,
    'Plazo hipoteca': `${input.mortgageYears} años`,
    'Revalorización anual': `${input.appreciationPercent} %`,
    'Horizonte': `${input.projectionHorizon} años`,
    'Impuesto efectivo alquiler': `${getEffectiveTaxRate(input)} %`,
  };
}

export function calculateInvestment(input: SimulatorInput): CalculationResults {
  const monthlyMortgagePayment = computeMonthlyMortgagePayment(input);
  const annualCashflowAfterTax = computeCashflowAfterTax(input);
  const monthlyCashflow = annualCashflowAfterTax / 12;
  const dscr = computeDSCR(input);
  const viability = assessViability(monthlyCashflow, dscr);
  const maxYears = Math.max(input.projectionHorizon, 20);
  const annualCashflows = buildAnnualCashflows(input, maxYears);

  const irrFlows = buildIRRCashflows(
    computeInitialInvestment(input),
    annualCashflows.map((r) => r.cashflowAfterTax),
    input.projectionHorizon,
    buildSaleScenario(input, input.projectionHorizon).netSaleProceeds,
  );

  return {
    grossYield: computeGrossYield(input),
    netYield: computeNetYield(input),
    monthlyCashflow,
    annualCashflowAfterTax,
    monthlyMortgagePayment,
    initialInvestment: computeInitialInvestment(input),
    viability: viability.status,
    viabilityLabel: viability.label,
    viabilityReason: viability.reason,
    cashOnCash: computeCashOnCash(input),
    dscr,
    breakEvenRent: computeBreakEvenRent(input),
    irr: calculateIRR(irrFlows) * 100,
    noi: computeNOI(input),
    effectiveAnnualRent: computeEffectiveAnnualRent(input),
    operatingExpenses: computeOperatingExpenses(input),
    debtServiceAnnual: computeDebtServiceAnnual(input),
    acquisitionCost: computeAcquisitionCost(input),
    transferTax: computeTransferTax(input),
    totalPurchaseCosts: computeTransferTax(input) + computeAjd(input) + input.notaryAndRegistry,
    annualCashflows,
    sensitivity: buildSensitivity(input),
    saleScenario: buildSaleScenario(input, input.projectionHorizon),
    assumptions: buildAssumptions(input),
  };
}

export function computeNetYieldForRent(input: SimulatorInput, monthlyRent: number): number {
  const acquisition = computeAcquisitionCost(input);
  if (acquisition <= 0) return 0;
  return (computeNOI(input, { monthlyRent }) / acquisition) * 100;
}

export function calculateProjectionAtHorizon(
  input: SimulatorInput,
  years: 10 | 20,
): {
  cumulativeCashflow: number;
  propertyValue: number;
  equity: number;
  irr: number;
} {
  const modified = { ...input, projectionHorizon: years as SimulatorInput['projectionHorizon'] };
  const cashflows = buildAnnualCashflows(modified, years);
  const cumulativeCashflow = cashflows.reduce((s, r) => s + r.cashflowAfterTax, 0);
  const last = cashflows[cashflows.length - 1];
  const sale = buildSaleScenario(modified, years);
  const irrFlows = buildIRRCashflows(
    computeInitialInvestment(modified),
    cashflows.map((r) => r.cashflowAfterTax),
    years,
    sale.netSaleProceeds,
  );

  return {
    cumulativeCashflow,
    propertyValue: last?.propertyValue ?? input.purchasePrice,
    equity: last?.equity ?? 0,
    irr: calculateIRR(irrFlows) * 100,
  };
}

export const DUE_DILIGENCE_CHECKLIST = [
  'Revisar estado registral y cargas del inmueble',
  'Confirmar comunidad de propietarios al día',
  'Verificar licencia de alquiler si aplica en tu municipio',
  'Solicitar certificado energético vigente',
  'Contrastar renta de mercado con 3–5 comparables recientes',
  'Calcular reserva para vacancia, impagos y reparaciones',
  'Revisar cláusulas de la hipoteca y posibles subidas de tipo',
  'Estimar coste fiscal real con un asesor (orientativo aquí)',
  'Prever gastos de adquisición completos (ITP/IVA, notaría, registro)',
  'Definir plan de salida (venta, refinanciación o hold)',
] as const;
