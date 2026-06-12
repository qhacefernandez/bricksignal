/**
 * French amortization mortgage payment (monthly).
 * payment = P * r * (1+r)^n / ((1+r)^n - 1)
 * If r = 0, payment = P / n
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

export function buildAmortizationSchedule(
  principal: number,
  annualRatePercent: number,
  years: number,
): AmortizationRow[] {
  if (principal <= 0 || years <= 0) return [];

  const monthlyPayment = frenchMonthlyPayment(principal, annualRatePercent, years);
  const monthlyRate = annualRatePercent / 100 / 12;
  const totalMonths = years * 12;
  const schedule: AmortizationRow[] = [];
  let balance = principal;

  for (let month = 1; month <= totalMonths; month++) {
    const interest = monthlyRate === 0 ? 0 : balance * monthlyRate;
    const principalPaid = Math.min(monthlyPayment - interest, balance);
    balance = Math.max(0, balance - principalPaid);

    schedule.push({
      month,
      payment: monthlyPayment,
      interest,
      principal: principalPaid,
      balance,
    });
  }

  return schedule;
}

export function remainingBalanceAfterYears(
  principal: number,
  annualRatePercent: number,
  years: number,
  elapsedYears: number,
): number {
  if (principal <= 0) return 0;
  const schedule = buildAmortizationSchedule(principal, annualRatePercent, years);
  const monthIndex = Math.min(elapsedYears * 12, schedule.length) - 1;
  if (monthIndex < 0) return principal;
  return schedule[monthIndex]?.balance ?? 0;
}

export function annualMortgageSchedule(
  principal: number,
  annualRatePercent: number,
  years: number,
): Array<{
  year: number;
  payment: number;
  interest: number;
  principal: number;
  remainingBalance: number;
}> {
  const schedule = buildAmortizationSchedule(principal, annualRatePercent, years);
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
