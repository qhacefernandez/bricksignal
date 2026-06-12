'use client';

import { useEffect, useMemo } from 'react';
import type { MarketConfig } from '@/config/types';
import { track } from '@/lib/analytics';
import { buildAnalyticsProps } from '@/lib/analyticsContext';
import type { BasicCalculationResults, BasicSimulatorInput } from '@/lib/calculations/basic';
import { isVacancySensitive } from '@/lib/calculations';
import { calculateProAnalysis } from '@/lib/calculations/pro';
import { loadMarketPulse } from '@/lib/marketPulse/loadMarketPulse';
import { formatCurrencyForMarketConfig } from '@/lib/format/currency';
import { formatPercent } from '@/lib/format';
import { getProMetricsCopy, PRO_PREVIEW_METRIC_KEYS } from '@/i18n/proMetricsCopy';
import { maskProValue, shouldShowProPreviewBlur } from '@/lib/proGating';
import type { InvestmentScenarioState } from '@/hooks/useInvestmentScenario';
import { MetricLabel } from '../Tooltip';
import MarketPulsePro from './MarketPulsePro';
import ProAssumptionsPanel from './ProAssumptionsPanel';
import ProChecklist from './ProChecklist';
import ProExitScenario from './ProExitScenario';
import ProExpenseBreakdown from './ProExpenseBreakdown';
import ProMortgageAnalysis from './ProMortgageAnalysis';
import ProPdfReport from './ProPdfReport';
import ProProjectionTable from './ProProjectionTable';
import ProSensitivityAnalysis from './ProSensitivityAnalysis';
import CashflowChart from '../CashflowChart';

interface Props {
  market: MarketConfig;
  basic: BasicSimulatorInput;
  basicResults: BasicCalculationResults;
  proUnlocked: boolean;
  scenario: InvestmentScenarioState;
}

export default function ProInvestmentAnalysis({
  market,
  basic,
  basicResults,
  proUnlocked,
  scenario,
}: Props) {
  const { proInput, updatePro, ranges } = scenario;
  const results = useMemo(() => calculateProAnalysis(proInput), [proInput]);
  const fmt = (v: number, precise = false) => formatCurrencyForMarketConfig(v, market, precise);
  const blur = shouldShowProPreviewBlur() && !proUnlocked;
  const metricsCopy = getProMetricsCopy(market.language);

  const pulseScenario = {
    monthlyCashflow: results.monthlyCashflow,
    breakEvenRent: results.breakEvenRent,
    estimatedMonthlyRent: basic.monthlyRent,
    netYield: results.netYield,
    vacancyPercent: proInput.vacancyPercent ?? scenario.lockedVacancyPercent,
    defaultVacancyPercent: scenario.lockedVacancyPercent,
    vacancySensitive: isVacancySensitive(proInput),
  };
  const pulse = loadMarketPulse(market.slug, pulseScenario, basic.region);

  useEffect(() => {
    if (!proUnlocked) {
      track('pro_locked_metric_viewed', buildAnalyticsProps(market.slug, basic, basicResults));
    }
  }, [proUnlocked, market.slug, basic, basicResults]);

  const advancedMetrics = PRO_PREVIEW_METRIC_KEYS.map((key) => {
    const meta = metricsCopy.metrics[key];
    const values: Record<typeof key, string> = {
      netYield: formatPercent(results.netYield),
      cashOnCash: formatPercent(results.cashOnCash),
      dscr: results.dscr === Infinity ? '∞' : results.dscr.toFixed(2),
      breakEven: `${fmt(results.breakEvenRent)}${metricsCopy.perMonth}`,
      irr: formatPercent(results.irr),
    };
    return { key, label: meta.label, tip: meta.tooltip, value: values[key] };
  });

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-slate-900">
        {proUnlocked ? metricsCopy.unlockedTitle : metricsCopy.previewTitle}
      </h2>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {advancedMetrics.map((m) => {
          const showBlur = blur;
          return (
            <div key={m.key} className="rounded-xl border border-slate-200 bg-white p-4">
              <div className="relative z-10">
                <MetricLabel label={m.label} tooltip={m.tip} />
              </div>
              <div className="relative mt-1 min-h-[2.5rem]">
                <p className={`text-2xl font-bold text-slate-900 ${showBlur ? 'blur-sm select-none' : ''}`}>
                  {maskProValue(!showBlur, m.value)}
                </p>
                {showBlur && (
                  <div
                    className="pointer-events-none absolute inset-0 flex items-center justify-center bg-white/60 text-xs font-medium text-slate-600"
                    aria-hidden
                  >
                    🔒 PRO
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {proUnlocked && (
        <>
          <ProAssumptionsPanel
            market={market}
            input={proInput}
            ranges={ranges}
            onChange={updatePro}
          />

          <section className="rounded-xl border border-slate-200 bg-white p-5">
            <h4 className="mb-3 font-semibold text-slate-900">Desglose de inversión inicial</h4>
            <dl className="grid gap-2 text-sm sm:grid-cols-2">
              <div className="flex justify-between rounded-lg bg-slate-50 px-3 py-2">
                <dt className="text-slate-600">Entrada / equity</dt>
                <dd className="font-medium">{fmt(proInput.downPayment)}</dd>
              </div>
              <div className="flex justify-between rounded-lg bg-slate-50 px-3 py-2">
                <dt className="text-slate-600">Gastos de compra</dt>
                <dd className="font-medium">{fmt(results.totalPurchaseCosts)}</dd>
              </div>
              <div className="flex justify-between rounded-lg bg-slate-50 px-3 py-2 sm:col-span-2">
                <dt className="font-medium text-slate-800">Inversión inicial total</dt>
                <dd className="font-bold text-brand-700">{fmt(results.initialInvestment)}</dd>
              </div>
            </dl>
          </section>

          <ProExpenseBreakdown market={market} input={proInput} results={results} />
          {proInput.useMortgage && <ProMortgageAnalysis market={market} input={proInput} results={results} />}
          <ProProjectionTable market={market} input={proInput} />
          <ProExitScenario market={market} results={results} />

          <section className="rounded-xl border border-slate-200 bg-white p-5">
            <h4 className="mb-3 font-semibold text-slate-900">Cashflows anuales</h4>
            <CashflowChart data={results.annualCashflows} />
          </section>

          <ProChecklist />
        </>
      )}

      <ProSensitivityAnalysis
        input={proInput}
        results={results}
        blurred={blur}
        defaultVacancy={scenario.lockedVacancyPercent}
      />
      <MarketPulsePro
        market={market}
        basic={basic}
        results={results}
        proUnlocked={proUnlocked}
        vacancyPercent={proInput.vacancyPercent ?? scenario.lockedVacancyPercent}
        defaultVacancyPercent={scenario.lockedVacancyPercent}
      />
      <ProPdfReport
        market={market}
        input={proInput}
        results={results}
        proUnlocked={proUnlocked}
        marketPulse={pulse}
        vacancyPercent={proInput.vacancyPercent ?? scenario.lockedVacancyPercent}
      />
    </div>
  );
}
