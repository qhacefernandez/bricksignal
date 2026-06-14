'use client';

import { useEffect, useRef, useState } from 'react';
import type { MarketConfig } from '@/config/types';
import type { BasicCalculationResults, BasicSimulatorInput } from '@/lib/calculations/basic';
import { formatCurrencyForMarketConfig } from '@/lib/format/currency';
import { formatPercentValue } from '@/lib/format/percent';
import { formatPriceLabel } from '@/lib/currency';
import { t } from '@/i18n/messages';
import { ENABLE_PRO_REPORT } from '@/config/featureFlags';
import { saveBasicScenario, saveScenario, startCheckout } from '@/lib/marketStorage';
import { runFullProAnalysis } from '@/lib/calculations/pro';
import { track } from '@/lib/analytics';
import { maskProValue } from '@/lib/proGating';
import BasicViabilityBadge from './BasicViabilityBadge';

interface Props {
  market: MarketConfig;
  results: BasicCalculationResults;
  microcopy?: string | null;
  proUnlocked?: boolean;
  basic?: BasicSimulatorInput;
  lockedVacancyPercent?: number;
  started?: boolean;
}

function viabilityBgClass(status: BasicCalculationResults['viability']): string {
  switch (status) {
    case 'green': return 'bg-viability-positive';
    case 'yellow': return 'bg-viability-warning';
    case 'red': return 'bg-viability-negative';
    default: return 'bg-white';
  }
}

function CashflowBar({ cashflow, maxAbs }: { cashflow: number; maxAbs: number }) {
  const span = maxAbs * 2 || 1;
  const pct = Math.min(100, Math.max(0, ((cashflow + maxAbs) / span) * 100));
  const isPositive = cashflow >= 0;
  return (
    <div className="mt-2" aria-hidden>
      <div className="relative h-2 rounded-full bg-slate-200">
        <div className="absolute top-0 bottom-0 w-0.5 bg-slate-400" style={{ left: '50%' }} />
        <div
          className={`absolute top-0 h-2 rounded-full ${isPositive ? 'bg-signal-green' : 'bg-signal-red'}`}
          style={{
            left: isPositive ? '50%' : `${pct}%`,
            width: isPositive ? `${pct - 50}%` : `${50 - pct}%`,
          }}
        />
      </div>
      <div className="mt-1 flex justify-between text-[10px] text-slate-400">
        <span>−</span>
        <span>0</span>
        <span>+</span>
      </div>
    </div>
  );
}

export default function BasicResultsSummary({
  market,
  results,
  microcopy,
  proUnlocked = false,
  basic,
  lockedVacancyPercent = 0,
  started = false,
}: Props) {
  const msg = (key: Parameters<typeof t>[1]) => t(market.language, key);
  const fmt = (v: number, precise = false) => formatCurrencyForMarketConfig(v, market, precise);
  const liveRef = useRef<HTMLDivElement>(null);
  const maxAbs = Math.max(500, Math.abs(results.monthlyCashflow) * 1.5);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const priceLabel = formatPriceLabel(
    market.pricing.reportPrice.amount,
    market.pricing.reportPrice.currency,
    market.locale,
  );

  useEffect(() => {
    if (liveRef.current) {
      liveRef.current.textContent = `${msg('metrics.monthlyCashflow')}: ${fmt(results.monthlyCashflow, true)}`;
    }
  }, [results.monthlyCashflow, market, msg, fmt]);

  const handleUnlock = async () => {
    if (!basic || checkoutLoading) return;
    setCheckoutLoading(true);
    track('pro_upgrade_clicked', { marketSlug: market.slug, source: 'viability_panel' });
    try {
      saveBasicScenario(market.slug, basic);
      const { input } = runFullProAnalysis({ ...basic, marketSlug: market.slug });
      saveScenario(market.slug, input);
      await startCheckout(market.slug, 'pro_report');
    } catch {
      setCheckoutLoading(false);
    }
  };

  const metrics = [
    { label: msg('metrics.monthlyCashflow'), value: fmt(results.monthlyCashflow, true), highlight: true, locked: false },
    {
      label: msg('metrics.netYield'),
      value: maskProValue(proUnlocked, formatPercentValue(results.netYield, market.locale)),
      locked: !proUnlocked,
      proOnly: true,
    },
    { label: 'Cuota hipotecaria', value: fmt(results.monthlyMortgagePayment), locked: false },
    { label: msg('metrics.initialInvestment'), value: fmt(results.initialInvestment), locked: false },
    { label: msg('metrics.grossYield'), value: formatPercentValue(results.grossYield, market.locale), locked: false },
  ];

  if (!started) {
    return (
      <div
        className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-5 lg:sticky lg:top-4"
        aria-live="polite"
      >
        <p className="text-sm font-medium text-slate-700">{msg('simulator.resultsPlaceholderTitle')}</p>
        <p className="mt-2 text-sm text-slate-500">{msg('simulator.resultsPlaceholder')}</p>
      </div>
    );
  }

  return (
    <div
      className={`rounded-xl border border-slate-200 p-5 shadow-sm lg:sticky lg:top-4 ${viabilityBgClass(results.viability)}`}
      aria-live="polite"
      aria-atomic="false"
    >
      <div ref={liveRef} className="sr-only" />
      <BasicViabilityBadge
        status={results.viability}
        label={results.viabilityLabel}
        proHint={!proUnlocked ? msg('simulator.viabilityProHint') : undefined}
      />

      <dl className="mt-4 grid gap-3">
        {metrics.map((m) => (
          <div
            key={m.label}
            className={`relative rounded-lg px-3 py-2 ${
              m.highlight ? 'bg-white/90 ring-1 ring-brand-200' : m.locked ? 'bg-white/70 ring-1 ring-dashed ring-brand-200' : 'bg-white/70'
            }`}
          >
            <dt className="flex items-center gap-1.5 text-sm text-slate-600">
              {m.label}
              {m.proOnly && !proUnlocked && (
                <span className="rounded bg-brand-100 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-brand-700">
                  PRO
                </span>
              )}
            </dt>
            <dd className={`text-xl font-bold text-slate-900 ${m.locked ? 'tracking-widest text-slate-400' : ''}`}>
              {m.value}
            </dd>
            {m.highlight && <CashflowBar cashflow={results.monthlyCashflow} maxAbs={maxAbs} />}
          </div>
        ))}
      </dl>

      {ENABLE_PRO_REPORT && !proUnlocked && basic && (
        <div className="mt-4 rounded-lg border border-brand-200 bg-white/90 p-3">
          <p className="text-xs text-slate-600">
            {msg('simulator.unlockFull')}: TIR, sensibilidad, deducción fiscal por intereses, PDF y Market Pulse.
          </p>
          <button
            type="button"
            onClick={handleUnlock}
            disabled={checkoutLoading}
            className="mt-2 w-full rounded-lg bg-brand-600 px-3 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-60"
          >
            {checkoutLoading ? 'Redirigiendo…' : `${msg('simulator.unlockFull')} — ${priceLabel}`}
          </button>
        </div>
      )}

      {proUnlocked && (
        <p className="mt-4 rounded-lg bg-green-50 px-3 py-2 text-xs font-medium text-green-800">
          ✓ Informe PRO activo para este escenario
        </p>
      )}

      {microcopy && (
        <p className="mt-3 rounded-lg bg-brand-50 px-3 py-2 text-xs text-brand-800">{microcopy}</p>
      )}

      <p className="mt-4 text-xs text-slate-500">
        {msg('simulator.quickEstimateDisclaimer')}
      </p>
    </div>
  );
}
