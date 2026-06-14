import type { MarketSlug } from '@/config/types';
import { MORTGAGE_PROFILES } from '@/config/mortgageProfiles';

/** Cuota constante (francés) · capital constante (alemán/lineal) · solo intereses */
export type AmortizationMethod = 'french' | 'linear' | 'interest_only';

export const AMORTIZATION_METHOD_LABELS: Record<
  AmortizationMethod,
  { es: string; en: string; pt: string; it: string }
> = {
  french: {
    es: 'Cuota constante (francés)',
    en: 'Annuity (French)',
    pt: 'Prestação constante (francês)',
    it: 'Rata costante (francese)',
  },
  linear: {
    es: 'Capital constante (alemán)',
    en: 'Linear (constant principal)',
    pt: 'Capital constante (alemão)',
    it: 'Capitale costante (tedesco)',
  },
  interest_only: {
    es: 'Solo intereses',
    en: 'Interest-only',
    pt: 'Só juros',
    it: 'Solo interessi',
  },
};

export function resolveAmortizationMethod(
  method: AmortizationMethod | undefined,
  marketSlug?: MarketSlug,
): AmortizationMethod {
  if (method) return method;
  if (marketSlug) return MORTGAGE_PROFILES[marketSlug].defaultAmortizationMethod;
  return 'french';
}

/**
 * French amortization mortgage payment (monthly).
 * payment = P * r * (1+r)^n / ((1+r)^n - 1)
 */
export function frenchMonthlyPayment(
  principal: number,
  annualRatePercent: number,
  years: number,
): number {
  if (principal <= 0 || years <= 0) return 0;

  const n = years * 12;
  const monthlyRate = annualRatePercent / 100 / 12;

  if (monthlyRate === 0) {
    return principal / n;
  }

  const factor = Math.pow(1 + monthlyRate, n);
  return (principal * monthlyRate * factor) / (factor - 1);
}

export interface AmortizationRow {
  month: number;
  payment: number;
  interest: number;
  principal: number;
  balance: number;
}

function monthlyRate(annualRatePercent: number): number {
  return annualRatePercent / 100 / 12;
}

function buildFrenchSchedule(
  principal: number,
  annualRatePercent: number,
  years: number,
): AmortizationRow[] {
  if (principal <= 0 || years <= 0) return [];

  const payment = frenchMonthlyPayment(principal, annualRatePercent, years);
  const rate = monthlyRate(annualRatePercent);
  const totalMonths = years * 12;
  const schedule: AmortizationRow[] = [];
  let balance = principal;

  for (let month = 1; month <= totalMonths; month++) {
    const interest = rate === 0 ? 0 : balance * rate;
    const principalPaid = Math.min(payment - interest, balance);
    balance = Math.max(0, balance - principalPaid);

    schedule.push({
      month,
      payment: balance + principalPaid > 0 ? payment : interest + principalPaid,
      interest,
      principal: principalPaid,
      balance,
    });
  }

  return schedule;
}

/** Capital amortizado igual cada mes; cuota total decrece */
function buildLinearSchedule(
  principal: number,
  annualRatePercent: number,
  years: number,
): AmortizationRow[] {
  if (principal <= 0 || years <= 0) return [];

  const rate = monthlyRate(annualRatePercent);
  const totalMonths = years * 12;
  const principalPerMonth = principal / totalMonths;
  const schedule: AmortizationRow[] = [];
  let balance = principal;

  for (let month = 1; month <= totalMonths; month++) {
    const interest = rate === 0 ? 0 : balance * rate;
    const principalPaid = Math.min(principalPerMonth, balance);
    const payment = interest + principalPaid;
    balance = Math.max(0, balance - principalPaid);

    schedule.push({ month, payment, interest, principal: principalPaid, balance });
  }

  return schedule;
}

/** Solo intereses; capital pendiente constante hasta vencimiento (modelo BTL simplificado) */
function buildInterestOnlySchedule(
  principal: number,
  annualRatePercent: number,
  years: number,
): AmortizationRow[] {
  if (principal <= 0 || years <= 0) return [];

  const rate = monthlyRate(annualRatePercent);
  const totalMonths = years * 12;
  const monthlyInterest = rate === 0 ? 0 : principal * rate;
  const schedule: AmortizationRow[] = [];

  for (let month = 1; month <= totalMonths; month++) {
    const isLast = month === totalMonths;
    schedule.push({
      month,
      payment: isLast ? monthlyInterest + principal : monthlyInterest,
      interest: monthlyInterest,
      principal: isLast ? principal : 0,
      balance: isLast ? 0 : principal,
    });
  }

  return schedule;
}

export function buildAmortizationSchedule(
  principal: number,
  annualRatePercent: number,
  years: number,
  method: AmortizationMethod = 'french',
): AmortizationRow[] {
  switch (method) {
    case 'linear':
      return buildLinearSchedule(principal, annualRatePercent, years);
    case 'interest_only':
      return buildInterestOnlySchedule(principal, annualRatePercent, years);
    default:
      return buildFrenchSchedule(principal, annualRatePercent, years);
  }
}

/** Cuota media del año 1 (la cuota varía en lineal e interés+balloon) */
export function averageMonthlyPaymentYear1(
  principal: number,
  annualRatePercent: number,
  years: number,
  method: AmortizationMethod = 'french',
): number {
  const year1 = annualMortgageSchedule(principal, annualRatePercent, years, method)[0];
  if (!year1 || year1.payment <= 0) return 0;
  return year1.payment / 12;
}

/** @deprecated Alias de averageMonthlyPaymentYear1 con método francés */
export function monthlyMortgagePayment(
  principal: number,
  annualRatePercent: number,
  years: number,
  method: AmortizationMethod = 'french',
): number {
  return averageMonthlyPaymentYear1(principal, annualRatePercent, years, method);
}

export function remainingBalanceAfterYears(
  principal: number,
  annualRatePercent: number,
  years: number,
  elapsedYears: number,
  method: AmortizationMethod = 'french',
): number {
  if (principal <= 0) return 0;
  const schedule = buildAmortizationSchedule(principal, annualRatePercent, years, method);
  const monthIndex = Math.min(elapsedYears * 12, schedule.length) - 1;
  if (monthIndex < 0) return principal;
  return schedule[monthIndex]?.balance ?? 0;
}

export function annualMortgageSchedule(
  principal: number,
  annualRatePercent: number,
  years: number,
  method: AmortizationMethod = 'french',
): Array<{
  year: number;
  payment: number;
  interest: number;
  principal: number;
  remainingBalance: number;
}> {
  const schedule = buildAmortizationSchedule(principal, annualRatePercent, years, method);
  const result: Array<{
    year: number;
    payment: number;
    interest: number;
    principal: number;
    remainingBalance: number;
  }> = [];

  for (let year = 1; year <= years; year++) {
    const startMonth = (year - 1) * 12;
    const endMonth = year * 12;
    const yearRows = schedule.slice(startMonth, endMonth);

    result.push({
      year,
      payment: yearRows.reduce((s, r) => s + r.payment, 0),
      interest: yearRows.reduce((s, r) => s + r.interest, 0),
      principal: yearRows.reduce((s, r) => s + r.principal, 0),
      remainingBalance: yearRows[yearRows.length - 1]?.balance ?? 0,
    });
  }

  return result;
}

export function mortgageInterestForYear(
  principal: number,
  annualRatePercent: number,
  years: number,
  year: number,
  method: AmortizationMethod = 'french',
): number {
  if (principal <= 0 || years <= 0 || year < 1) return 0;
  const schedule = annualMortgageSchedule(principal, annualRatePercent, years, method);
  return schedule[Math.min(year - 1, schedule.length - 1)]?.interest ?? 0;
}

export function mortgageDebtServiceForYear(
  principal: number,
  annualRatePercent: number,
  years: number,
  year: number,
  method: AmortizationMethod = 'french',
): number {
  if (principal <= 0 || years <= 0 || year < 1) return 0;
  const schedule = annualMortgageSchedule(principal, annualRatePercent, years, method);
  return schedule[Math.min(year - 1, schedule.length - 1)]?.payment ?? 0;
}

export function firstYearMortgageInterest(
  principal: number,
  annualRatePercent: number,
  years: number,
  method: AmortizationMethod = 'french',
): number {
  return mortgageInterestForYear(principal, annualRatePercent, years, 1, method);
}
