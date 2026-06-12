'use client';

import { useState } from 'react';
import type { MarketConfig } from '@/config/types';
import { track } from '@/lib/analytics';
import { t } from '@/i18n/messages';
import { ENABLE_RADAR_EARLY_ACCESS } from '@/config/featureFlags';
import RegionSearchSelect from '../inputs/RegionSearchSelect';

export default function MarketWaitlistForm({ market }: { market: MarketConfig }) {
  const [done, setDone] = useState(false);
  const [city, setCity] = useState(market.defaultRegion);
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
      <input type="hidden" name="city" value={city} />
      <p className="hidden"><label>No: <input name="bot-field" /></label></p>
      <h1 className="text-2xl font-bold">{msg('waitlist.title')} — {market.nativeName}</h1>

      <label className="block text-sm">
        <span className="font-medium">{msg('waitlist.email')}</span>
        <input name="email" type="email" required className="mt-1 w-full rounded-lg border px-3 py-2" />
      </label>

      <RegionSearchSelect market={market} value={city} onChange={setCity} label={msg('waitlist.city')} />

      <label className="block text-sm">
        <span className="font-medium">{msg('waitlist.maxBudget')}</span>
        <input name="max_budget" type="number" required className="mt-1 w-full rounded-lg border px-3 py-2" />
      </label>
      <label className="block text-sm">
        <span className="font-medium">{msg('waitlist.availableCash')}</span>
        <input name="available_cash" type="number" required className="mt-1 w-full rounded-lg border px-3 py-2" />
      </label>
      <label className="block text-sm">
        <span className="font-medium">{msg('waitlist.minGrossYield')}</span>
        <input name="min_gross_yield" type="number" step="0.1" required className="mt-1 w-full rounded-lg border px-3 py-2" />
      </label>
      <label className="block text-sm">
        <span className="font-medium">{msg('waitlist.minCashflow')}</span>
        <input name="min_cashflow" type="number" required className="mt-1 w-full rounded-lg border px-3 py-2" />
      </label>
      <label className="block text-sm">
        <span className="font-medium">{msg('waitlist.strategy')}</span>
        <select name="strategy" className="mt-1 w-full rounded-lg border px-3 py-2">
          <option value="long_term_rental">{msg('waitlist.strategyLongTerm')}</option>
          <option value="room_rental">{msg('waitlist.strategyRoom')}</option>
          <option value="renovate_and_rent">{msg('waitlist.strategyRenovate')}</option>
        </select>
      </label>
      <label className="flex gap-2 text-xs">
        <input type="checkbox" name="consent" required />
        <span>{msg('waitlist.consent')} *</span>
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
