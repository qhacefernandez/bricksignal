/**
 * Internal Rate of Return via Newton-Raphson.
 * cashflows[0] should be negative (initial investment).
 */
export function calculateIRR(
  cashflows: number[],
  guess = 0.1,
  maxIterations = 100,
  tolerance = 1e-7,
): number {
  if (cashflows.length < 2) return 0;

  let rate = guess;

  for (let i = 0; i < maxIterations; i++) {
    let npv = 0;
    let derivative = 0;

    for (let t = 0; t < cashflows.length; t++) {
      const factor = Math.pow(1 + rate, t);
      npv += cashflows[t] / factor;
      if (t > 0) {
        derivative -= (t * cashflows[t]) / Math.pow(1 + rate, t + 1);
      }
    }

    if (Math.abs(derivative) < 1e-12) break;

    const nextRate = rate - npv / derivative;
    if (!Number.isFinite(nextRate)) break;
    if (Math.abs(nextRate - rate) < tolerance) return nextRate;
    rate = nextRate;
  }

  return rate;
}

export function buildIRRCashflows(
  initialInvestment: number,
  annualCashflowsAfterTax: number[],
  horizonYears: number,
  saleNetProceeds: number,
): number[] {
  const flows: number[] = [-initialInvestment];

  for (let year = 1; year <= horizonYears; year++) {
    const cf = annualCashflowsAfterTax[year - 1] ?? annualCashflowsAfterTax[annualCashflowsAfterTax.length - 1] ?? 0;
    if (year === horizonYears) {
      flows.push(cf + saleNetProceeds);
    } else {
      flows.push(cf);
    }
  }

  return flows;
}
