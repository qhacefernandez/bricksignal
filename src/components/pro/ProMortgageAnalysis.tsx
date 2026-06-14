import type { MarketConfig } from '@/config/types';
import { formatCurrencyForMarket } from '@/lib/currency';
import { formatPercent } from '@/lib/format';
import {
  estimateRentalTaxForMarket,
  firstYearMortgageInterest,
  getDefaultRentalTaxEstimateRate,
  getMarketRentalTaxConfig,
  marketAllowsMortgageInterestDeduction,
  mortgageInterestForYear,
  resolveRentalTaxRate,
} from '@/lib/calculations/rentalTax';
import { AMORTIZATION_METHOD_LABELS, resolveAmortizationMethod } from '@/lib/mortgage';
import type { CalculationResults, SimulatorInput } from '@/lib/types';

interface Props {
  market: MarketConfig;
  input: SimulatorInput;
  results: CalculationResults;
}

export default function ProMortgageAnalysis({ market, input, results }: Props) {
  const fmt = (v: number) => formatCurrencyForMarket(v, market);
  const taxConfig = getMarketRentalTaxConfig(market.slug);
  const applies = marketAllowsMortgageInterestDeduction(market.slug);
  const method = resolveAmortizationMethod(input.amortizationMethod, market.slug);
  const methodLabel = AMORTIZATION_METHOD_LABELS[method][market.language];
  const annualInterest = input.useMortgage && input.financedAmount > 0
    ? firstYearMortgageInterest(
        input.financedAmount,
        input.interestRate,
        input.mortgageYears,
        input.amortizationMethod,
        market.slug,
      )
    : 0;
  const interestYear5 = input.useMortgage && input.mortgageYears >= 5
    ? mortgageInterestForYear(
        input.financedAmount,
        input.interestRate,
        input.mortgageYears,
        5,
        input.amortizationMethod,
        market.slug,
      )
    : null;
  const taxRate = resolveRentalTaxRate(market.slug, input.effectiveTaxRate);
  const taxWithoutRelief = estimateRentalTaxForMarket(market.slug, {
    noi: results.noi,
    debtService: results.debtServiceAnnual,
    annualMortgageInterest: 0,
    taxRatePercent: taxRate,
  });
  const taxWithRelief = estimateRentalTaxForMarket(market.slug, {
    noi: results.noi,
    debtService: results.debtServiceAnnual,
    annualMortgageInterest: annualInterest,
    taxRatePercent: taxRate,
  });
  const taxSaving = Math.max(0, taxWithoutRelief - taxWithRelief);
  const isTaxCredit = taxConfig?.mode === 'tax_credit';
  const interestDeclines = method !== 'interest_only' && interestYear5 !== null && interestYear5 < annualInterest;

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5">
      <h4 className="mb-3 font-semibold text-slate-900">Hipoteca avanzada</h4>
      <dl className="grid gap-2 text-sm sm:grid-cols-2">
        <div className="flex justify-between rounded-lg bg-slate-50 px-3 py-2 sm:col-span-2">
          <dt className="text-slate-600">Sistema de amortización</dt>
          <dd className="font-medium text-right">{methodLabel}</dd>
        </div>
        <div className="flex justify-between rounded-lg bg-slate-50 px-3 py-2">
          <dt className="text-slate-600">Importe financiado</dt>
          <dd className="font-medium">{fmt(input.financedAmount)}</dd>
        </div>
        <div className="flex justify-between rounded-lg bg-slate-50 px-3 py-2">
          <dt className="text-slate-600">Cuota media (año 1)</dt>
          <dd className="font-medium">{fmt(results.monthlyMortgagePayment)}/mes</dd>
        </div>
        <div className="flex justify-between rounded-lg bg-slate-50 px-3 py-2">
          <dt className="text-slate-600">Servicio deuda anual (año 1)</dt>
          <dd className="font-medium">{fmt(results.debtServiceAnnual)}</dd>
        </div>
        <div className="flex justify-between rounded-lg bg-slate-50 px-3 py-2">
          <dt className="text-slate-600">Tipo / plazo</dt>
          <dd className="font-medium">{formatPercent(input.interestRate)} · {input.mortgageYears}a</dd>
        </div>
        {applies && input.useMortgage && annualInterest > 0 && (
          <>
            <div className="flex justify-between rounded-lg bg-brand-50 px-3 py-2 sm:col-span-2">
              <dt className="text-brand-800">
                {isTaxCredit ? 'Intereses hipoteca (año 1)' : 'Intereses deducibles (año 1, orientativo)'}
              </dt>
              <dd className="font-medium text-brand-900">{fmt(annualInterest)}</dd>
            </div>
            {interestDeclines && interestYear5 !== null && (
              <div className="flex justify-between rounded-lg bg-slate-50 px-3 py-2 sm:col-span-2">
                <dt className="text-slate-600">Intereses estimados (año 5)</dt>
                <dd className="font-medium">{fmt(interestYear5)}</dd>
              </div>
            )}
            <div className="flex justify-between rounded-lg bg-brand-50 px-3 py-2 sm:col-span-2">
              <dt className="text-brand-800">
                {isTaxCredit
                  ? `Crédito fiscal estimado (${formatPercent(taxConfig?.creditRatePercent ?? 20)} sobre intereses)`
                  : `Ahorro fiscal estimado por intereses (${formatPercent(taxRate)})`}
              </dt>
              <dd className="font-medium text-brand-900">{fmt(taxSaving)}</dd>
            </div>
          </>
        )}
      </dl>
      {method !== 'interest_only' && input.useMortgage && (
        <p className="mt-3 text-xs text-slate-500">
          Con {methodLabel.toLowerCase()}, los intereses deducibles bajan cada año al reducirse el capital pendiente.
          Las proyecciones anuales del informe usan el calendario real de amortización.
        </p>
      )}
      {method === 'interest_only' && input.useMortgage && (
        <p className="mt-3 text-xs text-slate-500">
          En solo intereses, la deducción fiscal se mantiene estable hasta el vencimiento (modelo simplificado con balloon al final).
        </p>
      )}
      {applies && input.useMortgage && taxConfig?.note && (
        <p className="mt-2 text-xs text-slate-500">{taxConfig.note}</p>
      )}
      {applies && input.useMortgage && input.effectiveTaxRate <= 0 && (
        <p className="mt-2 text-xs text-slate-400">
          Tipo fiscal orientativo: {formatPercent(getDefaultRentalTaxEstimateRate(market.slug))}. Ajústalo en el panel fiscal.
        </p>
      )}
    </section>
  );
}
