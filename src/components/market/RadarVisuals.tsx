import type { ReactNode } from 'react';
import type { LanguageCode } from '@/config/types';
import type { RadarVisualType } from '@/i18n/radarCopy';
import { getRadarVisualCopy } from '@/i18n/radarVisualCopy';

function MockCard({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg ${className}`}>
      {children}
    </div>
  );
}

export function RadarVisual({ type, language }: { type: RadarVisualType; language: LanguageCode }) {
  const v = getRadarVisualCopy(language);

  switch (type) {
    case 'criteria':
      return (
        <MockCard>
          <div className="bg-slate-900 px-4 py-2.5">
            <p className="text-xs font-semibold text-slate-400">{v.productName}</p>
            <p className="text-sm font-bold text-white">{v.yourCriteria}</p>
          </div>
          <div className="space-y-2 p-4">
            {[
              [v.maxBudget, '220.000 €'],
              [v.minCashflow, `+150 €${v.perMonth}`],
              [v.minGrossYield, '6,5 %'],
              [v.city, 'Valencia'],
            ].map(([k, val]) => (
              <div key={k} className="flex justify-between rounded-lg bg-slate-50 px-3 py-2 text-xs">
                <span className="text-slate-600">{k}</span>
                <span className="font-semibold text-slate-900">{val}</span>
              </div>
            ))}
          </div>
        </MockCard>
      );
    case 'ranking':
      return (
        <MockCard className="p-4">
          <p className="text-xs font-semibold text-slate-500">{v.topOpportunitiesToday}</p>
          <ul className="mt-3 space-y-2">
            {v.rankingRows.map((row) => (
              <li key={row.addr} className="flex items-center gap-3 rounded-lg border border-slate-100 p-2">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-800">
                  {row.addr === v.rankingRows[0].addr ? 92 : row.addr === v.rankingRows[1].addr ? 87 : 81}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-medium text-slate-900">{row.addr}</p>
                  <p className="text-[10px] text-signal-green">
                    {row.cf}
                    {v.perMonth}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </MockCard>
      );
    case 'alert':
      return (
        <MockCard>
          <div className="border-b border-slate-100 bg-brand-50 px-4 py-3">
            <p className="text-xs font-semibold text-brand-800">🔔 {v.newOpportunity}</p>
            <p className="mt-1 text-sm font-bold text-slate-900">{v.matchesCriteria}</p>
          </div>
          <div className="space-y-2 p-4 text-xs">
            <p className="text-slate-600">{v.alertListing}</p>
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-lg bg-slate-50 p-2">
                <p className="text-slate-500">{v.estimatedCashflow}</p>
                <p className="font-bold text-signal-green">+174 €</p>
              </div>
              <div className="rounded-lg bg-slate-50 p-2">
                <p className="text-slate-500">{v.score}</p>
                <p className="font-bold text-brand-700">89/100</p>
              </div>
            </div>
            <button type="button" className="w-full rounded-lg bg-brand-600 py-2 text-xs font-semibold text-white">
              {v.viewInSimulator}
            </button>
          </div>
        </MockCard>
      );
    case 'tiers':
      return (
        <MockCard className="p-4">
          <p className="text-xs font-semibold text-slate-500">{v.plannedTiers}</p>
          <div className="mt-3 grid gap-2">
            {v.tierRows.map((tier) => (
              <div
                key={tier.name}
                className={`rounded-lg border px-3 py-2 ${tier.highlight ? 'border-brand-300 bg-brand-50' : 'border-slate-200 bg-slate-50'}`}
              >
                <p className="text-xs font-bold text-slate-900">{tier.name}</p>
                <p className="text-[10px] text-slate-600">{tier.desc}</p>
              </div>
            ))}
          </div>
        </MockCard>
      );
  }
}
