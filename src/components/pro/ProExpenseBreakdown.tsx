import type { MarketConfig } from '@/config/types';
import { formatCurrencyForMarket } from '@/lib/currency';
import type { CalculationResults, SimulatorInput } from '@/lib/types';

interface Props {
  market: MarketConfig;
  input: SimulatorInput;
  results: CalculationResults;
}

export default function ProExpenseBreakdown({ market, input, results }: Props) {
  const fmt = (v: number) => formatCurrencyForMarket(v, market);
  const mgmt = input.monthlyRent * 12 * (input.managementPercent / 100);
  const rows = [
    ['IBI / impuesto anual', input.ibi],
    ['Comunidad', input.communityFees],
    ['Seguro', input.homeInsurance],
    ['Mantenimiento', input.maintenance],
    ['Otros gastos', input.otherExpenses],
    ['Gestión', mgmt],
  ] as const;

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5">
      <h4 className="mb-3 font-semibold text-slate-900">Desglose de gastos operativos</h4>
      <dl className="grid gap-2 text-sm sm:grid-cols-2">
        {rows.map(([label, value]) => (
          <div key={label} className="flex justify-between rounded-lg bg-slate-50 px-3 py-2">
            <dt className="text-slate-600">{label}</dt>
            <dd className="font-medium text-slate-900">{fmt(value)}/año</dd>
          </div>
        ))}
        <div className="flex justify-between rounded-lg bg-brand-50 px-3 py-2 sm:col-span-2">
          <dt className="font-medium text-slate-800">NOI anual</dt>
          <dd className="font-bold text-brand-700">{fmt(results.noi)}/año</dd>
        </div>
      </dl>
    </section>
  );
}
