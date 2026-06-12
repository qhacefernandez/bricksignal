'use client';

import type { MarketConfig } from '@/config/types';
import type { SimulatorInput } from '@/lib/types';

interface MarketTaxFieldsProps {
  market: MarketConfig;
  input: SimulatorInput;
  onChange: (taxValues: Record<string, number>) => void;
}

function Field({
  label,
  description,
  children,
}: {
  label: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-slate-700">{label}</span>
      {children}
      {description && <span className="mt-1 block text-xs text-slate-500">{description}</span>}
    </label>
  );
}

export default function MarketTaxFields({ market, input, onChange }: MarketTaxFieldsProps) {
  const values = input.taxValues ?? {};

  const update = (id: string, value: number) => {
    onChange({ ...values, [id]: value });
  };

  const renderFields = (section: 'purchase' | 'annual' | 'rental') => {
    const fields =
      section === 'purchase'
        ? market.taxProfile.purchaseTaxFields
        : section === 'annual'
          ? market.taxProfile.annualCostFields
          : market.taxProfile.rentalTaxFields;

    return fields.map((field) => (
      <Field key={field.id} label={field.label} description={field.description}>
        <input
          type="number"
          step={field.inputType === 'percentage' ? 0.1 : 1}
          value={values[field.id] ?? field.defaultRate ?? field.defaultAmount ?? 0}
          disabled={!field.editable}
          onChange={(e) => update(field.id, parseFloat(e.target.value) || 0)}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm disabled:bg-slate-100"
        />
      </Field>
    ));
  };

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="mb-4 text-lg font-semibold text-slate-900">Purchase taxes & costs</h2>
        <div className="grid gap-4 sm:grid-cols-2">{renderFields('purchase')}</div>
      </section>
      <section className="rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="mb-4 text-lg font-semibold text-slate-900">Annual costs</h2>
        <div className="grid gap-4 sm:grid-cols-2">{renderFields('annual')}</div>
      </section>
      <section className="rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="mb-4 text-lg font-semibold text-slate-900">Rental tax (simplified)</h2>
        <div className="grid gap-4 sm:grid-cols-2">{renderFields('rental')}</div>
        <p className="mt-3 text-xs text-slate-500">{market.taxProfile.disclaimer}</p>
      </section>
    </div>
  );
}
