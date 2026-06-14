'use client';

import type { AmortizationMethod, MarketConfig } from '@/config/types';
import type { MarketInputRanges } from '@/config/inputRanges';
import type { SimulatorInput } from '@/lib/types';
import { validateVacancyRate } from '@/lib/validation/scenarioValidation';
import { AMORTIZATION_METHOD_LABELS, resolveAmortizationMethod } from '@/lib/mortgage';
import CurrencySliderField from '../inputs/CurrencySliderField';
import PercentageSliderField from '../inputs/PercentageSliderField';
import ValueModeToggle, { type ValueInputMode } from '../inputs/ValueModeToggle';
import YearSliderField from '../inputs/YearSliderField';
import { t } from '@/i18n/messages';

interface Props {
  market: MarketConfig;
  input: SimulatorInput;
  ranges: MarketInputRanges;
  onChange: (patch: Partial<SimulatorInput>) => void;
}

export default function ProAssumptionsPanel({ market, input, ranges, onChange }: Props) {
  const msg = (key: Parameters<typeof t>[1]) => t(market.language, key);
  const vacancyMode: ValueInputMode =
    input.vacancyMonths !== undefined && input.vacancyMonths > 0 ? 'absolute' : 'percent';
  const vacancyWarnings = validateVacancyRate(input.vacancyPercent ?? 0);
  const amortizationMethod = resolveAmortizationMethod(input.amortizationMethod, market.slug);
  const amortizationOptions: AmortizationMethod[] = ['french', 'linear', 'interest_only'];

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5">
      <h4 className="mb-1 font-semibold text-slate-900">Hipótesis avanzadas PRO</h4>
      <p className="mb-4 text-xs text-slate-500">Ajusta vacancia, gastos detallados y proyección.</p>
      <div className="space-y-6">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-sm font-medium text-slate-800">Vacancia estimada</span>
            <ValueModeToggle
              id="vacancy-mode"
              mode={vacancyMode}
              onChange={(mode) => {
                if (mode === 'percent') {
                  onChange({
                    vacancyPercent: input.vacancyPercent ?? ranges.vacancyRate.defaultValue,
                    vacancyMonths: undefined,
                  });
                } else {
                  onChange({
                    vacancyMonths: input.vacancyMonths ?? 1,
                    vacancyPercent: undefined,
                  });
                }
              }}
              percentLabel="% anual"
              absoluteLabel="meses/año"
            />
          </div>
          {vacancyMode === 'percent' ? (
            <PercentageSliderField
              id="pro-vacancy"
              label="Vacancia (% anual)"
              help="Porcentaje del alquiler anual no cobrado"
              value={input.vacancyPercent ?? ranges.vacancyRate.defaultValue}
              onChange={(v) => onChange({ vacancyPercent: v, vacancyMonths: undefined })}
              range={ranges.vacancyRate}
              market={market}
            />
          ) : (
            <YearSliderField
              id="pro-vacancy-months"
              label="Meses vacíos al año"
              value={input.vacancyMonths ?? 1}
              onChange={(v) => onChange({ vacancyMonths: Math.min(12, Math.max(0, v)), vacancyPercent: undefined })}
              range={{ min: 0, max: 12, step: 1, defaultValue: 1 }}
            />
          )}
        </div>
        {vacancyWarnings.map((w) => (
          <p key={w.message} className="-mt-4 text-xs text-amber-700">{w.message}</p>
        ))}
        {input.useMortgage && (
          <div>
            <label htmlFor="pro-amortization" className="mb-1 block text-sm font-medium text-slate-800">
              Sistema de amortización
            </label>
            <select
              id="pro-amortization"
              value={amortizationMethod}
              onChange={(e) => onChange({ amortizationMethod: e.target.value as AmortizationMethod })}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
            >
              {amortizationOptions.map((option) => (
                <option key={option} value={option}>
                  {AMORTIZATION_METHOD_LABELS[option][market.language]}
                </option>
              ))}
            </select>
            <p className="mt-1 text-xs text-slate-500">
              Afecta cuota, intereses deducibles y proyección anual (francés · alemán · solo intereses).
            </p>
          </div>
        )}
        <CurrencySliderField
          id="pro-renovation"
          label="Reforma"
          value={input.renovationCost}
          onChange={(v) => onChange({ renovationCost: v })}
          range={ranges.renovationCost}
          market={market}
        />
        <CurrencySliderField
          id="pro-furniture"
          label="Mobiliario"
          value={input.furnitureCost}
          onChange={(v) => onChange({ furnitureCost: v })}
          range={ranges.furnitureCost}
          market={market}
        />
        <CurrencySliderField
          id="pro-ibi"
          label="IBI / property tax anual"
          value={input.ibi}
          onChange={(v) => onChange({ ibi: v })}
          range={{ min: 0, max: ranges.renovationCost.max, step: 50, defaultValue: input.ibi }}
          market={market}
        />
        <CurrencySliderField
          id="pro-community"
          label="Comunidad / HOA"
          value={input.communityFees}
          onChange={(v) => onChange({ communityFees: v })}
          range={{ min: 0, max: 24_000, step: 50, defaultValue: input.communityFees }}
          market={market}
        />
        <PercentageSliderField
          id="pro-management"
          label="Gestión inmobiliaria"
          value={input.managementPercent}
          onChange={(v) => onChange({ managementPercent: v })}
          range={{ min: 0, max: 20, step: 0.5, defaultValue: 0 }}
          market={market}
        />
        <PercentageSliderField
          id="pro-appreciation"
          label="Revalorización anual"
          value={input.appreciationPercent}
          onChange={(v) => onChange({ appreciationPercent: v })}
          range={ranges.propertyAppreciation}
          market={market}
        />
        <PercentageSliderField
          id="pro-rent-growth"
          label="Crecimiento de renta"
          value={input.rentGrowthPercent}
          onChange={(v) => onChange({ rentGrowthPercent: v })}
          range={ranges.rentGrowth}
          market={market}
        />
        <PercentageSliderField
          id="pro-expense-growth"
          label="Crecimiento de gastos"
          value={input.expenseInflationPercent}
          onChange={(v) => onChange({ expenseInflationPercent: v })}
          range={ranges.expenseGrowth}
          market={market}
        />
        <PercentageSliderField
          id="pro-tax"
          label="Tipo fiscal efectivo"
          value={input.effectiveTaxRate}
          onChange={(v) => onChange({ effectiveTaxRate: v })}
          range={ranges.effectiveTaxRate}
          market={market}
        />
        <PercentageSliderField
          id="pro-sale-cost"
          label="Coste de venta"
          value={input.saleCostPercent}
          onChange={(v) => onChange({ saleCostPercent: v })}
          range={ranges.sellingCostsPercent}
          market={market}
        />
        <YearSliderField
          id="pro-horizon"
          label="Horizonte de proyección"
          value={input.projectionHorizon}
          onChange={(v) => {
            const options: SimulatorInput['projectionHorizon'][] = [5, 10, 15, 20];
            const snapped = options.reduce((best, cur) =>
              Math.abs(cur - v) < Math.abs(best - v) ? cur : best,
            );
            onChange({ projectionHorizon: snapped });
          }}
          range={{ ...ranges.projectionYears, max: 20 }}
        />
      </div>
      <p className="mt-4 text-xs text-slate-400">{msg('disclaimer.tax')}</p>
    </section>
  );
}
