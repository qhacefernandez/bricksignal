'use client';

import { useEffect } from 'react';
import type { MarketConfig } from '@/config/types';
import { track } from '@/lib/analytics';
import { buildAnalyticsProps } from '@/lib/analyticsContext';
import type { BasicSimulatorInput } from '@/lib/calculations/basic';
import type { CalculationResults } from '@/lib/types';
import { loadMarketPulse } from '@/lib/marketPulse/loadMarketPulse';
import { MARKET_PULSE_DISCLAIMER } from '@/lib/marketPulse/types';
import { canAccessProMetric, maskProValue, shouldShowProPreviewBlur } from '@/lib/proGating';
import MarketPulseNarrativeBlock from './MarketPulseNarrative';
import MarketPulseScore from './MarketPulseScore';
import MarketPulseSources from './MarketPulseSources';

interface Props {
  market: MarketConfig;
  basic: BasicSimulatorInput;
  results: CalculationResults;
  proUnlocked: boolean;
  vacancyPercent?: number;
  defaultVacancyPercent?: number;
}

export default function MarketPulsePro({
  market,
  basic,
  results,
  proUnlocked,
  vacancyPercent,
  defaultVacancyPercent,
}: Props) {
  const unlocked = canAccessProMetric(proUnlocked, 'marketPulse');
  const scenario = {
    monthlyCashflow: results.monthlyCashflow,
    breakEvenRent: results.breakEvenRent,
    estimatedMonthlyRent: basic.monthlyRent,
    netYield: results.netYield,
    vacancyPercent,
    defaultVacancyPercent,
  };
  const pulse = loadMarketPulse(market.slug, scenario, basic.region);

  useEffect(() => {
    if (unlocked && pulse) {
      track('market_pulse_pro_viewed', buildAnalyticsProps(market.slug, basic, {
        grossYield: results.grossYield,
        netYield: results.netYield,
        monthlyMortgagePayment: 0,
        initialInvestment: results.initialInvestment,
        monthlyCashflow: results.monthlyCashflow,
        viability: results.viability,
        viabilityLabel: results.viabilityLabel,
        viabilityReason: results.viabilityReason,
      }));
    } else if (!unlocked) {
      track('market_pulse_locked_viewed', buildAnalyticsProps(market.slug, basic, {
        grossYield: results.grossYield,
        netYield: results.netYield,
        monthlyMortgagePayment: 0,
        initialInvestment: results.initialInvestment,
        monthlyCashflow: results.monthlyCashflow,
        viability: results.viability,
        viabilityLabel: results.viabilityLabel,
        viabilityReason: results.viabilityReason,
      }));
    }
  }, [unlocked, market.slug, pulse, basic, results]);

  if (!pulse) return null;

  const blur = shouldShowProPreviewBlur() && !unlocked;

  return (
    <section className={`rounded-xl border border-slate-200 bg-white p-5 ${blur ? 'relative overflow-hidden' : ''}`}>
      <h3 className="text-lg font-semibold text-slate-900">Market Pulse PRO</h3>
      <div className={blur ? 'pointer-events-none select-none blur-sm' : ''}>
        <div className="mt-4">
          <MarketPulseScore
            score={pulse.score}
            direction={pulse.direction}
            confidence={pulse.confidence}
            lastUpdatedLabel={pulse.lastUpdatedLabel}
          />
        </div>
        <div className="mt-4 grid gap-4 text-sm sm:grid-cols-2">
          {pulse.metrics.priceTrendYoY != null && (
            <p>Precio vivienda YoY: {maskProValue(unlocked, `${pulse.metrics.priceTrendYoY}%`)}</p>
          )}
          {pulse.metrics.rentTrendYoY != null && (
            <p>Renta YoY: {maskProValue(unlocked, `${pulse.metrics.rentTrendYoY}%`)}</p>
          )}
          {pulse.metrics.mortgageRate != null && (
            <p>Tipo hipoteca ref.: {maskProValue(unlocked, `${pulse.metrics.mortgageRate}%`)}</p>
          )}
        </div>
        <div className="mt-4">
          <MarketPulseNarrativeBlock narrative={pulse.narrative} geographyName={pulse.geographyName} />
        </div>
        {unlocked && (
          <div className="mt-4">
            <MarketPulseSources sources={pulse.sources} />
          </div>
        )}
      </div>
      {blur && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/75">
          <p className="flex items-center gap-2 px-4 text-center text-sm font-medium text-slate-700">
            <span aria-hidden>🔒</span> Desbloquea PRO para ver tendencias de mercado
          </p>
        </div>
      )}
      <p className="mt-4 text-xs text-slate-500">{pulse.disclaimer || MARKET_PULSE_DISCLAIMER}</p>
    </section>
  );
}
