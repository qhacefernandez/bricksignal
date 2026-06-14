'use client';

import { useState } from 'react';
import type { MarketConfig } from '@/config/types';
import { track } from '@/lib/analytics';
import { buildAnalyticsProps } from '@/lib/analyticsContext';
import type { BasicCalculationResults, BasicSimulatorInput } from '@/lib/calculations/basic';
import { formatPriceLabel } from '@/lib/currency';
import { formatPercentValue } from '@/lib/format/percent';
import { runFullProAnalysis } from '@/lib/calculations/pro';
import { saveBasicScenario, saveScenario, startCheckout } from '@/lib/marketStorage';
import { t } from '@/i18n/messages';
import ProReportSalesSection from './ProReportSalesSection';

interface Props {
  market: MarketConfig;
  basic: BasicSimulatorInput;
  results: BasicCalculationResults;
  lockedVacancyPercent: number;
}

export default function ProUpgradeCTA({ market, basic, results, lockedVacancyPercent }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const msg = (key: Parameters<typeof t>[1]) => t(market.language, key);
  const price = market.pricing.reportPrice;
  const priceLabel = formatPriceLabel(price.amount, price.currency, market.locale);

  const handleClick = async () => {
    const props = buildAnalyticsProps(market.slug, basic, results);
    track('pro_upgrade_clicked', props);
    track('pro_checkout_started', props);
    setLoading(true);
    setError(null);
    try {
      saveBasicScenario(market.slug, basic);
      const { input } = runFullProAnalysis({ ...basic, marketSlug: market.slug });
      saveScenario(market.slug, input);
      await startCheckout(market.slug, 'pro_report');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error');
      setLoading(false);
    }
  };

  return (
    <div id="pro-cta" className="space-y-6">
      <section className="rounded-xl border border-brand-200 bg-brand-50/60 p-6">
        <h2 className="text-xl font-semibold text-slate-900">{msg('simulator.unlockFull')} — {priceLabel}</h2>
        <p className="mt-2 text-sm text-slate-600">
          {msg('simulator.vacancyUpgradeCopy').replace(
            '{rate}',
            formatPercentValue(lockedVacancyPercent, market.locale, 1),
          )}
        </p>
        <button
          type="button"
          onClick={handleClick}
          disabled={loading}
          className="mt-4 rounded-lg bg-brand-600 px-6 py-3 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-60"
        >
          {loading ? 'Redirigiendo…' : `${msg('simulator.unlockFull')} — ${priceLabel}`}
        </button>
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      </section>

      <ProReportSalesSection market={market} />
    </div>
  );
}
