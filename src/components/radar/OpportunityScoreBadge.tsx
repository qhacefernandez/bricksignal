import type { RiskLevel } from '@/lib/listings/types';

interface OpportunityScoreBadgeProps {
  score: number;
  riskLevel: RiskLevel;
}

const riskStyles: Record<RiskLevel, string> = {
  low: 'bg-green-100 text-green-800 border-green-200',
  medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  high: 'bg-red-100 text-red-800 border-red-200',
};

const riskLabels: Record<RiskLevel, string> = {
  low: 'Riesgo bajo',
  medium: 'Riesgo medio',
  high: 'Riesgo alto',
};

export default function OpportunityScoreBadge({ score, riskLevel }: OpportunityScoreBadgeProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="inline-flex items-center rounded-full bg-brand-100 px-2.5 py-0.5 text-sm font-bold text-brand-800">
        {score}/100
      </span>
      <span className={`inline-flex rounded-full border px-2 py-0.5 text-xs font-medium ${riskStyles[riskLevel]}`}>
        {riskLabels[riskLevel]}
      </span>
    </div>
  );
}
