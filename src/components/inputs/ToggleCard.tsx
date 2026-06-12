'use client';

interface Props {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export default function ToggleCard({ label, description, checked, onChange }: Props) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`flex w-full items-center justify-between rounded-xl border p-4 text-left transition-colors ${
        checked ? 'border-brand-300 bg-brand-50' : 'border-slate-200 bg-white hover:border-slate-300'
      }`}
    >
      <div>
        <p className="font-medium text-slate-900">{label}</p>
        {description && <p className="mt-0.5 text-xs text-slate-500">{description}</p>}
      </div>
      <span
        className={`relative inline-flex h-7 w-12 shrink-0 rounded-full transition-colors ${
          checked ? 'bg-brand-600' : 'bg-slate-300'
        }`}
        aria-hidden
      >
        <span
          className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition-transform ${
            checked ? 'translate-x-5' : 'translate-x-0.5'
          }`}
        />
      </span>
    </button>
  );
}
