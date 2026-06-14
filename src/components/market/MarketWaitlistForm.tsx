'use client';

import { useState } from 'react';
import type { MarketConfig } from '@/config/types';
import { track } from '@/lib/analytics';
import { t } from '@/i18n/messages';
import { marketPath } from '@/i18n/routes';
import { ENABLE_RADAR_EARLY_ACCESS } from '@/config/featureFlags';

export default function MarketWaitlistForm({ market }: { market: MarketConfig }) {
  const [done, setDone] = useState(false);
  const msg = (key: Parameters<typeof t>[1]) => t(market.language, key);

  if (done) {
    return <p className="text-center font-medium text-green-700">✓ {msg('waitlist.done')}</p>;
  }

  return (
    <form
      name="radar-waitlist"
      method="POST"
      data-netlify="true"
      netlify-honeypot="bot-field"
      className="mx-auto max-w-xl space-y-4 rounded-xl border bg-white p-6"
      onSubmit={() => {
        track('radar_waitlist_submitted', { marketSlug: market.slug, language: market.language });
        setDone(true);
      }}
    >
      <input type="hidden" name="form-name" value="radar-waitlist" />
      <input type="hidden" name="marketSlug" value={market.slug} />
      <input type="hidden" name="language" value={market.language} />
      <p className="hidden"><label>No: <input name="bot-field" /></label></p>
      <h1 className="text-2xl font-bold">{msg('waitlist.title')} — {market.nativeName}</h1>
      <p className="text-sm text-slate-600">{msg('waitlist.subtitle')}</p>

      <label className="block text-sm">
        <span className="font-medium">{msg('waitlist.email')} *</span>
        <input name="email" type="email" required className="mt-1 w-full rounded-lg border px-3 py-2" />
      </label>

      <label className="flex gap-2 text-xs">
        <input type="checkbox" name="consent" required />
        <span>
          {msg('waitlist.consent')}{' '}
          <a href={marketPath(market.slug, 'privacy')} className="text-brand-600 underline">
            {msg('waitlist.privacyLink')}
          </a>
          . *
        </span>
      </label>
      <button type="submit" className="w-full rounded-lg bg-brand-600 py-3 font-semibold text-white">
        {msg('waitlist.submit')}
      </button>
      {ENABLE_RADAR_EARLY_ACCESS && market.features.subscriptions && (
        <p className="text-center text-sm text-slate-500">
          {msg('waitlist.earlyAccess')} — {market.pricing.radarBasic?.amount} {market.currency}/mo
        </p>
      )}
    </form>
  );
}
