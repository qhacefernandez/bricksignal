import type { ViabilityStatus } from '@/lib/types';
import { viabilityBg, viabilityColor, viabilityDot } from '@/lib/format';

interface Props {
  status: ViabilityStatus;
  label: string;
  reason: string;
}

export default function BasicViabilityBadge({ status, label, reason }: Props) {
  return (
    <div className={`flex items-start gap-2 rounded-lg px-3 py-2 ${viabilityBg(status)}`}>
      <span className={`mt-1 h-3 w-3 shrink-0 rounded-full ${viabilityDot(status)}`} />
      <div>
        <p className={`text-sm font-semibold uppercase ${viabilityColor(status)}`}>{label}</p>
        <p className="text-xs text-slate-600">{reason}</p>
      </div>
    </div>
  );
}
