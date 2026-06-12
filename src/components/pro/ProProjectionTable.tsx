import type { MarketConfig } from '@/config/types';
import { calculateProjectionAtHorizon } from '@/lib/calculations';
import { formatCurrencyForMarket } from '@/lib/currency';
import { formatPercent } from '@/lib/format';
import type { SimulatorInput } from '@/lib/types';

interface Props {
  market: MarketConfig;
  input: SimulatorInput;
}

export default function ProProjectionTable({ market, input }: Props) {
  const fmt = (v: number) => formatCurrencyForMarket(v, market);
  const horizons = ([10, 20] as const).map((y) => ({ years: y, data: calculateProjectionAtHorizon(input, y) }));

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5">
      <h4 className="mb-3 font-semibold text-slate-900">Proyección a 10 y 20 años</h4>
      <div className="grid gap-4 md:grid-cols-2">
        {horizons.map(({ years, data }) => (
          <div key={years} className="rounded-lg bg-slate-50 p-4 text-sm">
            <p className="font-medium">{years} años</p>
            <ul className="mt-2 space-y-1 text-slate-600">
              <li>Cashflow acumulado: {fmt(data.cumulativeCashflow)}</li>
              <li>Valor inmueble: {fmt(data.propertyValue)}</li>
              <li>Patrimonio neto: {fmt(data.equity)}</li>
              <li>TIR: {formatPercent(data.irr)}</li>
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
