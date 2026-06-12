'use client';

import { useState } from 'react';
import type { MarketConfig } from '@/config/types';
import { track } from '@/lib/analytics';
import type { CalculationResults, SimulatorInput } from '@/lib/types';
import type { MarketPulseReport } from '@/lib/marketPulse/types';
import { t } from '@/i18n/messages';
import { canAccessProMetric, maskProValue, shouldShowProPreviewBlur } from '@/lib/proGating';

interface Props {
  market: MarketConfig;
  input: SimulatorInput;
  results: CalculationResults;
  proUnlocked: boolean;
  marketPulse?: (MarketPulseReport & { lastUpdatedLabel: string }) | null;
  vacancyPercent?: number;
}

export default function ProPdfReport({ market, input, results, proUnlocked, marketPulse }: Props) {
  const msg = (key: Parameters<typeof t>[1]) => t(market.language, key);
  const [downloading, setDownloading] = useState(false);
  const unlocked = canAccessProMetric(proUnlocked, 'pdf');
  const blur = shouldShowProPreviewBlur() && !unlocked;

  const handleDownload = async () => {
    if (!unlocked) return;
    setDownloading(true);
    try {
      track('pro_report_generated', { marketSlug: market.slug });
      const { generateProReportPdf } = await import('@/lib/pdf');
      generateProReportPdf(input, results, market, marketPulse ?? undefined);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <section className={`rounded-xl border border-dashed border-brand-300 bg-brand-50/40 p-5 ${blur ? 'relative overflow-hidden' : ''}`}>
      <div className={blur ? 'pointer-events-none select-none blur-sm' : ''}>
        <h4 className="font-semibold text-slate-900">{msg('simulator.downloadPdf')}</h4>
        <p className="mt-1 text-sm text-slate-600">
          Informe completo con métricas, proyecciones, sensibilidad y Market Pulse PRO.
        </p>
        <button
          type="button"
          onClick={handleDownload}
          disabled={!unlocked || downloading}
          className="mt-3 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-60"
        >
          {downloading ? 'Generando PDF…' : maskProValue(unlocked, msg('simulator.downloadPdf'))}
        </button>
      </div>
      {blur && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/75">
          <p className="text-sm font-medium text-slate-700">🔒 {msg('simulator.downloadPdf')} — {msg('simulator.availableInPro')}</p>
        </div>
      )}
    </section>
  );
}
