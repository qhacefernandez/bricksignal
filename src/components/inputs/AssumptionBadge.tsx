interface Props {
  label: string;
  value: string;
  proOnly?: boolean;
}

export default function AssumptionBadge({ label, value, proOnly }: Props) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm">
      <span className="text-slate-600">{label}</span>
      <span className="font-medium text-slate-900">
        {value}
        {proOnly && <span className="ml-2 text-xs font-normal text-brand-600">PRO</span>}
      </span>
    </div>
  );
}
