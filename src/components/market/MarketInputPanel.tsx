'use client';

import type { MarketConfig } from '@/config/types';
import { sqftToM2, m2ToSqft } from '@/lib/units';
import type { SimulatorInput } from '@/lib/types';
import MarketMortgageFields from './MarketMortgageFields';
import MarketTaxFields from './MarketTaxFields';

interface Props {
  market: MarketConfig;
  input: SimulatorInput;
  onChange: (patch: Partial<SimulatorInput>) => void;
}

export default function MarketInputPanel({ market, input, onChange }: Props) {
  const usesSqft = market.defaultAreaUnit === 'sqft';

  return (
    <div className="space-y-8">
      <section className="rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="mb-4 text-lg font-semibold text-slate-900">Property</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">Purchase price</span>
            <input type="number" value={input.purchasePrice} onChange={(e) => onChange({ purchasePrice: +e.target.value })} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">
              {market.taxProfile.regionLabel ?? 'Region'}
              {market.taxProfile.requiresRegionSelection && ' *'}
            </span>
            <input type="text" value={input.region} onChange={(e) => onChange({ region: e.target.value })} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">Area ({usesSqft ? 'sq ft' : 'm²'})</span>
            <input
              type="number"
              value={usesSqft ? (input.areaSqft ?? m2ToSqft(input.squareMeters ?? 65)) : (input.squareMeters ?? 65)}
              onChange={(e) => {
                const v = +e.target.value;
                if (usesSqft) onChange({ areaSqft: v, squareMeters: sqftToM2(v) });
                else onChange({ squareMeters: v, areaSqft: m2ToSqft(v) });
              }}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">Condition</span>
            <select value={input.propertyStatus} onChange={(e) => onChange({ propertyStatus: e.target.value as SimulatorInput['propertyStatus'] })} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm">
              <option value="ready">Ready to rent</option>
              <option value="needs_renovation">Needs renovation</option>
            </select>
          </label>
          {input.propertyStatus === 'needs_renovation' && (
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-slate-700">Renovation cost</span>
              <input type="number" value={input.renovationCost} onChange={(e) => onChange({ renovationCost: +e.target.value })} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
            </label>
          )}
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="mb-4 text-lg font-semibold text-slate-900">Rent</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">Monthly rent</span>
            <input type="number" value={input.monthlyRent} onChange={(e) => onChange({ monthlyRent: +e.target.value })} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">Vacancy (%)</span>
            <input type="number" value={input.vacancyPercent ?? 0} onChange={(e) => onChange({ vacancyPercent: +e.target.value })} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">Rent growth (%/yr)</span>
            <input type="number" value={input.rentGrowthPercent} onChange={(e) => onChange({ rentGrowthPercent: +e.target.value })} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">Liquidity reserve</span>
            <input type="number" value={input.liquidityReserve} onChange={(e) => onChange({ liquidityReserve: +e.target.value })} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
          </label>
        </div>
      </section>

      <MarketTaxFields
        market={market}
        input={input}
        onChange={(taxValues) => onChange({ taxValues })}
      />

      <MarketMortgageFields market={market} input={input} onChange={onChange} />

      <section className="rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="mb-4 text-lg font-semibold text-slate-900">Projection</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">Horizon (years)</span>
            <select value={input.projectionHorizon} onChange={(e) => onChange({ projectionHorizon: +e.target.value as SimulatorInput['projectionHorizon'] })} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm">
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={15}>15</option>
              <option value={20}>20</option>
            </select>
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">Appreciation (%/yr)</span>
            <input type="number" value={input.appreciationPercent} onChange={(e) => onChange({ appreciationPercent: +e.target.value })} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
          </label>
        </div>
      </section>
    </div>
  );
}
