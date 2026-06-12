import type { MarketConfig } from '@/config/types';
import { formatCurrencyForMarket } from '@/lib/currency';
import { t } from '@/i18n/messages';
import type { CalculationResults } from '@/lib/types';
import { viabilityBg, viabilityColor, viabilityDot } from '@/lib/format';

interface Props {
  market: MarketConfig;
  results: CalculationResults;
}

export default function MarketResultsSummary({ market, results }: Props) {
  const msg = (key: Parameters<typeof t>[1]) => t(market.language, key);
  const fmt = (v: number, precise = false) => formatCurrencyForMarket(v, market, precise);
  const fmtPct = (v: number) =>
    new Intl.NumberFormat(market.locale, { style: 'percent', minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(v / 100);

  const metrics = [
    { label: msg('metrics.grossYield'), value: fmtPct(results.grossYield) },
    { label: msg('metrics.netYield'), value: fmtPct(results.netYield) },
    { label: msg('metrics.monthlyCashflow'), value: fmt(results.monthlyCashflow, true) },
    { label: msg('metrics.initialInvestment'), value: fmt(results.initialInvestment) },
  ];

  return (
    <div className={`rounded-xl border bg-white p-5 shadow-sm lg:sticky lg:top-4 ${viabilityBg(results.viability)}`}>
      <div className="mb-4 flex items-center gap-2">
        <span className={`h-3 w-3 rounded-full ${viabilityDot(results.viability)}`} />
        <div>
          <p className={`text-sm font-semibold uppercase ${viabilityColor(results.viability)}`}>{results.viabilityLabel}</p>
          <p className="text-xs text-slate-600">{results.viabilityReason}</p>
        </div>
      </div>
      <dl className="grid gap-3">
        {metrics.map((m) => (
          <div key={m.label} className="rounded-lg bg-white/70 px-3 py-2">
            <dt className="text-sm text-slate-600">{m.label}</dt>
            <dd className="text-xl font-bold text-slate-900">{m.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
