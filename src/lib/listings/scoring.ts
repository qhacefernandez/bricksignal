import {
  computeBreakEvenRent,
  computeCashOnCash,
  computeCashflowAfterTax,
  computeDSCR,
  computeGrossYield,
  computeInitialInvestment,
  computeNetYield,
} from '../calculations';
import { listingToSimulatorInput } from './simulatorBridge';
import {
  investorCriteriaSchema,
  type InvestorCriteria,
  type Listing,
  type OpportunityScore,
  type RiskLevel,
  type ScoredOpportunity,
} from './types';

function clamp(value: number, min = 0, max = 100): number {
  return Math.min(max, Math.max(min, value));
}

function scoreCashflow(monthly: number, min: number): number {
  if (monthly >= min && monthly > 0) return clamp(70 + (monthly - min) * 0.5, 70, 100);
  if (monthly > 0) return clamp(40 + monthly, 40, 69);
  if (monthly >= -100) return clamp(20 + (monthly + 100) * 0.2, 10, 30);
  return clamp(10 + monthly * 0.05, 0, 10);
}

function scoreNetYield(net: number, min: number): number {
  if (net >= min) return clamp(60 + (net - min) * 8, 60, 100);
  return clamp((net / Math.max(min, 0.1)) * 50, 0, 59);
}

function scoreDscr(dscr: number, min: number): number {
  if (!Number.isFinite(dscr)) return 100;
  if (dscr >= 1.25) return 100;
  if (dscr >= min) return clamp(50 + (dscr - min) * 40, 50, 99);
  return clamp(dscr * 40, 0, 49);
}

function scoreAffordability(initialInvestment: number, availableCash: number): number {
  if (availableCash <= 0) return initialInvestment <= 0 ? 100 : 0;
  const ratio = initialInvestment / availableCash;
  if (ratio <= 0.85) return 100;
  if (ratio <= 1) return clamp(100 - (ratio - 0.85) * 200, 70, 99);
  if (ratio <= 1.2) return clamp(50 - (ratio - 1) * 150, 20, 69);
  return clamp(20 - (ratio - 1.2) * 50, 0, 19);
}

function scoreRentSafety(monthlyRent: number, breakEven: number): number {
  if (breakEven <= 0) return 100;
  const margin = (monthlyRent - breakEven) / breakEven;
  if (margin >= 0.15) return 100;
  if (margin >= 0) return clamp(60 + margin * 266, 60, 99);
  return clamp(60 + margin * 120, 0, 59);
}

function scoreRisk(listing: Listing, monthlyCashflow: number, dscr: number): number {
  let risk = 100;
  if (listing.condition === 'needs_renovation' || listing.estimatedRenovationCost > 15_000) {
    risk -= 25;
  }
  if (listing.estimatedRenovationCost > 25_000) risk -= 15;
  if (!listing.hasElevator && (listing.floor ?? 0) > 3) risk -= 10;
  if (listing.condition === 'unknown') risk -= 20;
  if (monthlyCashflow < 0) risk -= 20;
  if (dscr < 1) risk -= 25;
  if (dscr < 1.1 && dscr >= 1) risk -= 10;
  return clamp(risk);
}

function deriveRiskLevel(score: number, dscr: number, monthlyCashflow: number): RiskLevel {
  if (score >= 70 && dscr >= 1.15 && monthlyCashflow > 0) return 'low';
  if (score >= 45 && dscr >= 1) return 'medium';
  return 'high';
}

function buildReasons(
  listing: Listing,
  criteria: InvestorCriteria,
  metrics: {
    grossYield: number;
    netYield: number;
    monthlyCashflow: number;
    dscr: number;
    breakEvenRent: number;
    initialInvestment: number;
  },
): string[] {
  const reasons: string[] = [];

  if (metrics.netYield >= criteria.minNetYield) {
    reasons.push('Supera la rentabilidad neta mínima');
  } else {
    reasons.push('Por debajo de la rentabilidad neta mínima');
  }

  if (metrics.monthlyCashflow >= criteria.minMonthlyCashflow && metrics.monthlyCashflow > 0) {
    reasons.push('Cashflow positivo con tus hipótesis');
  } else if (metrics.monthlyCashflow < 0) {
    reasons.push('Cashflow negativo con las hipótesis actuales');
  }

  if (metrics.dscr < criteria.minDscr || metrics.dscr < 1) {
    reasons.push('DSCR bajo: la deuda deja poco margen');
  } else if (metrics.dscr >= 1.25) {
    reasons.push('Buena cobertura de deuda (DSCR ≥ 1,25)');
  }

  const rentMargin = listing.estimatedMonthlyRent - metrics.breakEvenRent;
  if (rentMargin < 0) {
    reasons.push('Depende de una renta estimada superior al mercado');
  } else if (rentMargin < 50) {
    reasons.push('Margen estrecho entre renta estimada y break-even');
  }

  if (listing.estimatedRenovationCost > criteria.maxRenovationCost * 0.7) {
    reasons.push('Reforma estimada alta');
  }

  if (metrics.initialInvestment > criteria.availableCash) {
    reasons.push('Inversión inicial superior al cash disponible');
  }

  return reasons;
}

export function scoreListing(listing: Listing, criteria: InvestorCriteria): OpportunityScore {
  const input = listingToSimulatorInput(listing, criteria);

  const grossYield = computeGrossYield(input);
  const netYield = computeNetYield(input);
  const annualCashflow = computeCashflowAfterTax(input);
  const monthlyCashflow = annualCashflow / 12;
  const cashOnCash = computeCashOnCash(input);
  const dscr = computeDSCR(input);
  const initialInvestment = computeInitialInvestment(input);
  const breakEvenRent = computeBreakEvenRent(input);

  const subScores = {
    cashflow: scoreCashflow(monthlyCashflow, criteria.minMonthlyCashflow),
    netYield: scoreNetYield(netYield, criteria.minNetYield),
    dscr: scoreDscr(dscr, criteria.minDscr),
    affordability: scoreAffordability(initialInvestment, criteria.availableCash),
    rentSafety: scoreRentSafety(listing.estimatedMonthlyRent, breakEvenRent),
    risk: scoreRisk(listing, monthlyCashflow, dscr),
  };

  const score = Math.round(
    subScores.cashflow * 0.3 +
      subScores.netYield * 0.2 +
      subScores.dscr * 0.15 +
      subScores.affordability * 0.15 +
      subScores.rentSafety * 0.1 +
      subScores.risk * 0.1,
  );

  const riskLevel = deriveRiskLevel(score, dscr, monthlyCashflow);
  const reasons = buildReasons(listing, criteria, {
    grossYield,
    netYield,
    monthlyCashflow,
    dscr,
    breakEvenRent,
    initialInvestment,
  });

  const assumptions: Record<string, string> = {
    'Fuente de datos': listing.source === 'mock' ? 'Datos de ejemplo (demo)' : listing.source,
    'ITP estimado': '6 % (editable en simulador)',
    'Vacancia': `${(criteria.vacancyRate * 100).toFixed(1)} %`,
    'LTV hipoteca': `${(criteria.mortgageLtv * 100).toFixed(0)} %`,
    'Estrategia': criteria.strategy,
    'Renta estimada': `${listing.estimatedMonthlyRent} €/mes`,
  };

  return {
    listingId: listing.id,
    grossYield,
    netYield,
    monthlyCashflow,
    annualCashflow,
    cashOnCash,
    dscr,
    initialInvestment,
    breakEvenRent,
    score: clamp(score),
    riskLevel,
    reasons,
    assumptions,
  };
}

export function scoreListings(
  listings: Listing[],
  criteria: InvestorCriteria,
): ScoredOpportunity[] {
  return listings
    .map((listing) => ({
      listing,
      score: scoreListing(listing, criteria),
    }))
    .sort((a, b) => b.score.score - a.score.score);
}

export function validateInvestorCriteria(
  criteria: unknown,
): { success: true; data: InvestorCriteria } | { success: false; error: string } {
  const result = investorCriteriaSchema.safeParse(criteria);
  if (!result.success) {
    return { success: false, error: result.error.issues[0]?.message ?? 'Criterios inválidos' };
  }
  return { success: true, data: result.data };
}
