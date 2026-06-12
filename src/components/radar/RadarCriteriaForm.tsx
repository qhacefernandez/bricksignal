'use client';

import type { InvestorCriteria } from '@/lib/listings/types';

interface RadarCriteriaFormProps {
  criteria: InvestorCriteria;
  onChange: (patch: Partial<InvestorCriteria>) => void;
  onSubmit: () => void;
  loading?: boolean;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-slate-700">{label}</span>
      {children}
    </label>
  );
}

export default function RadarCriteriaForm({
  criteria,
  onChange,
  onSubmit,
  loading = false,
}: RadarCriteriaFormProps) {
  return (
    <form
      className="space-y-4 rounded-xl border border-slate-200 bg-white p-5"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <h2 className="text-lg font-semibold text-slate-900">Tus criterios de inversión</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Ciudad objetivo">
          <input
            type="text"
            value={criteria.targetCity}
            onChange={(e) => onChange({ targetCity: e.target.value })}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
        </Field>
        <Field label="Presupuesto máximo (€)">
          <input
            type="number"
            value={criteria.maxPrice}
            onChange={(e) => onChange({ maxPrice: parseFloat(e.target.value) || 0 })}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
        </Field>
        <Field label="Cash disponible (€)">
          <input
            type="number"
            value={criteria.availableCash}
            onChange={(e) => onChange({ availableCash: parseFloat(e.target.value) || 0 })}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
        </Field>
        <Field label="LTV hipoteca (%)">
          <input
            type="number"
            value={Math.round(criteria.mortgageLtv * 100)}
            onChange={(e) => onChange({ mortgageLtv: (parseFloat(e.target.value) || 0) / 100 })}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
        </Field>
        <Field label="Tipo interés (%)">
          <input
            type="number"
            step="0.1"
            value={criteria.interestRate}
            onChange={(e) => onChange({ interestRate: parseFloat(e.target.value) || 0 })}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
        </Field>
        <Field label="Plazo hipoteca (años)">
          <input
            type="number"
            value={criteria.mortgageYears}
            onChange={(e) => onChange({ mortgageYears: parseInt(e.target.value, 10) || 25 })}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
        </Field>
        <Field label="Rentabilidad bruta mín. (%)">
          <input
            type="number"
            step="0.5"
            value={criteria.minGrossYield}
            onChange={(e) => onChange({ minGrossYield: parseFloat(e.target.value) || 0 })}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
        </Field>
        <Field label="Rentabilidad neta mín. (%)">
          <input
            type="number"
            step="0.5"
            value={criteria.minNetYield}
            onChange={(e) => onChange({ minNetYield: parseFloat(e.target.value) || 0 })}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
        </Field>
        <Field label="Cashflow mensual mín. (€)">
          <input
            type="number"
            value={criteria.minMonthlyCashflow}
            onChange={(e) => onChange({ minMonthlyCashflow: parseFloat(e.target.value) || 0 })}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
        </Field>
        <Field label="DSCR mínimo">
          <input
            type="number"
            step="0.05"
            value={criteria.minDscr}
            onChange={(e) => onChange({ minDscr: parseFloat(e.target.value) || 0 })}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
        </Field>
        <Field label="Vacancia (%)">
          <input
            type="number"
            step="0.5"
            value={Math.round(criteria.vacancyRate * 100)}
            onChange={(e) => onChange({ vacancyRate: (parseFloat(e.target.value) || 0) / 100 })}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
        </Field>
        <Field label="Reforma máx. (€)">
          <input
            type="number"
            value={criteria.maxRenovationCost}
            onChange={(e) => onChange({ maxRenovationCost: parseFloat(e.target.value) || 0 })}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
        </Field>
        <Field label="Estrategia">
          <select
            value={criteria.strategy}
            onChange={(e) =>
              onChange({ strategy: e.target.value as InvestorCriteria['strategy'] })
            }
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          >
            <option value="traditional_rental">Alquiler tradicional</option>
            <option value="room_rental">Alquiler por habitaciones</option>
            <option value="renovate_and_rent">Reforma y alquiler</option>
          </select>
        </Field>
      </div>
      <button
        type="submit"
        disabled={loading}
        className="rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-60"
      >
        {loading ? 'Buscando…' : 'Buscar oportunidades'}
      </button>
    </form>
  );
}
