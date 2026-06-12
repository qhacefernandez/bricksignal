import type { MarketPulseNarrative as Narrative } from '@/lib/marketPulse/types';

interface Props {
  narrative: Narrative;
  geographyName: string;
}

export default function MarketPulseNarrativeBlock({ narrative, geographyName }: Props) {
  return (
    <div className="space-y-4">
      <div>
        <h4 className="font-semibold text-slate-900">{narrative.headline}</h4>
        <p className="mt-1 text-sm text-slate-600">{narrative.summary}</p>
        <p className="mt-1 text-xs text-slate-500">Geografía: {geographyName}</p>
      </div>
      {narrative.positives.length > 0 && (
        <div>
          <p className="text-sm font-medium text-emerald-800">Positivos</p>
          <ul className="mt-1 list-inside list-disc text-sm text-slate-600">
            {narrative.positives.map((p) => <li key={p}>{p}</li>)}
          </ul>
        </div>
      )}
      {narrative.risks.length > 0 && (
        <div>
          <p className="text-sm font-medium text-amber-800">Riesgos</p>
          <ul className="mt-1 list-inside list-disc text-sm text-slate-600">
            {narrative.risks.map((r) => <li key={r}>{r}</li>)}
          </ul>
        </div>
      )}
      {narrative.watchlist.length > 0 && (
        <div>
          <p className="text-sm font-medium text-slate-800">Puntos a vigilar</p>
          <ul className="mt-1 list-inside list-disc text-sm text-slate-600">
            {narrative.watchlist.map((w) => <li key={w}>{w}</li>)}
          </ul>
        </div>
      )}
    </div>
  );
}
