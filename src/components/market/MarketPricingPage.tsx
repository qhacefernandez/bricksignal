'use client';

import { useState } from 'react';
import type { MarketConfig } from '@/config/types';
import { formatPriceLabel } from '@/lib/currency';
import { t } from '@/i18n/messages';
import { getPricingPageCopy } from '@/i18n/pricingCopy';
import { marketPath } from '@/i18n/routes';
import { ENABLE_RADAR_EARLY_ACCESS } from '@/config/featureFlags';
import MarketPricingCTA from './MarketPricingCTA';

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-slate-200 last:border-0">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between py-4 text-left text-sm font-semibold text-slate-900"
      >
        {q}
        <span className="ml-4 shrink-0 text-brand-600">{open ? '−' : '+'}</span>
      </button>
      {open && <p className="pb-4 text-sm leading-relaxed text-slate-600">{a}</p>}
    </div>
  );
}

export default function MarketPricingPage({ market }: { market: MarketConfig }) {
  const copy = getPricingPageCopy(market.language);
  const msg = (key: Parameters<typeof t>[1]) => t(market.language, key);
  const reportPrice = formatPriceLabel(
    market.pricing.reportPrice.amount,
    market.pricing.reportPrice.currency,
    market.locale,
  );
  const freePrice = formatPriceLabel(0, market.currency, market.locale);
  const radarBasic = market.pricing.radarBasic
    ? `${formatPriceLabel(market.pricing.radarBasic.amount, market.pricing.radarBasic.currency, market.locale)}${msg('pricing.perMonth')}`
    : null;

  return (
    <div className="space-y-16">
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-brand-900 px-6 py-14 text-white md:px-12">
        <div className="pointer-events-none absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-brand-600/20 to-transparent" />
        <div className="relative mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-brand-300">
            {market.nativeName}
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
            {copy.heroTitle}
          </h1>
          <p className="mt-4 text-lg text-slate-300">{copy.heroSubtitle}</p>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-3 lg:items-stretch">
        <div className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">{copy.freeName}</p>
          <p className="mt-2 text-4xl font-bold text-slate-900">{freePrice}</p>
          <p className="mt-1 text-sm text-slate-500">{copy.freeSubtitle}</p>
          <ul className="mt-6 flex-1 space-y-3">
            {copy.freeFeatures.map((f) => (
              <li key={f} className="flex items-start gap-2 text-sm text-slate-700">
                <span className="mt-0.5 text-signal-green">✓</span>
                {f}
              </li>
            ))}
          </ul>
          <a
            href={marketPath(market.slug, 'simulator')}
            className="mt-8 block rounded-xl border-2 border-slate-200 py-3 text-center text-sm font-bold text-slate-800 hover:bg-slate-50"
          >
            {msg('cta.calculate')}
          </a>
        </div>

        <div className="relative flex flex-col rounded-2xl border-2 border-brand-500 bg-white p-6 shadow-xl lg:scale-[1.02]">
          <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-brand-600 px-4 py-1 text-xs font-bold uppercase tracking-wide text-white">
            {copy.proBadge}
          </span>
          <p className="text-sm font-semibold text-brand-600">{msg('pricing.report')}</p>
          <p className="mt-2 text-4xl font-bold text-slate-900">{reportPrice}</p>
          <p className="mt-1 text-sm text-slate-500">{copy.proSubtitle}</p>
          <ul className="mt-6 flex-1 space-y-3">
            {copy.proFeatures.map((f) => (
              <li key={f} className="flex items-start gap-2 text-sm text-slate-700">
                <span className="mt-0.5 font-bold text-brand-600">✓</span>
                {f}
              </li>
            ))}
          </ul>
          <div className="mt-8 space-y-3">
            <MarketPricingCTA market={market} productType="pro_report" />
            <a
              href={marketPath(market.slug, 'proReport')}
              className="block text-center text-sm font-semibold text-brand-600 hover:underline"
            >
              {copy.proViewSections}
            </a>
          </div>
        </div>

        <div className="flex flex-col rounded-2xl border border-dashed border-slate-300 bg-slate-50/80 p-6">
          <p className="text-sm font-semibold text-slate-500">Radar</p>
          <p className="mt-2 text-4xl font-bold text-slate-400">
            {radarBasic ?? copy.radarComingSoon}
          </p>
          <p className="mt-1 text-sm text-slate-500">{copy.radarSubtitle}</p>
          <ul className="mt-6 flex-1 space-y-3 text-sm text-slate-500">
            {copy.radarFeatures.map((f) => (
              <li key={f} className="flex gap-2"><span>◇</span> {f}</li>
            ))}
          </ul>
          {ENABLE_RADAR_EARLY_ACCESS ? (
            <div className="mt-8">
              <MarketPricingCTA market={market} productType="radar_basic" />
            </div>
          ) : (
            <a
              href={marketPath(market.slug, 'radarWaitlist')}
              className="mt-8 block rounded-xl border border-slate-300 bg-white py-3 text-center text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              {msg('waitlist.earlyAccess')}
            </a>
          )}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <h2 className="text-center text-xl font-bold text-slate-900">{copy.comparisonTitle}</h2>
        <p className="mt-2 text-center text-sm text-slate-500">{copy.comparisonSubtitle}</p>
        <div className="mt-8 overflow-x-auto">
          <table className="w-full min-w-[320px] text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left">
                <th className="pb-3 font-semibold text-slate-700">{copy.comparisonFeatureCol}</th>
                <th className="pb-3 text-center font-semibold text-slate-500">{copy.comparisonFreeCol}</th>
                <th className="pb-3 text-center font-semibold text-brand-700">{copy.comparisonProCol}</th>
              </tr>
            </thead>
            <tbody>
              {copy.comparisonRows.map((row) => (
                <tr key={row.feature} className="border-b border-slate-100">
                  <td className="py-3 text-slate-700">{row.feature}</td>
                  <td className="py-3 text-center">
                    {row.free ? <span className="text-signal-green">✓</span> : <span className="text-slate-300">—</span>}
                  </td>
                  <td className="py-3 text-center">
                    {row.pro ? <span className="font-bold text-brand-600">✓</span> : <span className="text-slate-300">—</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-8 text-center">
          <a
            href={marketPath(market.slug, 'proReport')}
            className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-6 py-3 text-sm font-bold text-white hover:bg-brand-700"
          >
            {copy.comparisonCta}
          </a>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        {copy.valueProps.map((item) => (
          <div key={item.title} className="rounded-xl border border-slate-200 bg-white p-6 text-center shadow-sm">
            <span className="text-3xl" aria-hidden>{item.icon}</span>
            <h3 className="mt-3 font-bold text-slate-900">{item.title}</h3>
            <p className="mt-2 text-sm text-slate-600">{item.text}</p>
          </div>
        ))}
      </section>

      <section className="mx-auto max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 md:p-8">
        <h2 className="text-center text-xl font-bold text-slate-900">{copy.faqTitle}</h2>
        <div className="mt-6">
          {copy.faq.map((item) => (
            <FaqItem key={item.q} q={item.q} a={item.a} />
          ))}
        </div>
      </section>

      <section className="rounded-2xl bg-brand-600 px-6 py-10 text-center text-white md:py-14">
        <h2 className="text-2xl font-bold">{copy.bottomTitle}</h2>
        <p className="mx-auto mt-3 max-w-lg text-brand-100">
          {copy.bottomSubtitle.replace('{price}', reportPrice)}
        </p>
        <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href={marketPath(market.slug, 'simulator')}
            className="rounded-xl bg-white px-8 py-3 font-bold text-brand-700 hover:bg-brand-50"
          >
            {copy.bottomSimulator}
          </a>
          <a
            href={marketPath(market.slug, 'proReport')}
            className="rounded-xl border border-white/50 px-8 py-3 font-semibold hover:bg-white/10"
          >
            {copy.bottomViewReport}
          </a>
        </div>
      </section>
    </div>
  );
}
