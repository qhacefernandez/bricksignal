'use client';

import type { MarketConfig } from '@/config/types';
import { formatPriceLabel } from '@/lib/currency';
import { getProReportPageCopy } from '@/i18n/proReportCopy';
import { t } from '@/i18n/messages';
import { marketPath } from '@/i18n/routes';

interface Props {
  market: MarketConfig;
  compact?: boolean;
}

export default function ProReportSalesSection({ market, compact = false }: Props) {
  const copy = getProReportPageCopy(market.language);
  const msg = (key: Parameters<typeof t>[1]) => t(market.language, key);
  const priceLabel = formatPriceLabel(
    market.pricing.reportPrice.amount,
    market.pricing.reportPrice.currency,
    market.locale,
  );

  return (
    <section id="pro-report-sales" className="rounded-xl border border-brand-200 bg-gradient-to-b from-brand-50/80 to-white p-6">
      <div className="max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">{copy.heroBadge}</p>
        <h2 className="mt-1 text-xl font-semibold text-slate-900">
          {copy.salesTitle.replace('{price}', priceLabel)}
        </h2>
        <p className="mt-2 text-sm text-slate-600">{copy.salesSubtitle}</p>
      </div>

      <div className={`mt-6 grid gap-4 ${compact ? 'sm:grid-cols-2' : 'lg:grid-cols-2'}`}>
        {copy.sections.map((section) => (
          <article
            key={section.id}
            className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
          >
            <h3 className="flex items-center gap-2 font-semibold text-slate-900">
              <span aria-hidden>{section.icon}</span>
              {section.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">{section.description}</p>
          </article>
        ))}
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-4">
        <a
          href={marketPath(market.slug, 'proReport')}
          className="text-sm font-semibold text-brand-600 hover:underline"
        >
          {copy.viewVisualExamples}
        </a>
        <p className="text-xs text-slate-500">{msg('disclaimer.main')}</p>
      </div>
    </section>
  );
}
