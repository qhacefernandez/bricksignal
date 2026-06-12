'use client';

import { MARKETS } from '@/config/markets';
import type { MarketSlug } from '@/config/types';
import { track } from '@/lib/analytics';
import { loadPreferredMarket, savePreferredMarket } from '@/lib/market';

interface MarketSelectorProps {
  currentMarket: MarketSlug;
  compact?: boolean;
}

export default function MarketSelector({ currentMarket, compact = false }: MarketSelectorProps) {
  const handleChange = (slug: MarketSlug) => {
    savePreferredMarket(slug);
    track('market_selected', { marketSlug: slug });
    const path = window.location.pathname.replace(/^\/[a-z]{2}/, `/${slug}`);
    window.location.href = path === window.location.pathname ? `/${slug}/` : path;
  };

  if (compact) {
    return (
      <select
        value={currentMarket}
        onChange={(e) => handleChange(e.target.value as MarketSlug)}
        className="rounded-lg border border-slate-300 px-2 py-1 text-sm"
        aria-label="Select country"
      >
        {MARKETS.map((m) => (
          <option key={m.slug} value={m.slug}>
            {m.nativeName}
          </option>
        ))}
      </select>
    );
  }

  const preferred = typeof window !== 'undefined' ? loadPreferredMarket() : currentMarket;

  return (
    <select
      value={currentMarket}
      onChange={(e) => handleChange(e.target.value as MarketSlug)}
      className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700"
      aria-label="Select country"
    >
      {MARKETS.map((m) => (
        <option key={m.slug} value={m.slug}>
          {m.nativeName} ({m.currency}){m.slug === preferred ? ' ★' : ''}
        </option>
      ))}
    </select>
  );
}
