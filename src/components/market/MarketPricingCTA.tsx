'use client';

import { useState } from 'react';
import type { MarketConfig, ProductType } from '@/config/types';
import { track } from '@/lib/analytics';
import { formatPriceLabel } from '@/lib/currency';
import { startCheckout } from '@/lib/marketStorage';
import { t } from '@/i18n/messages';

interface Props {
  market: MarketConfig;
  productType: ProductType;
}

export default function MarketPricingCTA({ market, productType }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const price = productType === 'pro_report' ? market.pricing.reportPrice : market.pricing.radarBasic;
  const label =
    productType === 'pro_report'
      ? `${t(market.language, 'cta.proReport')} — ${formatPriceLabel(market.pricing.reportPrice.amount, market.pricing.reportPrice.currency, market.locale)}`
      : t(market.language, 'waitlist.earlyAccess');

  const handleClick = async () => {
    track(productType === 'pro_report' ? 'pro_cta_clicked' : 'subscription_cta_clicked', {
      marketSlug: market.slug,
      productType,
    });
    setLoading(true);
    setError(null);
    try {
      await startCheckout(market.slug, productType);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error');
      setLoading(false);
    }
  };

  if (!price && productType !== 'pro_report') return null;

  return (
    <div>
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        className="w-full rounded-xl bg-brand-600 px-6 py-3.5 text-sm font-bold text-white shadow-md hover:bg-brand-700 disabled:opacity-60 sm:w-auto"
      >
        {loading ? '…' : label}
      </button>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}
