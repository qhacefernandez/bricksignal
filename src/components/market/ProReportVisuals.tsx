import type { ReactNode } from 'react';
import type { LanguageCode } from '@/config/types';
import type { ProVisualType } from '@/content/proReportVisualTypes';
import { getProVisualCopy } from '@/i18n/proVisualCopy';

function MockCard({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg ${className}`}>
      {children}
    </div>
  );
}

function MockHeader({ title }: { title: string }) {
  return (
    <div className="bg-brand-600 px-4 py-2.5">
      <p className="text-xs font-semibold uppercase tracking-wide text-brand-100">BrickSignal</p>
      <p className="text-sm font-bold text-white">{title}</p>
    </div>
  );
}

export function ProReportVisual({ type, language }: { type: ProVisualType; language: LanguageCode }) {
  const v = getProVisualCopy(language);

  switch (type) {
    case 'netYield':
      return (
        <MockCard>
          <MockHeader title={v.executiveSummary} />
          <div className="grid grid-cols-3 gap-2 p-4">
            {[
              { label: v.price, value: '180.000 €' },
              { label: v.monthlyCashflow, value: '+110 €', accent: true },
              { label: v.netYield, value: '4,2 %', highlight: true },
            ].map((k) => (
              <div
                key={k.label}
                className={`rounded-lg p-2.5 ${k.highlight ? 'bg-brand-50 ring-2 ring-brand-300' : 'bg-slate-50'}`}
              >
                <p className="text-[10px] text-slate-500">{k.label}</p>
                <p className={`text-sm font-bold ${k.accent ? 'text-signal-green' : k.highlight ? 'text-brand-700' : 'text-slate-900'}`}>
                  {k.value}
                </p>
              </div>
            ))}
          </div>
          <div className="mx-4 mb-4 rounded-lg bg-viability-positive px-3 py-2 text-xs font-medium text-green-900">
            {v.viability}
          </div>
        </MockCard>
      );

    case 'vacancy':
      return (
        <MockCard className="p-4">
          <p className="text-xs font-semibold text-slate-500">{v.vacancyAndExpenses}</p>
          <div className="mt-3 space-y-3">
            <div>
              <div className="mb-1 flex justify-between text-xs">
                <span className="text-slate-600">{v.vacancy}</span>
                <span className="font-semibold text-brand-700">5 %</span>
              </div>
              <div className="h-2 rounded-full bg-slate-200">
                <div className="h-2 w-[5%] min-w-[8px] rounded-full bg-brand-500" />
              </div>
            </div>
            {[
              [v.propertyTax, '420 €'],
              [v.hoa, '480 €'],
              [v.management, '912 €'],
            ].map(([label, val]) => (
              <div key={label} className="flex justify-between rounded-lg bg-slate-50 px-3 py-2 text-xs">
                <span className="text-slate-600">{label}</span>
                <span className="font-semibold">{val}</span>
              </div>
            ))}
          </div>
        </MockCard>
      );

    case 'advancedMetrics':
      return (
        <MockCard className="p-4">
          <p className="text-xs font-semibold text-slate-500">{v.investorMetrics}</p>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {[
              [v.irr10y, '9,5 %'],
              ['DSCR', '1,17'],
              ['Cash-on-cash', '2,3 %'],
              [v.breakEven, '834 €/mes'],
            ].map(([label, val]) => (
              <div key={label} className="rounded-lg border border-slate-100 bg-slate-50 p-3">
                <p className="text-[10px] text-slate-500">{label}</p>
                <p className="text-lg font-bold text-slate-900">{val}</p>
              </div>
            ))}
          </div>
        </MockCard>
      );

    case 'projection':
      return (
        <MockCard className="p-4">
          <p className="text-xs font-semibold text-slate-500">{v.wealthProjection}</p>
          <table className="mt-3 w-full text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-left text-slate-500">
                <th className="pb-2">{v.horizon}</th>
                <th className="pb-2">{v.equity}</th>
                <th className="pb-2">TIR</th>
              </tr>
            </thead>
            <tbody className="text-slate-800">
              <tr className="border-b border-slate-100">
                <td className="py-2 font-medium">10</td>
                <td className="py-2 font-bold text-brand-700">116.333 €</td>
                <td className="py-2">9,5 %</td>
              </tr>
              <tr>
                <td className="py-2 font-medium">20</td>
                <td className="py-2 font-bold text-brand-700">230.503 €</td>
                <td className="py-2">9,8 %</td>
              </tr>
            </tbody>
          </table>
          <div className="mt-3 flex h-16 items-end gap-1">
            {[28, 35, 42, 50, 58, 65, 72, 80, 88, 100].map((h, i) => (
              <div key={i} className="flex-1 rounded-t bg-brand-400/80" style={{ height: `${h}%` }} />
            ))}
          </div>
        </MockCard>
      );

    case 'sensitivity':
      return (
        <MockCard className="p-4">
          <p className="text-xs font-semibold text-slate-500">{v.monthlySensitivity}</p>
          <table className="mt-2 w-full text-[10px]">
            <thead>
              <tr className="text-slate-500">
                <th className="pb-1 text-left">{v.scenario}</th>
                <th className="pb-1">−10 %</th>
                <th className="pb-1">{v.base}</th>
                <th className="pb-1">+10 %</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Vac. 5 %', '20 €', '110 €', '200 €'],
                ['Vac. 10 %', '−23 €', '63 €', '148 €'],
              ].map(([row, a, b, c]) => (
                <tr key={row} className="border-t border-slate-100">
                  <td className="py-1.5 text-slate-600">{row}</td>
                  <td className={`py-1.5 text-center font-medium ${a.startsWith('−') ? 'text-signal-red' : ''}`}>{a}</td>
                  <td className="py-1.5 text-center font-bold text-brand-700">{b}</td>
                  <td className="py-1.5 text-center font-medium text-signal-green">{c}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </MockCard>
      );

    case 'marketPulse':
      return (
        <MockCard className="p-4">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500">{v.marketPulseRegion}</p>
            <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800">60/100</span>
          </div>
          <p className="mt-2 text-sm font-semibold text-slate-900">{v.stableTrend}</p>
          <div className="mt-3 grid grid-cols-3 gap-2 text-center text-[10px]">
            {[
              [v.priceYoy, '+6,8 %'],
              [v.rentYoy, '+9,2 %'],
              [v.refRate, '3,15 %'],
            ].map(([l, val]) => (
              <div key={l} className="rounded-lg bg-brand-50 p-2">
                <p className="text-slate-500">{l}</p>
                <p className="font-bold text-brand-800">{val}</p>
              </div>
            ))}
          </div>
        </MockCard>
      );

    case 'pdfPreview':
      return (
        <MockCard>
          <MockHeader title={v.investmentReport} />
          <div className="space-y-2 p-4">
            <div className="h-2 w-3/4 rounded bg-slate-200" />
            <div className="h-2 w-full rounded bg-slate-100" />
            <div className="h-2 w-5/6 rounded bg-slate-100" />
            <div className="mt-3 grid grid-cols-4 gap-1">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-8 rounded bg-brand-50" />
              ))}
            </div>
            <div className="mt-2 rounded-lg bg-slate-50 p-2">
              <div className="h-1.5 w-full rounded bg-slate-200" />
              <div className="mt-1 h-1.5 w-4/5 rounded bg-slate-100" />
            </div>
            <p className="text-center text-[10px] font-medium text-brand-600">{v.pdfReady}</p>
          </div>
        </MockCard>
      );

    case 'checklist':
      return (
        <MockCard className="p-4">
          <p className="text-xs font-semibold text-slate-500">{v.dueDiligence}</p>
          <ol className="mt-3 space-y-2">
            {v.checklistItems.map((item, i) => (
              <li key={item} className="flex items-start gap-2 text-xs text-slate-700">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-100 text-[10px] font-bold text-brand-700">
                  {i + 1}
                </span>
                {item}
              </li>
            ))}
          </ol>
          <p className="mt-2 text-[10px] text-slate-400">{v.moreSteps}</p>
        </MockCard>
      );

    default:
      return null;
  }
}
