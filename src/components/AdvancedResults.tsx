'use client';

import { useState } from 'react';
import { calculateProjectionAtHorizon, DUE_DILIGENCE_CHECKLIST } from '@/lib/calculations';
import { formatEuro, formatPercent } from '@/lib/format';
import { getMarket } from '@/config/markets';
import type { MarketConfig } from '@/config/types';
import { formatCurrencyForMarket, formatPriceLabel } from '@/lib/currency';
import type { CalculationResults, SimulatorInput } from '@/lib/types';
import CashflowChart from './CashflowChart';
import SensitivityTable from './SensitivityTable';
import { MetricLabel } from './Tooltip';

interface AdvancedResultsProps {
  input: SimulatorInput;
  results: CalculationResults;
  proUnlocked: boolean;
  market?: MarketConfig;
  onRequestPro?: () => void;
}

export default function AdvancedResults({
  input,
  results,
  proUnlocked,
  market,
  onRequestPro,
}: AdvancedResultsProps) {
  const fmt = (v: number, precise = false) =>
    market ? formatCurrencyForMarket(v, market, precise) : formatEuro(v, precise);
  const priceMarket = market ?? getMarket('es');
  const reportPriceLabel = formatPriceLabel(
    priceMarket.pricing.reportPrice.amount,
    priceMarket.pricing.reportPrice.currency,
    priceMarket.locale,
  );
  const [downloading, setDownloading] = useState(false);
  const proj10 = calculateProjectionAtHorizon(input, 10);
  const proj20 = calculateProjectionAtHorizon(input, 20);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const { generateProReportPdf } = await import('@/lib/pdf');
      generateProReportPdf(input, results);
    } finally {
      setDownloading(false);
    }
  };

  if (!proUnlocked) {
    return (
      <section className="rounded-xl border border-dashed border-brand-300 bg-brand-50/50 p-6 text-center">
        <h3 className="text-lg font-semibold text-slate-900">Informe Pro bloqueado</h3>
        <p className="mt-2 text-sm text-slate-600">
          Desbloquea proyecciones a 10/20 años, TIR, DSCR, sensibilidad, PDF y checklist de due diligence.
        </p>
        {onRequestPro && (
          <button
            type="button"
            onClick={onRequestPro}
            className="mt-4 rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-700"
          >
            {`Generar Informe Pro — ${reportPriceLabel}`}
          </button>
        )}
      </section>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-xl font-semibold text-slate-900">Informe Pro desbloqueado</h3>
        <button
          type="button"
          onClick={handleDownload}
          disabled={downloading}
          className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-60"
        >
          {downloading ? 'Generando PDF…' : 'Descargar PDF'}
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Cash-on-cash', value: formatPercent(results.cashOnCash), tip: 'Cashflow anual post-imp. / inversión inicial.' },
          { label: 'DSCR', value: results.dscr === Infinity ? '∞' : results.dscr.toFixed(2), tip: 'NOI / servicio anual de deuda.' },
          { label: 'Break-even renta', value: `${fmt(results.breakEvenRent)}/mes`, tip: 'Renta mínima para cubrir gastos y deuda.' },
          { label: 'TIR estimada', value: formatPercent(results.irr), tip: 'Tasa interna de retorno con venta al horizonte.' },
        ].map((m) => (
          <div key={m.label} className="rounded-xl border border-slate-200 bg-white p-4">
            <MetricLabel label={m.label} tooltip={m.tip} />
            <p className="mt-1 text-2xl font-bold text-slate-900">{m.value}</p>
          </div>
        ))}
      </div>

      <section className="rounded-xl border border-slate-200 bg-white p-5">
        <h4 className="mb-3 font-semibold text-slate-900">Proyección 10 y 20 años</h4>
        <div className="grid gap-4 md:grid-cols-2">
          {[proj10, proj20].map((p, i) => (
            <div key={i} className="rounded-lg bg-slate-50 p-4 text-sm">
              <p className="font-medium">{i === 0 ? '10 años' : '20 años'}</p>
              <ul className="mt-2 space-y-1 text-slate-600">
                <li>Cashflow acumulado: {fmt(p.cumulativeCashflow)}</li>
                <li>Valor inmueble: {fmt(p.propertyValue)}</li>
                <li>Patrimonio neto: {fmt(p.equity)}</li>
                <li>TIR: {formatPercent(p.irr)}</li>
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-5">
        <h4 className="mb-3 font-semibold text-slate-900">Escenario de venta ({results.saleScenario.horizonYears} años)</h4>
        <div className="grid gap-2 text-sm text-slate-600 sm:grid-cols-2">
          <p>Valor estimado: {fmt(results.saleScenario.propertyValue)}</p>
          <p>Costes de venta: {fmt(results.saleScenario.saleCosts)}</p>
          <p>Deuda pendiente: {fmt(results.saleScenario.remainingDebt)}</p>
          <p>Proceeds netos: {fmt(results.saleScenario.netSaleProceeds)}</p>
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-5">
        <h4 className="mb-3 font-semibold text-slate-900">Cashflows anuales</h4>
        <CashflowChart data={results.annualCashflows} years={input.projectionHorizon} />
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-left text-xs">
            <thead>
              <tr className="border-b text-slate-500">
                <th className="px-2 py-1">Año</th>
                <th className="px-2 py-1">NOI</th>
                <th className="px-2 py-1">Deuda</th>
                <th className="px-2 py-1">CF post-imp.</th>
                <th className="px-2 py-1">Equity</th>
              </tr>
            </thead>
            <tbody>
              {results.annualCashflows.slice(0, input.projectionHorizon).map((row) => (
                <tr key={row.year} className="border-b border-slate-100">
                  <td className="px-2 py-1">{row.year}</td>
                  <td className="px-2 py-1">{fmt(row.noi)}</td>
                  <td className="px-2 py-1">{fmt(row.debtService)}</td>
                  <td className="px-2 py-1">{fmt(row.cashflowAfterTax)}</td>
                  <td className="px-2 py-1">{fmt(row.equity)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-5">
        <h4 className="mb-3 font-semibold text-slate-900">Sensibilidad</h4>
        <SensitivityTable scenarios={results.sensitivity} baseInterestRate={input.interestRate} />
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-5">
        <h4 className="mb-3 font-semibold text-slate-900">Checklist due diligence</h4>
        <ul className="list-inside list-disc space-y-1 text-sm text-slate-700">
          {DUE_DILIGENCE_CHECKLIST.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-5">
        <h4 className="mb-3 font-semibold text-slate-900">Hipótesis utilizadas</h4>
        <dl className="grid gap-2 text-sm sm:grid-cols-2">
          {Object.entries(results.assumptions).map(([k, v]) => (
            <div key={k}>
              <dt className="text-slate-500">{k}</dt>
              <dd className="font-medium text-slate-800">{v}</dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  );
}
