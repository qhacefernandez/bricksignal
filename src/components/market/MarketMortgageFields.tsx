'use client';

import type { MarketConfig } from '@/config/types';
import type { SimulatorInput } from '@/lib/types';

interface Props {
  market: MarketConfig;
  input: SimulatorInput;
  onChange: (patch: Partial<SimulatorInput>) => void;
}

export default function MarketMortgageFields({ market, input, onChange }: Props) {
  const m = market.defaultMortgage;

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5">
      <h2 className="mb-1 text-lg font-semibold text-slate-900">{m.mortgageTypeLabel}</h2>
      {m.notes.map((n) => (
        <p key={n} className="text-xs text-slate-500">{n}</p>
      ))}
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-slate-700">Use mortgage</span>
          <select
            value={input.useMortgage ? 'yes' : 'no'}
            onChange={(e) => onChange({ useMortgage: e.target.value === 'yes' })}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          >
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </label>
        {input.useMortgage && (
          <>
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-slate-700">Down payment</span>
              <input type="number" value={input.downPayment} onChange={(e) => onChange({ downPayment: +e.target.value })} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-slate-700">Financed amount</span>
              <input type="number" value={input.financedAmount} onChange={(e) => onChange({ financedAmount: +e.target.value })} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-slate-700">Interest rate (%)</span>
              <input type="number" step="0.1" value={input.interestRate} onChange={(e) => onChange({ interestRate: +e.target.value })} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-slate-700">Term (years)</span>
              <input type="number" value={input.mortgageYears} onChange={(e) => onChange({ mortgageYears: +e.target.value })} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
            </label>
          </>
        )}
      </div>
    </section>
  );
}
