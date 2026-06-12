'use client';

import { useEffect } from 'react';
import type { MarketConfig } from '@/config/types';
import { track } from '@/lib/analytics';
import { t } from '@/i18n/messages';
import { marketPath } from '@/i18n/routes';
import AuthorizedDataNotice from '../radar/AuthorizedDataNotice';

export default function MarketRadarLanding({ market }: { market: MarketConfig }) {
  const msg = (key: Parameters<typeof t>[1]) => t(market.language, key);

  useEffect(() => {
    track('radar_landing_viewed', { marketSlug: market.slug });
  }, [market.slug]);

  return (
    <div className="space-y-8">
      <section className="text-center">
        <h1 className="text-4xl font-bold">{msg('cta.radar')}</h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">{market.seo.keywords.join(' · ')}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {market.radar.demoEnabled && (
            <a href={marketPath(market.slug, 'radarDemo')} className="rounded-lg bg-brand-600 px-6 py-3 font-semibold text-white">Demo</a>
          )}
          {market.radar.waitlistEnabled && (
            <a href={marketPath(market.slug, 'radarWaitlist')} className="rounded-lg border px-6 py-3 font-semibold">{msg('waitlist.submit')}</a>
          )}
        </div>
      </section>
      <AuthorizedDataNotice />
    </div>
  );
}
