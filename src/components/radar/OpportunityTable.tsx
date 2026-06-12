'use client';

import type { MarketConfig } from '@/config/types';
import { formatCurrencyForMarket } from '@/lib/currency';
import { formatPercent } from '@/lib/format';
import { pushListingToSimulator } from '@/lib/listings/simulatorBridge';
import type { InvestorCriteria, ScoredOpportunity } from '@/lib/listings/types';
import OpportunityScoreBadge from './OpportunityScoreBadge';

interface OpportunityTableProps {
  opportunities: ScoredOpportunity[];
  criteria: InvestorCriteria;
  onSelect: (op: ScoredOpportunity) => void;
  market?: MarketConfig;
}

export default function OpportunityTable({ opportunities, criteria, onSelect, market }: OpportunityTableProps) {
  const fmt = (v: number, p = false) => market ? formatCurrencyForMarket(v, market, p) : `${v}`;
  if (opportunities.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center text-slate-600">
        No hay oportunidades que encajen con tus criterios. Prueba ampliando presupuesto o bajando umbrales.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
      <table className="min-w-full text-left text-sm">
        <thead className="border-b border-slate-200 bg-slate-50 text-slate-600">
          <tr>
            <th className="px-4 py-3 font-medium">Inmueble</th>
            <th className="px-4 py-3 font-medium">Precio</th>
            <th className="px-4 py-3 font-medium">Renta</th>
            <th className="px-4 py-3 font-medium">Rent. neta</th>
            <th className="px-4 py-3 font-medium">Cashflow</th>
            <th className="px-4 py-3 font-medium">DSCR</th>
            <th className="px-4 py-3 font-medium">Score</th>
            <th className="px-4 py-3 font-medium" />
          </tr>
        </thead>
        <tbody>
          {opportunities.map((op) => (
            <tr key={op.listing.id} className="border-b border-slate-100 hover:bg-slate-50">
              <td className="px-4 py-3">
                <p className="font-medium text-slate-900">{op.listing.title}</p>
                <p className="text-xs text-slate-500">
                  {op.listing.city} · {op.listing.district} · {op.listing.sizeM2} m²
                </p>
              </td>
              <td className="px-4 py-3">{fmt(op.listing.price)}</td>
              <td className="px-4 py-3">{fmt(op.listing.estimatedMonthlyRent)}/mo</td>
              <td className="px-4 py-3">{formatPercent(op.score.netYield)}</td>
              <td className="px-4 py-3">{fmt(op.score.monthlyCashflow, true)}</td>
              <td className="px-4 py-3">
                {op.score.dscr === Infinity ? '∞' : op.score.dscr.toFixed(2)}
              </td>
              <td className="px-4 py-3">
                <OpportunityScoreBadge score={op.score.score} riskLevel={op.score.riskLevel} />
              </td>
              <td className="px-4 py-3">
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => onSelect(op)}
                    className="text-brand-600 hover:underline"
                  >
                    Detalle
                  </button>
                  <button
                    type="button"
                    onClick={() => pushListingToSimulator(op.listing, criteria, market?.slug ?? 'es')}
                    className="text-brand-600 hover:underline"
                  >
                    Simulador
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
