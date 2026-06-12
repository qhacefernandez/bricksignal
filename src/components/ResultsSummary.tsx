import { formatEuro, formatPercent, viabilityBg, viabilityColor, viabilityDot } from '@/lib/format';
import type { CalculationResults } from '@/lib/types';
import { MetricLabel } from './Tooltip';

interface ResultsSummaryProps {
  results: CalculationResults;
  sticky?: boolean;
}

export default function ResultsSummary({ results, sticky = true }: ResultsSummaryProps) {
  const metrics = [
    {
      label: 'Rentabilidad bruta',
      value: formatPercent(results.grossYield),
      tooltip: 'Alquiler anual bruto dividido entre el precio de compra.',
    },
    {
      label: 'Rentabilidad neta',
      value: formatPercent(results.netYield),
      tooltip: 'NOI dividido entre el coste total de adquisición.',
    },
    {
      label: 'Cashflow mensual',
      value: formatEuro(results.monthlyCashflow, true),
      tooltip: 'Lo que queda cada mes tras gastos, hipoteca e impuestos orientativos.',
    },
    {
      label: 'Cuota hipotecaria',
      value: formatEuro(results.monthlyMortgagePayment, true),
      tooltip: 'Cuota mensual con sistema francés.',
    },
    {
      label: 'Inversión inicial',
      value: formatEuro(results.initialInvestment),
      tooltip: 'Entrada + impuestos + gastos de compra + reforma + muebles + reserva.',
    },
  ];

  return (
    <div
      className={`rounded-xl border bg-white p-5 shadow-sm ${sticky ? 'lg:sticky lg:top-4' : ''} ${viabilityBg(results.viability)}`}
    >
      <div className="mb-4 flex items-center gap-2">
        <span className={`h-3 w-3 rounded-full ${viabilityDot(results.viability)}`} />
        <div>
          <p className={`text-sm font-semibold uppercase tracking-wide ${viabilityColor(results.viability)}`}>
            {results.viabilityLabel}
          </p>
          <p className="text-xs text-slate-600">{results.viabilityReason}</p>
        </div>
      </div>

      <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
        {metrics.map((m) => (
          <div key={m.label} className="rounded-lg bg-white/70 px-3 py-2">
            <MetricLabel label={m.label} tooltip={m.tooltip} />
            <dd className="mt-1 text-xl font-bold text-slate-900">{m.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
