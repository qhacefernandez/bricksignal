'use client';

export type ValueInputMode = 'percent' | 'absolute';

interface Props {
  mode: ValueInputMode;
  onChange: (mode: ValueInputMode) => void;
  percentLabel?: string;
  absoluteLabel?: string;
  id?: string;
}

export default function ValueModeToggle({
  mode,
  onChange,
  percentLabel = '%',
  absoluteLabel = '€/año',
  id = 'value-mode',
}: Props) {
  return (
    <div
      className="inline-flex rounded-lg border border-slate-200 bg-slate-100 p-0.5 text-xs font-medium"
      role="group"
      aria-label="Modo de valor"
    >
      <button
        type="button"
        id={`${id}-percent`}
        aria-pressed={mode === 'percent'}
        onClick={() => onChange('percent')}
        className={`rounded-md px-2.5 py-1 transition ${
          mode === 'percent' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
        }`}
      >
        {percentLabel}
      </button>
      <button
        type="button"
        id={`${id}-absolute`}
        aria-pressed={mode === 'absolute'}
        onClick={() => onChange('absolute')}
        className={`rounded-md px-2.5 py-1 transition ${
          mode === 'absolute' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
        }`}
      >
        {absoluteLabel}
      </button>
    </div>
  );
}
