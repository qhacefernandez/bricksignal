import type {
  InvestmentScenarioContext,
  MarketPulseConfidence,
  MarketPulseLevel,
  MarketPulseMetrics,
  MarketPulseReport,
} from './types';

function levelPenalty(level?: MarketPulseLevel): number {
  switch (level) {
    case 'very_high': return 25;
    case 'high': return 15;
    case 'medium': return 5;
    default: return 0;
  }
}

function clamp(n: number, min = 0, max = 100): number {
  return Math.min(max, Math.max(min, n));
}

export function calculateMarketPulseConfidence(sources: { date: string }[]): MarketPulseConfidence {
  const recent = sources.filter((s) => {
    const d = new Date(s.date);
    const monthsAgo = (Date.now() - d.getTime()) / (1000 * 60 * 60 * 24 * 30);
    return monthsAgo <= 6;
  });
  if (recent.length >= 4) return 'high';
  if (recent.length >= 2) return 'medium';
  return 'low';
}

export function calculateMarketPulseScore(
  report: Pick<MarketPulseReport, 'metrics' | 'confidence'>,
  scenario: InvestmentScenarioContext,
): number {
  const m = report.metrics;
  let priceScore = 50;
  const pYoY = m.priceTrendYoY ?? 0;
  if (pYoY > 12) priceScore = 30;
  else if (pYoY > 6) priceScore = 40;
  else if (pYoY > 0) priceScore = 55;
  else priceScore = 65;

  let rentScore = 50;
  const rYoY = m.rentTrendYoY ?? 0;
  if (rYoY > 6) rentScore = 75;
  else if (rYoY > 2) rentScore = 65;
  else if (rYoY >= 0) rentScore = 55;
  else rentScore = 40;

  let financeScore = 55;
  if (m.mortgageRateTrend === 'down') financeScore = 70;
  else if (m.mortgageRateTrend === 'up') financeScore = 35;

  let liquidityScore = 50;
  const vol = m.transactionVolumeYoY ?? 0;
  if (vol > 5) liquidityScore = 65;
  else if (vol < -5) liquidityScore = 35;

  const mos =
    scenario.breakEvenRent > 0
      ? ((scenario.estimatedMonthlyRent - scenario.breakEvenRent) / scenario.breakEvenRent) * 100
      : 20;
  let marginScore = clamp(40 + mos, 0, 100);

  let riskScore = 100;
  riskScore -= levelPenalty(m.affordabilityPressure);
  riskScore -= levelPenalty(m.regulatoryRisk);
  if (report.confidence === 'low') riskScore -= 15;
  if (report.confidence === 'medium') riskScore -= 5;

  let score =
    priceScore * 0.2 +
    rentScore * 0.25 +
    financeScore * 0.15 +
    liquidityScore * 0.15 +
    marginScore * 0.15 +
    riskScore * 0.1;

  if (scenario.monthlyCashflow < 0) score -= 15;
  if (mos < 10) score -= 10;
  if (m.mortgageRateTrend === 'up') score -= 5;

  const vacancy = scenario.vacancyPercent ?? scenario.defaultVacancyPercent ?? 5;
  const defaultVac = scenario.defaultVacancyPercent ?? 5;
  if (vacancy > defaultVac + 5 && scenario.monthlyCashflow > 0) score += 5;
  if (vacancy <= 3 && mos < 15) score -= 5;
  if (vacancy >= 12 && scenario.monthlyCashflow < 0) score -= 8;

  return Math.round(clamp(score));
}

export function deriveDirection(metrics: MarketPulseMetrics, score: number): MarketPulseReport['direction'] {
  if (score >= 70 && (metrics.rentTrendYoY ?? 0) > 4) return 'warming';
  if (score >= 80) return 'hot';
  if (score < 40 || (metrics.priceTrendYoY ?? 0) > 10) return 'cooling';
  return 'stable';
}
