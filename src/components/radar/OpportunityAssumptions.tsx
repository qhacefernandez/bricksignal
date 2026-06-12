interface OpportunityAssumptionsProps {
  assumptions: Record<string, string>;
}

export default function OpportunityAssumptions({ assumptions }: OpportunityAssumptionsProps) {
  return (
    <dl className="grid gap-2 text-sm sm:grid-cols-2">
      {Object.entries(assumptions).map(([key, value]) => (
        <div key={key} className="rounded bg-slate-50 px-3 py-2">
          <dt className="text-xs text-slate-500">{key}</dt>
          <dd className="font-medium text-slate-800">{value}</dd>
        </div>
      ))}
    </dl>
  );
}
