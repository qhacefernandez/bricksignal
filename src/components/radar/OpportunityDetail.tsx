'use client';

import type { MarketConfig } from '@/config/types';
import { formatCurrencyForMarket } from '@/lib/currency';
import { formatPercent } from '@/lib/format';
import { pushListingToSimulator } from '@/lib/listings/simulatorBridge';
import type { InvestorCriteria, ScoredOpportunity } from '@/lib/listings/types';
import OpportunityAssumptions from './OpportunityAssumptions';
import OpportunityScoreBadge from './OpportunityScoreBadge';

interface OpportunityDetailProps {
  opportunity: ScoredOpportunity;
  criteria: InvestorCriteria;
  onClose: () => void;
  market?: MarketConfig;
}

export default function OpportunityDetail({ opportunity, criteria, onClose, market }: OpportunityDetailProps) {
  const fmt = (v: number, p = false) => market ? formatCurrencyForMarket(v, market, p) : `${v}`;
  const { listing, score } = opportunity;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white p-6 shadow-xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900">{listing.title}</h3>
            <p className="text-sm text-slate-600">
              {listing.city} · {listing.district}
            </p>
          </div>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600">
            ✕
          </button>
        </div>

        <div className="mt-4">
          <OpportunityScoreBadge score={score.score} riskLevel={score.riskLevel} />
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
          <div>
            <span className="text-slate-500">Precio</span>
            <p className="font-semibold">{fmt(listing.price)}</p>
          </div>
          <div>
            <span className="text-slate-500">Renta est.</span>
            <p className="font-semibold">{fmt(listing.estimatedMonthlyRent)}/mo</p>
          </div>
          <div>
            <span className="text-slate-500">Rent. neta</span>
            <p className="font-semibold">{formatPercent(score.netYield)}</p>
          </div>
          <div>
            <span className="text-slate-500">Cashflow</span>
            <p className="font-semibold">{fmt(score.monthlyCashflow, true)}/mo</p>
          </div>
          <div>
            <span className="text-slate-500">DSCR</span>
            <p className="font-semibold">{score.dscr === Infinity ? '∞' : score.dscr.toFixed(2)}</p>
          </div>
          <div>
            <span className="text-slate-500">Inversión inicial</span>
            <p className="font-semibold">{fmt(score.initialInvestment)}</p>
          </div>
        </div>

        <div className="mt-4">
          <h4 className="text-sm font-semibold text-slate-800">Razones del score</h4>
          <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-slate-600">
            {score.reasons.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        </div>

        <div className="mt-4">
          <h4 className="text-sm font-semibold text-slate-800">Hipótesis</h4>
          <div className="mt-2">
            <OpportunityAssumptions assumptions={score.assumptions} />
          </div>
        </div>

        <button
          type="button"
          onClick={() => pushListingToSimulator(listing, criteria, market?.slug ?? 'es')}
          className="mt-6 w-full rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-700"
        >
          Analizar en simulador
        </button>
      </div>
    </div>
  );
}
