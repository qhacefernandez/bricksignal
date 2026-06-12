import type { MarketConfig } from '@/config/types';
import { formatCurrencyForMarket } from '@/lib/currency';
import { formatPercent } from '@/lib/format';
import type { CalculationResults, SimulatorInput } from '@/lib/types';

interface Props {
  market: MarketConfig;
  input: SimulatorInput;
  results: CalculationResults;
}

export default function ProMortgageAnalysis({ market, input, results }: Props) {
  const fmt = (v: number) => formatCurrencyForMarket(v, market);

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5">
      <h4 className="mb-3 font-semibold text-slate-900">Hipoteca avanzada</h4>
      <dl className="grid gap-2 text-sm sm:grid-cols-2">
        <div className="flex justify-between rounded-lg bg-slate-50 px-3 py-2">
          <dt className="text-slate-600">Importe financiado</dt>
          <dd className="font-medium">{fmt(input.financedAmount)}</dd>
        </div>
        <div className="flex justify-between rounded-lg bg-slate-50 px-3 py-2">
          <dt className="text-slate-600">Cuota mensual</dt>
          <dd className="font-medium">{fmt(results.monthlyMortgagePayment)}</dd>
        </div>
        <div className="flex justify-between rounded-lg bg-slate-50 px-3 py-2">
          <dt className="text-slate-600">Servicio deuda anual</dt>
          <dd className="font-medium">{fmt(results.debtServiceAnnual)}</dd>
        </div>
        <div className="flex justify-between rounded-lg bg-slate-50 px-3 py-2">
          <dt className="text-slate-600">Tipo / plazo</dt>
          <dd className="font-medium">{formatPercent(input.interestRate)} · {input.mortgageYears}a</dd>
        </div>
      </dl>
    </section>
  );
}
