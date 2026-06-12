'use client';

import type { MarketConfig } from '@/config/types';
import { getProReportPageCopy } from '@/i18n/proReportCopy';
import { formatPriceLabel } from '@/lib/currency';
import { marketPath } from '@/i18n/routes';
import { ProReportVisual } from './ProReportVisuals';
import MarketPricingCTA from './MarketPricingCTA';

interface Props {
  market: MarketConfig;
}

export default function ProReportShowcasePage({ market }: Props) {
  const copy = getProReportPageCopy(market.language);
  const priceLabel = formatPriceLabel(
    market.pricing.reportPrice.amount,
    market.pricing.reportPrice.currency,
    market.locale,
  );

  return (
    <div className="space-y-0">
      <section className="relative -mx-4 overflow-hidden rounded-2xl bg-gradient-to-br from-brand-700 via-brand-600 to-brand-800 px-6 py-14 text-white md:-mx-0 md:px-12 md:py-20">
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-brand-400/30 blur-2xl" />
        <div className="relative mx-auto max-w-3xl text-center">
          <span className="inline-block rounded-full bg-white/15 px-4 py-1 text-xs font-semibold uppercase tracking-wider backdrop-blur">
            {copy.heroBadge}
          </span>
          <h1 className="mt-5 text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
            {copy.heroTitle}
          </h1>
          <p className="mt-4 text-lg text-brand-100">{copy.heroSubtitle}</p>
          <p className="mt-3 text-2xl font-bold">
            {priceLabel}{' '}
            <span className="text-base font-normal text-brand-200">· {copy.oneTimePayment}</span>
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href={marketPath(market.slug, 'simulator')}
              className="w-full rounded-xl bg-white px-8 py-3.5 text-center text-base font-bold text-brand-700 shadow-lg hover:bg-brand-50 sm:w-auto"
            >
              {copy.ctaPrimary}
            </a>
            <a
              href={marketPath(market.slug, 'simulator')}
              className="w-full rounded-xl border border-white/40 px-8 py-3.5 text-center text-base font-semibold text-white hover:bg-white/10 sm:w-auto"
            >
              {copy.ctaSecondary}
            </a>
          </div>
        </div>
      </section>

      <section className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
        {copy.trustStrip.map((s) => (
          <div key={s.label} className="rounded-xl border border-slate-200 bg-white p-4 text-center shadow-sm">
            <p className="text-2xl font-bold text-brand-700">{s.value}</p>
            <p className="mt-1 text-xs text-slate-600">{s.label}</p>
          </div>
        ))}
      </section>

      <div className="mt-16 space-y-20">
        {copy.sections.map((section, index) => {
          const reversed = index % 2 === 1;
          return (
            <section
              key={section.id}
              className={`grid items-center gap-10 lg:grid-cols-2 ${reversed ? 'lg:[direction:rtl]' : ''}`}
            >
              <div className={reversed ? 'lg:[direction:ltr]' : ''}>
                <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">{copy.sectionLabel}</p>
                <h2 className="mt-2 flex items-center gap-2 text-2xl font-bold text-slate-900 md:text-3xl">
                  <span aria-hidden>{section.icon}</span>
                  {section.title}
                </h2>
                <p className="mt-2 text-lg font-medium text-brand-700">{section.tagline}</p>
                <p className="mt-3 leading-relaxed text-slate-600">{section.description}</p>
              </div>
              <div className={`relative ${reversed ? 'lg:[direction:ltr]' : ''}`}>
                <p className="mb-3 text-center text-[10px] font-semibold uppercase tracking-wider text-slate-400 lg:text-left">
                  {copy.exampleLabel}
                </p>
                <div className="relative">
                  <div className="absolute -inset-3 rounded-2xl bg-gradient-to-br from-brand-100 to-slate-100 opacity-60" />
                  <div className="relative">
                    <ProReportVisual type={section.visual} language={market.language} />
                  </div>
                </div>
              </div>
            </section>
          );
        })}
      </div>

      <section className="mt-20 rounded-2xl border border-brand-200 bg-gradient-to-b from-brand-50 to-white p-8 text-center md:p-12">
        <h2 className="text-2xl font-bold text-slate-900 md:text-3xl">{copy.finalTitle}</h2>
        <p className="mx-auto mt-3 max-w-xl text-slate-600">{copy.finalSubtitle}</p>
        <p className="mt-4 text-xl font-bold text-brand-700">{priceLabel}</p>
        <div className="mt-6 flex flex-col items-center gap-4">
          <MarketPricingCTA market={market} productType="pro_report" />
          <a href={marketPath(market.slug, 'pricing')} className="text-sm font-medium text-brand-600 hover:underline">
            {copy.viewAllPlans}
          </a>
        </div>
      </section>
    </div>
  );
}
