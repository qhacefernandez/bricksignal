import type { ViabilityStatus } from '@/lib/types';
import { viabilityBg, viabilityColor, viabilityDot } from '@/lib/format';

interface Props {
  status: ViabilityStatus;
  label: string;
  proHint?: string;
}

export default function BasicViabilityBadge({ status, label, proHint }: Props) {
  return (
    <div className={`flex items-start gap-2 rounded-lg px-3 py-2 ${viabilityBg(status)}`}>
      <span className={`mt-1 h-3 w-3 shrink-0 rounded-full ${viabilityDot(status)}`} />
      <div>
        <p className={`text-sm font-semibold uppercase ${viabilityColor(status)}`}>{label}</p>
        {proHint && <p className="mt-1 text-xs text-slate-600">{proHint}</p>}
      </div>
    </div>
  );
}
