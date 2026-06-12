'use client';

import { useState } from 'react';
import type { MarketConfig } from '@/config/types';
import type { BasicSimulatorInput } from '@/lib/calculations/basic';
import { formatPriceLabel } from '@/lib/currency';
import { runFullProAnalysis } from '@/lib/calculations/pro';
import { saveBasicScenario, saveScenario, startCheckout } from '@/lib/marketStorage';
import { formatExceptionsLabel, getScenarioWarningCopy } from '@/i18n/scenarioWarningCopy';
import { track } from '@/lib/analytics';
import type { ScenarioChangeWarning } from '@/hooks/useInvestmentScenario';

interface Props {
  market: MarketConfig;
  basic: BasicSimulatorInput;
  warning: ScenarioChangeWarning;
  onSameSimulation: () => void;
  onRevert: () => void;
  onUseCredit?: () => void;
}

export default function ProScenarioChangeWarning({
  market,
  basic,
  warning,
  onSameSimulation,
  onRevert,
  onUseCredit,
}: Props) {
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const copy = getScenarioWarningCopy(market.language);
  const priceLabel = formatPriceLabel(
    market.pricing.reportPrice.amount,
    market.pricing.reportPrice.currency,
    market.locale,
  );
  const canUseException = warning.exceptionsRemaining > 0;

  const handleCheckout = async () => {
    setCheckoutLoading(true);
    track('pro_upgrade_clicked', { marketSlug: market.slug, source: 'scenario_change_warning' });
    try {
      saveBasicScenario(market.slug, basic);
      const { input } = runFullProAnalysis({ ...basic, marketSlug: market.slug });
      saveScenario(market.slug, input);
      await startCheckout(market.slug, 'pro_report');
    } catch {
      setCheckoutLoading(false);
    }
  };

  return (
    <div role="alert" className="rounded-xl border border-amber-300 bg-amber-50 p-5 shadow-sm">
      <div className="flex gap-3">
        <span className="text-xl" aria-hidden>⚠️</span>
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-amber-950">{copy.title}</h3>
          <p className="mt-1 text-sm text-amber-900">
            {warning.reportsRemaining > 0 ? copy.bodyWithCredit : copy.bodyNoCredit}
          </p>
          <p className="mt-2 text-xs text-amber-800">
            {formatExceptionsLabel(copy, warning.exceptionsRemaining)}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={onSameSimulation}
              disabled={!canUseException}
              className="rounded-lg border border-amber-400 bg-white px-4 py-2 text-sm font-semibold text-amber-950 hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {copy.sameSimulation}
            </button>
            {warning.reportsRemaining > 0 && onUseCredit && (
              <button
                type="button"
                onClick={onUseCredit}
                className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
              >
                {copy.useCredit} ({warning.reportsRemaining} {copy.creditRemaining})
              </button>
            )}
            <button
              type="button"
              onClick={handleCheckout}
              disabled={checkoutLoading}
              className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-60"
            >
              {checkoutLoading ? copy.redirecting : `${copy.buyReport} — ${priceLabel}`}
            </button>
            <button
              type="button"
              onClick={onRevert}
              className="rounded-lg px-4 py-2 text-sm font-medium text-amber-900 underline-offset-2 hover:underline"
            >
              {copy.revert}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
