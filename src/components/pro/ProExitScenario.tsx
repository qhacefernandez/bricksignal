import type { MarketConfig } from '@/config/types';
import { formatCurrencyForMarket } from '@/lib/currency';
import type { CalculationResults } from '@/lib/types';

interface Props {
  market: MarketConfig;
  results: CalculationResults;
}

export default function ProExitScenario({ market, results }: Props) {
  const fmt = (v: number) => formatCurrencyForMarket(v, market);
  const s = results.saleScenario;

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5">
      <h4 className="mb-3 font-semibold text-slate-900">Escenario de venta ({s.horizonYears} años)</h4>
      <div className="grid gap-2 text-sm text-slate-600 sm:grid-cols-2">
        <p>Valor estimado: {fmt(s.propertyValue)}</p>
        <p>Costes de venta: {fmt(s.saleCosts)}</p>
        <p>Deuda pendiente: {fmt(s.remainingDebt)}</p>
        <p>Proceeds netos: {fmt(s.netSaleProceeds)}</p>
      </div>
    </section>
  );
}
