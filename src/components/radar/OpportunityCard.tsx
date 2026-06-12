'use client';

import type { MarketConfig } from '@/config/types';
import { formatCurrencyForMarket } from '@/lib/currency';
import { formatPercent } from '@/lib/format';
import { pushListingToSimulator } from '@/lib/listings/simulatorBridge';
import type { InvestorCriteria, ScoredOpportunity } from '@/lib/listings/types';
import OpportunityScoreBadge from './OpportunityScoreBadge';

interface OpportunityCardProps {
  opportunity: ScoredOpportunity;
  criteria: InvestorCriteria;
  onSelect: (op: ScoredOpportunity) => void;
  market?: MarketConfig;
}

export default function OpportunityCard({ opportunity, criteria, onSelect, market }: OpportunityCardProps) {
  const fmt = (v: number, p = false) => market ? formatCurrencyForMarket(v, market, p) : `${v}`;
  const { listing, score } = opportunity;

  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-brand-300">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold text-slate-900">{listing.title}</h3>
          <p className="text-sm text-slate-600">
            {listing.city} · {listing.district} · {listing.sizeM2} m² · {listing.rooms} hab.
          </p>
        </div>
        <OpportunityScoreBadge score={score.score} riskLevel={score.riskLevel} />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 text-sm sm:grid-cols-4">
        <div>
          <span className="text-slate-500">Precio</span>
          <p className="font-medium">{fmt(listing.price)}</p>
        </div>
        <div>
          <span className="text-slate-500">Renta est.</span>
          <p className="font-medium">{fmt(listing.estimatedMonthlyRent)}/mo</p>
        </div>
        <div>
          <span className="text-slate-500">Rent. bruta</span>
          <p className="font-medium">{formatPercent(score.grossYield)}</p>
        </div>
        <div>
          <span className="text-slate-500">Rent. neta</span>
          <p className="font-medium">{formatPercent(score.netYield)}</p>
        </div>
        <div>
          <span className="text-slate-500">Cashflow</span>
          <p className={`font-medium ${score.monthlyCashflow >= 0 ? 'text-green-700' : 'text-red-600'}`}>
            {fmt(score.monthlyCashflow, true)}/mo
          </p>
        </div>
        <div>
          <span className="text-slate-500">DSCR</span>
          <p className="font-medium">{score.dscr === Infinity ? '∞' : score.dscr.toFixed(2)}</p>
        </div>
      </div>

      <ul className="mt-3 space-y-1 text-xs text-slate-600">
        {score.reasons.slice(0, 2).map((r) => (
          <li key={r}>· {r}</li>
        ))}
      </ul>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onSelect(opportunity)}
          className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Ver detalle
        </button>
        <button
          type="button"
          onClick={() => pushListingToSimulator(listing, criteria, market?.slug ?? 'es')}
          className="rounded-lg bg-brand-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-brand-700"
        >
          Analizar en simulador
        </button>
      </div>
    </article>
  );
}
