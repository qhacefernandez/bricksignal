import { DUE_DILIGENCE_CHECKLIST } from '@/lib/calculations';

export default function ProChecklist() {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5">
      <h4 className="mb-3 font-semibold text-slate-900">Checklist de due diligence</h4>
      <ol className="list-inside list-decimal space-y-2 text-sm text-slate-600">
        {DUE_DILIGENCE_CHECKLIST.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ol>
    </section>
  );
}
