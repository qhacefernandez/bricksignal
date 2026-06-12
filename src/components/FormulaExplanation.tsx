interface FormulaExplanationProps {
  compact?: boolean;
}

const formulas = [
  {
    name: 'Rentabilidad bruta',
    formula: 'Alquiler anual bruto ÷ Precio de compra',
    note: 'No incluye gastos ni financiación.',
  },
  {
    name: 'Rentabilidad neta',
    formula: 'NOI ÷ Coste total de adquisición',
    note: 'NOI = ingresos efectivos − gastos operativos.',
  },
  {
    name: 'Cashflow mensual',
    formula: '(NOI − Servicio de deuda − Impuestos) ÷ 12',
    note: 'Impuestos solo si el cashflow anual es positivo.',
  },
  {
    name: 'DSCR',
    formula: 'NOI ÷ Servicio anual de deuda',
    note: '≥ 1,25 suele considerarse cómodo; < 1,0 es riesgoso.',
  },
];

export default function FormulaExplanation({ compact = false }: FormulaExplanationProps) {
  if (compact) return null;

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5">
      <h3 className="mb-3 text-lg font-semibold text-slate-900">Cómo leemos las métricas</h3>
      <dl className="space-y-3">
        {formulas.map((f) => (
          <div key={f.name}>
            <dt className="font-medium text-slate-800">{f.name}</dt>
            <dd className="text-sm text-slate-600">
              <code className="rounded bg-slate-100 px-1">{f.formula}</code>
              <span className="mt-1 block">{f.note}</span>
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
