'use client';

import type { MarketConfig } from '@/config/types';
import { getMarketInputRanges } from '@/config/inputRanges';
import type { InvestorCriteria } from '@/lib/listings/types';
import { t } from '@/i18n/messages';
import CurrencySliderField from '../inputs/CurrencySliderField';
import PercentageSliderField from '../inputs/PercentageSliderField';
import RegionSearchSelect from '../inputs/RegionSearchSelect';
import YearSliderField from '../inputs/YearSliderField';
import ToggleCard from '../inputs/ToggleCard';

interface Props {
  market: MarketConfig;
  criteria: InvestorCriteria;
  onChange: (patch: Partial<InvestorCriteria>) => void;
  onSubmit: () => void;
  loading?: boolean;
}

export default function MarketRadarCriteriaForm({
  market,
  criteria,
  onChange,
  onSubmit,
  loading = false,
}: Props) {
  const msg = (key: Parameters<typeof t>[1]) => t(market.language, key);
  const ranges = getMarketInputRanges(market.slug);
  const useMortgage = criteria.mortgageLtv > 0 && criteria.mortgageLtv < 1;

  return (
    <form
      className="space-y-6"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <div>
        <h2 className="text-lg font-semibold text-slate-900">{msg('radar.criteriaTitle')}</h2>
        <p className="mt-1 text-sm text-slate-600">{msg('simulator.moveControls')}</p>
      </div>

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <RegionSearchSelect
          market={market}
          value={criteria.targetCity}
          onChange={(targetCity) => onChange({ targetCity })}
          label={msg('radar.targetCity')}
        />
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-6">
        <CurrencySliderField
          id="radar-max-price"
          label={msg('radar.maxBudget')}
          value={criteria.maxPrice}
          onChange={(maxPrice) => onChange({ maxPrice })}
          range={ranges.purchasePrice}
          market={market}
        />
        <CurrencySliderField
          id="radar-cash"
          label={msg('radar.availableCash')}
          value={criteria.availableCash}
          onChange={(availableCash) => onChange({ availableCash })}
          range={ranges.downPayment}
          market={market}
        />
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <ToggleCard
          label={msg('radar.useMortgage')}
          checked={useMortgage}
          onChange={(checked) => onChange({ mortgageLtv: checked ? 0.7 : 0 })}
        />
        {useMortgage && (
          <div className="mt-6 space-y-6">
            <PercentageSliderField
              id="radar-ltv"
              label={msg('radar.ltv')}
              value={Math.round(criteria.mortgageLtv * 100)}
              onChange={(v) => onChange({ mortgageLtv: v / 100 })}
              range={{ min: 0, max: 90, step: 5, defaultValue: 70 }}
              market={market}
            />
            <PercentageSliderField
              id="radar-rate"
              label={msg('radar.interestRate')}
              value={criteria.interestRate}
              onChange={(interestRate) => onChange({ interestRate })}
              range={ranges.interestRate}
              market={market}
            />
            <YearSliderField
              id="radar-years"
              label={msg('radar.mortgageYears')}
              value={criteria.mortgageYears}
              onChange={(mortgageYears) => onChange({ mortgageYears })}
              range={ranges.mortgageYears}
            />
          </div>
        )}
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-6">
        <PercentageSliderField
          id="radar-min-gross"
          label={msg('radar.minGrossYield')}
          value={criteria.minGrossYield}
          onChange={(minGrossYield) => onChange({ minGrossYield })}
          range={{ min: 0, max: 15, step: 0.5, defaultValue: 5 }}
          market={market}
        />
        <PercentageSliderField
          id="radar-min-net"
          label={msg('radar.minNetYield')}
          value={criteria.minNetYield}
          onChange={(minNetYield) => onChange({ minNetYield })}
          range={{ min: 0, max: 12, step: 0.5, defaultValue: 3 }}
          market={market}
        />
        <CurrencySliderField
          id="radar-min-cf"
          label={msg('radar.minCashflow')}
          value={criteria.minMonthlyCashflow}
          onChange={(minMonthlyCashflow) => onChange({ minMonthlyCashflow })}
          range={ranges.monthlyRent}
          market={market}
          suffix="/mes"
        />
      </section>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-brand-600 px-5 py-3 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-60 sm:w-auto"
      >
        {loading ? msg('radar.searching') : msg('radar.search')}
      </button>
    </form>
  );
}
