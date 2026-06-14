'use client';

import { useEffect } from 'react';
import type { MarketConfig } from '@/config/types';
import { track } from '@/lib/analytics';
import { getRadarPageCopy } from '@/i18n/radarCopy';
import { marketPath } from '@/i18n/routes';
import { RadarVisual } from './RadarVisuals';

interface Props {
  market: MarketConfig;
}

export default function RadarShowcasePage({ market }: Props) {
  const copy = getRadarPageCopy(market.language);
  const waitlistHref = marketPath(market.slug, 'radarWaitlist');

  useEffect(() => {
    track('radar_landing_viewed', { marketSlug: market.slug });
  }, [market.slug]);

  return (
    <div className="flex flex-col gap-14 md:gap-16 lg:gap-20">
      <div className="flex flex-col gap-8 md:gap-10">
        <section className="relative -mx-4 overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-brand-900 px-6 py-14 text-white md:-mx-0 md:px-12 md:py-20">
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-brand-500/20 blur-3xl" />
        <div className="relative mx-auto max-w-3xl text-center">
          <span className="inline-block rounded-full bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-wider">
            {copy.heroBadge}
          </span>
          <h1 className="mt-5 text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">{copy.heroTitle}</h1>
          <p className="mt-4 text-lg text-slate-300">{copy.heroSubtitle}</p>
          <div className="mt-8 flex justify-center">
            <a
              href={waitlistHref}
              className="w-full rounded-xl bg-brand-500 px-8 py-3.5 text-center text-base font-bold text-white shadow-lg hover:bg-brand-400 sm:w-auto"
            >
              {copy.ctaPrimary}
            </a>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-5">
        {copy.trustStrip.map((s) => (
          <div key={s.label} className="rounded-xl border border-slate-200 bg-white p-4 text-center shadow-sm">
            <p className="text-2xl font-bold text-brand-700">{s.value}</p>
            <p className="mt-1 text-xs text-slate-600">{s.label}</p>
          </div>
        ))}
      </section>
      </div>

      <div className="flex flex-col gap-16 md:gap-20">
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
                  <div className="absolute -inset-3 rounded-2xl bg-gradient-to-br from-slate-100 to-brand-50 opacity-70" />
                  <div className="relative">
                    <RadarVisual type={section.visual} language={market.language} />
                  </div>
                </div>
              </div>
            </section>
          );
        })}
      </div>

      <section className="rounded-2xl border border-brand-200 bg-gradient-to-b from-brand-50 to-white p-8 text-center md:p-12">
        <h2 className="text-2xl font-bold text-slate-900 md:text-3xl">{copy.finalTitle}</h2>
        <p className="mx-auto mt-3 max-w-xl text-slate-600">{copy.finalSubtitle}</p>
        <a
          href={waitlistHref}
          className="mt-8 inline-block rounded-xl bg-brand-600 px-10 py-3.5 text-base font-bold text-white shadow-md hover:bg-brand-700"
        >
          {copy.ctaPrimary}
        </a>
      </section>
    </div>
  );
}
