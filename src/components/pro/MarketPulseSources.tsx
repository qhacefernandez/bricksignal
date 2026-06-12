import type { MarketPulseSource } from '@/lib/marketPulse/types';

interface Props {
  sources: MarketPulseSource[];
}

export default function MarketPulseSources({ sources }: Props) {
  if (!sources.length) return null;
  return (
    <div>
      <h4 className="mb-2 text-sm font-semibold text-slate-800">Fuentes</h4>
      <ul className="space-y-2 text-sm text-slate-600">
        {sources.map((s) => (
          <li key={`${s.publisher}-${s.name}`} className="rounded-lg bg-slate-50 px-3 py-2">
            <span className="font-medium">{s.name}</span> — {s.publisher} ({s.date})
            {s.url && (
              <a href={s.url} target="_blank" rel="noopener noreferrer" className="ml-1 text-brand-600 underline">
                enlace
              </a>
            )}
            <span className="ml-1 text-xs text-slate-400">[{s.accessType}]</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
