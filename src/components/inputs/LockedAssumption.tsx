'use client';

import { useEffect } from 'react';
import { track } from '@/lib/analytics';
import { getActivePricingVariant } from '@/config/pricing';
import type { MarketSlug } from '@/config/types';

interface Props {
  marketSlug: MarketSlug;
  label: string;
  value: string;
  help: string;
  proLabel?: string;
}

export default function LockedAssumption({
  marketSlug,
  label,
  value,
  help,
  proLabel = 'Disponible en PRO',
}: Props) {
  useEffect(() => {
    track('locked_assumption_viewed', {
      marketSlug,
      assumption: 'vacancy',
      pricingVariant: getActivePricingVariant(),
    });
    track('vacancy_locked_viewed', {
      marketSlug,
      defaultVacancyBucket: 'included',
      pricingVariant: getActivePricingVariant(),
    });
  }, [marketSlug]);

  return (
    <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50/80 p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-800">{label}</p>
          <p className="mt-1 text-lg font-semibold text-slate-900">{value}</p>
        </div>
        <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-slate-200 px-2.5 py-1 text-xs font-medium text-slate-700">
          <span aria-hidden>🔒</span> {proLabel}
        </span>
      </div>
      <p className="mt-2 text-xs text-slate-500">{help}</p>
    </div>
  );
}
