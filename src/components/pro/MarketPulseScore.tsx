import type { MarketPulseDirection } from '@/lib/marketPulse/types';

const DIRECTION_LABELS: Record<MarketPulseDirection, string> = {
  cooling: 'Enfriándose',
  stable: 'Estable',
  warming: 'Calentándose',
  hot: 'Caliente',
};

interface Props {
  score: number;
  direction: MarketPulseDirection;
  confidence: string;
  lastUpdatedLabel: string;
}

export default function MarketPulseScore({ score, direction, confidence, lastUpdatedLabel }: Props) {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <div className="rounded-xl bg-brand-50 px-5 py-3">
        <p className="text-xs font-medium uppercase text-slate-500">Score Market Pulse</p>
        <p className="text-3xl font-bold text-brand-700">{score}<span className="text-lg font-normal text-slate-500">/100</span></p>
      </div>
      <div>
        <p className="text-sm text-slate-600">Tendencia: <span className="font-semibold text-slate-900">{DIRECTION_LABELS[direction]}</span></p>
        <p className="text-sm text-slate-600">Confianza: <span className="font-medium capitalize">{confidence}</span></p>
        <p className="text-xs text-slate-500">{lastUpdatedLabel}</p>
      </div>
    </div>
  );
}
