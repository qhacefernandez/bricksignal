'use client';

import { useEffect, useState } from 'react';
import { MARKETS } from '@/config/markets';
import { DEFAULT_MARKET_SLUG } from '@/config/featureFlags';
import type { MarketSlug } from '@/config/types';
import { marketSlugFromBrowserLocale, marketSlugFromCountryCode } from '@/lib/geoMarket';
import { hasExplicitPreferredMarket, loadPreferredMarket, savePreferredMarket } from '@/lib/market';
import { track } from '@/lib/analytics';
import { t } from '@/i18n/messages';

const GEO_CHECKED_KEY = 'bricksignal-geo-checked';

type Phase = 'detecting' | 'picker';

export default function HomeMarketPicker() {
  const [phase, setPhase] = useState<Phase>('detecting');
  const [suggestedSlug, setSuggestedSlug] = useState<MarketSlug>(DEFAULT_MARKET_SLUG);

  useEffect(() => {
    if (hasExplicitPreferredMarket()) {
      window.location.replace(`/${loadPreferredMarket()}/`);
      return;
    }

    if (sessionStorage.getItem(GEO_CHECKED_KEY) === '1') {
      setSuggestedSlug(marketSlugFromBrowserLocale() ?? DEFAULT_MARKET_SLUG);
      setPhase('picker');
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        const res = await fetch('/api/geo-market', { cache: 'no-store' });
        if (!res.ok) throw new Error('geo unavailable');
        const data = (await res.json()) as { country?: string | null };
        const slug = marketSlugFromCountryCode(data.country);
        sessionStorage.setItem(GEO_CHECKED_KEY, '1');
        if (cancelled) return;
        if (slug) {
          track('market_geo_redirect', {
            marketSlug: slug,
            ...(data.country ? { country: data.country } : {}),
          });
          window.location.replace(`/${slug}/`);
          return;
        }
        setSuggestedSlug(marketSlugFromBrowserLocale() ?? DEFAULT_MARKET_SLUG);
        setPhase('picker');
      } catch {
        sessionStorage.setItem(GEO_CHECKED_KEY, '1');
        if (cancelled) return;
        setSuggestedSlug(marketSlugFromBrowserLocale() ?? DEFAULT_MARKET_SLUG);
        setPhase('picker');
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleSelect = (slug: MarketSlug) => {
    savePreferredMarket(slug);
    track('market_selected', { marketSlug: slug, source: 'home_picker' });
  };

  if (phase === 'detecting') {
    return (
      <div className="mt-16 text-center">
        <p className="text-sm text-slate-500">{t('en', 'global.detectingMarket')}</p>
      </div>
    );
  }

  return (
    <>
      <p className="mt-2 text-sm text-slate-500">{t('en', 'global.chooseMarket')}</p>
      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {MARKETS.map((m) => (
          <a
            key={m.slug}
            href={`/${m.slug}/`}
            onClick={() => handleSelect(m.slug)}
            className={`rounded-xl border bg-white p-5 text-left transition hover:border-brand-400 hover:shadow-md ${
              m.slug === suggestedSlug ? 'border-brand-300 ring-1 ring-brand-200' : 'border-slate-200'
            }`}
          >
            <p className="font-semibold text-slate-900">{m.nativeName}</p>
            <p className="text-sm text-slate-500">
              {m.currency} · {m.locale}
            </p>
            {m.slug === suggestedSlug && (
              <span className="mt-2 inline-block text-xs font-medium text-brand-600">
                {t('en', 'global.recommended')}
              </span>
            )}
          </a>
        ))}
      </div>
    </>
  );
}
