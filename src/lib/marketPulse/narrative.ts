import type {
  InvestmentScenarioContext,
  MarketPulseConfidence,
  MarketPulseMetrics,
  MarketPulseNarrative,
  MarketPulseReport,
} from './types';

function marginOfSafety(ctx: InvestmentScenarioContext): number {
  if (ctx.breakEvenRent <= 0) return 100;
  return ((ctx.estimatedMonthlyRent - ctx.breakEvenRent) / ctx.breakEvenRent) * 100;
}

export function generateMarketPulseNarrative(
  metrics: MarketPulseMetrics,
  ctx: InvestmentScenarioContext,
  confidence: MarketPulseConfidence,
): MarketPulseNarrative {
  const positives: string[] = [];
  const risks: string[] = [];
  const watchlist: string[] = [];
  const mos = marginOfSafety(ctx);

  if ((metrics.priceTrendYoY ?? 0) > 8) {
    risks.push('Los precios de compra muestran una tendencia fuerte al alza, lo que puede reducir el margen de entrada.');
  } else if ((metrics.priceTrendYoY ?? 0) > 3) {
    watchlist.push('Precios en subida moderada: vigila el precio de compra negociado.');
  }

  if ((metrics.rentTrendYoY ?? 0) > 6) {
    positives.push('Las rentas muestran presión alcista, lo que puede apoyar la hipótesis de ingresos (sin garantizar ocupación).');
  }

  if (metrics.mortgageRateTrend === 'down') {
    positives.push('El entorno de financiación parece más favorable que en meses anteriores.');
  } else if (metrics.mortgageRateTrend === 'up') {
    risks.push('Las tasas hipotecarias suben, lo que puede comprimir el cashflow.');
  }

  if (ctx.monthlyCashflow < 0) {
    risks.push('El escenario analizado tiene cashflow negativo con las hipótesis actuales.');
  }

  if (mos < 10) {
    risks.push('La operación tiene poco margen de seguridad: pequeñas desviaciones en renta, vacancia o gastos pueden afectar el resultado.');
  } else if (mos >= 15) {
    positives.push('Hay margen razonable entre la renta estimada y el break-even.');
  }

  if (metrics.regulatoryRisk === 'high' || metrics.regulatoryRisk === 'very_high') {
    risks.push('Riesgo regulatorio elevado en el mercado de alquiler.');
    watchlist.push('Revisar normativa local de alquiler y licencias.');
  }

  if (confidence === 'low') {
    watchlist.push('La lectura de mercado tiene confianza limitada por falta de datos recientes o granulares.');
  }

  const vacancy = ctx.vacancyPercent ?? ctx.defaultVacancyPercent;
  if (vacancy != null) {
    if (vacancy <= 3) {
      watchlist.push('La hipótesis de vacancia es exigente. Comprueba demanda real, rotación y tiempo medio de comercialización.');
    }
    if (vacancy >= 10 && ctx.monthlyCashflow > 0) {
      positives.push('La operación se ha probado con una vacancia prudente. Si aun así mantiene cashflow, tiene mayor margen operativo.');
    }
    if (ctx.vacancySensitive) {
      risks.push('La rentabilidad es sensible a periodos sin alquilar.');
    }
  }

  if (positives.length === 0) positives.push('Contexto de mercado mixto: valida supuestos con datos locales.');
  if (risks.length === 0) risks.push('Sin riesgos destacados en los datos disponibles; el resultado depende de tu operación concreta.');
  if (watchlist.length === 0) watchlist.push('Monitorizar tipos, vacancia y costes operativos trimestralmente.');

  const headline =
    metrics.rentTrendYoY && metrics.rentTrendYoY > 4
      ? 'Mercado de alquiler con soporte moderado en rentas'
      : 'Mercado estable con márgenes que dependen de la operación';

  return {
    headline,
    summary: `Lectura orientativa para tu escenario. Margen de seguridad estimado: ${mos.toFixed(0)}%. Confianza: ${confidence}.`,
    positives,
    risks,
    watchlist,
  };
}

export function enrichReportNarrative(
  report: MarketPulseReport,
  ctx: InvestmentScenarioContext,
): MarketPulseReport {
  return {
    ...report,
    narrative: generateMarketPulseNarrative(report.metrics, ctx, report.confidence),
  };
}
