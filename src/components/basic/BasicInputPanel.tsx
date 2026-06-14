'use client';

import type { MarketConfig } from '@/config/types';
import type { BasicSimulatorInput } from '@/lib/calculations/basic';
import { AMORTIZATION_METHOD_LABELS, resolveAmortizationMethod } from '@/lib/mortgage';
import type { ValidationMessage } from '@/lib/validation/scenarioValidation';
import { t } from '@/i18n/messages';
import AssumptionBadge from '../inputs/AssumptionBadge';
import CurrencySliderField from '../inputs/CurrencySliderField';
import LockedAssumption from '../inputs/LockedAssumption';
import PercentageSliderField from '../inputs/PercentageSliderField';
import RegionSearchSelect from '../inputs/RegionSearchSelect';
import ToggleCard from '../inputs/ToggleCard';
import ValueModeToggle from '../inputs/ValueModeToggle';
import YearSliderField from '../inputs/YearSliderField';
import type { MarketInputRanges } from '@/config/inputRanges';
import { formatPercentValue } from '@/lib/format/percent';
import { formatPriceLabel } from '@/lib/currency';
import { track } from '@/lib/analytics';
import { getActivePricingVariant } from '@/config/pricing';

interface Props {
  market: MarketConfig;
  input: BasicSimulatorInput;
  ranges: MarketInputRanges;
  lockedVacancyPercent: number;
  proUnlocked?: boolean;
  reportsRemaining?: number;
  validation: ValidationMessage[];
  onChange: (patch: Partial<BasicSimulatorInput>, fieldId?: string) => void;
}

export default function BasicInputPanel({
  market,
  input,
  ranges,
  lockedVacancyPercent,
  proUnlocked = false,
  reportsRemaining = 0,
  validation,
  onChange,
}: Props) {
  const msg = (key: Parameters<typeof t>[1]) => t(market.language, key);
  const errors = validation.filter((v) => v.type === 'error');
  const warnings = validation.filter((v) => v.type === 'warning');
  const annualExpenseAbsoluteRange = {
    min: 0,
    max: Math.max(3_000, input.monthlyRent * 12 * 0.6),
    step: 50,
    defaultValue: input.annualExpensesAbsolute,
  };

  const handleMortgageToggle = (checked: boolean) => {
    track('mortgage_toggle_changed', {
      marketSlug: market.slug,
      hasMortgage: checked,
      pricingVariant: getActivePricingVariant(),
    });
    onChange({ useMortgage: checked });
  };

  const vacancyDisplay = proUnlocked
    ? input.vacancyMode === 'months'
      ? `${input.vacancyMonths} mes/año`
      : formatPercentValue(input.vacancyPercent, market.locale, 1)
    : `${formatPercentValue(lockedVacancyPercent, market.locale, 1)} incluido`;

  const amortizationLabel = AMORTIZATION_METHOD_LABELS[
    resolveAmortizationMethod(input.amortizationMethod, market.slug)
  ][market.language];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">{msg('simulator.quickEstimate')}</h2>
        <p className="mt-1 text-sm text-slate-600">{msg('simulator.moveControls')}</p>
      </div>

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">
          1. ¿Dónde está la vivienda?
        </h3>
        <RegionSearchSelect
          market={market}
          value={input.region}
          onChange={(region) => onChange({ region })}
        />
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">
          2. Precio y alquiler
        </h3>
        <div className="space-y-6">
          <CurrencySliderField
            id="purchasePrice"
            label="Precio de compra"
            value={input.purchasePrice}
            onChange={(v) => onChange({ purchasePrice: v }, 'purchasePrice')}
            range={ranges.purchasePrice}
            market={market}
          />
          <CurrencySliderField
            id="monthlyRent"
            label="Alquiler mensual esperado"
            value={input.monthlyRent}
            onChange={(v) => onChange({ monthlyRent: v }, 'monthlyRent')}
            range={ranges.monthlyRent}
            market={market}
            suffix="/mes"
          />
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">
          3. Financiación
        </h3>
        <ToggleCard
          label="Usar hipoteca"
          description="Activa para simular financiación bancaria"
          checked={input.useMortgage}
          onChange={handleMortgageToggle}
        />
        {input.useMortgage && (
          <div className="mt-6 space-y-6">
            <CurrencySliderField
              id="downPayment"
              label="Entrada disponible"
              value={input.downPayment}
              onChange={(v) => onChange({ downPayment: v }, 'downPayment')}
              range={ranges.downPayment}
              market={market}
            />
            <PercentageSliderField
              id="interestRate"
              label="Tipo de interés anual"
              value={input.interestRate}
              onChange={(v) => onChange({ interestRate: v }, 'interestRate')}
              range={ranges.interestRate}
              market={market}
            />
            <YearSliderField
              id="mortgageYears"
              label="Plazo hipotecario"
              value={input.mortgageYears}
              onChange={(v) => onChange({ mortgageYears: v }, 'mortgageYears')}
              range={ranges.mortgageYears}
            />
            {input.useMortgage && (
              <p className="rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-600">
                {msg('simulator.fiscalProTip')}
              </p>
            )}
          </div>
        )}
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">
          4. Gastos básicos
        </h3>
        <div className="space-y-6">
          <PercentageSliderField
            id="purchaseCostsPercent"
            label="Gastos de compra estimados"
            help="Impuestos, notaría y registro aproximados"
            value={input.purchaseCostsPercent}
            onChange={(v) => onChange({ purchaseCostsPercent: v }, 'purchaseCostsPercent')}
            range={ranges.purchaseCostsPercent}
            market={market}
          />
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-sm font-medium text-slate-800">Gastos anuales estimados</span>
              <ValueModeToggle
                id="annual-expenses-mode"
                mode={input.annualExpensesMode}
                onChange={(mode) => onChange({ annualExpensesMode: mode })}
                absoluteLabel={`${market.currency}/año`}
              />
            </div>
            {input.annualExpensesMode === 'percent' ? (
              <PercentageSliderField
                id="annualExpensesPercent"
                label="Gastos anuales (% del alquiler)"
                help="Comunidad, seguros, mantenimiento, gestión…"
                value={input.annualExpensesPercent}
                onChange={(v) => onChange({ annualExpensesPercent: v }, 'annualExpensesPercent')}
                range={ranges.annualExpensesPercent}
                market={market}
              />
            ) : (
              <CurrencySliderField
                id="annualExpensesAbsolute"
                label="Gastos anuales totales"
                help="Importe anual en moneda local"
                value={input.annualExpensesAbsolute}
                onChange={(v) => onChange({ annualExpensesAbsolute: v }, 'annualExpensesAbsolute')}
                range={annualExpenseAbsoluteRange}
                market={market}
                suffix="/año"
              />
            )}
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            5. {msg('simulator.includedAssumptions')}
          </h3>
          {proUnlocked && (
            <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-800">
              ✓ Desbloqueado
              {reportsRemaining > 0 && ` · ${reportsRemaining} informe${reportsRemaining === 1 ? '' : 's'}`}
            </span>
          )}
        </div>
        <p className="mb-4 text-xs text-slate-500">{msg('simulator.includedAssumptionsHelp')}</p>
        <div className="space-y-3">
          {proUnlocked ? (
            <>
              <AssumptionBadge label={msg('simulator.vacancyIncluded')} value={vacancyDisplay} />
              <AssumptionBadge label="Amortización" value={amortizationLabel} />
              <AssumptionBadge label="Fiscalidad avanzada" value="Editable en panel PRO" />
              <AssumptionBadge label="Reforma y mobiliario" value="Editable en panel PRO" />
              <AssumptionBadge label="Sensibilidad" value="Incluida" />
              <AssumptionBadge label="Market Pulse" value={`${input.region} (PRO)`} />
            </>
          ) : (
            <>
              <LockedAssumption
                marketSlug={market.slug}
                label={msg('simulator.vacancyIncluded')}
                value={`${formatPercentValue(lockedVacancyPercent, market.locale, 1)} incluido`}
                help="Estimación rápida sin meses vacíos. En PRO podrás ajustar vacancia, sensibilidad y escenarios realistas."
                proLabel={msg('simulator.editableInPro')}
              />
              <AssumptionBadge label="Amortización" value={amortizationLabel} />
              <AssumptionBadge label="Fiscalidad avanzada" value="Intereses hipoteca (PRO)" proOnly />
              <AssumptionBadge label="Reforma y mobiliario" value="No incluido" proOnly />
              <AssumptionBadge label="Sensibilidad" value="No incluida" proOnly />
              <AssumptionBadge label="Market Pulse" value="No incluido" proOnly />
            </>
          )}
        </div>
        {!proUnlocked && (
          <p className="mt-3 text-xs text-slate-500">
            Informe PRO: {formatPriceLabel(market.pricing.reportPrice.amount, market.pricing.reportPrice.currency, market.locale)} · 1 escenario por compra
          </p>
        )}
      </section>

      {(errors.length > 0 || warnings.length > 0) && (
        <div className="space-y-1">
          {errors.map((e) => (
            <p key={e.message} className="text-sm text-red-600" role="alert">{e.message}</p>
          ))}
          {warnings.map((w) => (
            <p key={w.message} className="text-sm text-amber-700">{w.message}</p>
          ))}
        </div>
      )}
    </div>
  );
}
