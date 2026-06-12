'use client';

interface Option<T extends string> {
  value: T;
  label: string;
}

interface Props<T extends string> {
  label: string;
  value: T;
  options: Option<T>[];
  onChange: (value: T) => void;
}

export default function SegmentedControl<T extends string>({
  label,
  value,
  options,
  onChange,
}: Props<T>) {
  return (
    <div>
      <p className="mb-2 text-sm font-medium text-slate-700">{label}</p>
      <div className="flex flex-wrap gap-2" role="group" aria-label={label}>
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            aria-pressed={value === opt.value}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              value === opt.value
                ? 'bg-brand-600 text-white'
                : 'border border-slate-200 bg-white text-slate-700 hover:border-slate-300'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
