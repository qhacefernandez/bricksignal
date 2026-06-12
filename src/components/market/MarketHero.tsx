import type { MarketConfig } from '@/config/types';
import { t } from '@/i18n/messages';
import { marketPath } from '@/i18n/routes';

interface MarketHeroProps {
  market: MarketConfig;
}

export default function MarketHero({ market }: MarketHeroProps) {
  const msg = (key: Parameters<typeof t>[1]) => t(market.language, key);

  return (
    <section className="py-8 text-center md:py-12">
      <p className="text-sm font-semibold uppercase tracking-wider text-brand-600">{market.nativeName}</p>
      <h1 className="mx-auto mt-4 max-w-3xl text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
        {msg('hero.title')}
      </h1>
      <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">{msg('hero.subtitle')}</p>
      <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <a
          href={marketPath(market.slug, 'simulator')}
          className="rounded-lg bg-brand-600 px-6 py-3 text-base font-semibold text-white hover:bg-brand-700"
        >
          {msg('cta.calculate')}
        </a>
        <a
          href={marketPath(market.slug, 'proReport')}
          className="rounded-lg border border-brand-300 bg-white px-6 py-3 text-base font-semibold text-brand-700 hover:bg-brand-50"
        >
          {msg('nav.proReport')}
        </a>
        {market.features.radarLanding && (
          <a
            href={marketPath(market.slug, 'radar')}
            className="rounded-lg border border-slate-300 bg-white px-6 py-3 text-base font-semibold text-slate-700 hover:bg-slate-50"
          >
            Radar Pro
          </a>
        )}
      </div>
    </section>
  );
}
