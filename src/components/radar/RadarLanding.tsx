import AuthorizedDataNotice from './AuthorizedDataNotice';

export default function RadarLanding() {
  return (
    <div className="space-y-10">
      <section className="text-center">
        <p className="text-sm font-semibold uppercase tracking-wider text-brand-600">
          Radar oportunidades inmobiliarias
        </p>
        <h1 className="mx-auto mt-4 max-w-3xl text-4xl font-bold tracking-tight text-slate-900">
          Encuentra inmuebles que encajan con tu rentabilidad objetivo.
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
          Configura tu presupuesto, hipoteca, cashflow mínimo y zona. Radar ordena oportunidades por
          rentabilidad, riesgo y margen de seguridad.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href="/radar/demo"
            className="rounded-lg bg-brand-600 px-6 py-3 text-base font-semibold text-white hover:bg-brand-700"
          >
            Probar demo con datos de ejemplo
          </a>
          <a
            href="/radar/waitlist"
            className="rounded-lg border border-slate-300 bg-white px-6 py-3 text-base font-semibold text-slate-700 hover:bg-slate-50"
          >
            Unirme a la lista de espera de Radar
          </a>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        {[
          'Ahorra horas revisando anuncios manualmente.',
          'Filtra por números, no por intuición.',
          'Detecta oportunidades que cumplen tu cashflow objetivo.',
          'Compara escenarios antes de visitar.',
          'Recibe alertas cuando aparezcan inmuebles compatibles.',
        ].map((benefit) => (
          <div key={benefit} className="flex gap-3 rounded-xl border border-slate-200 bg-white p-5">
            <span className="text-brand-600">✓</span>
            <p className="text-slate-700">{benefit}</p>
          </div>
        ))}
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-8">
        <h2 className="text-xl font-bold text-slate-900">Buscar pisos rentables para alquilar</h2>
        <p className="mt-2 text-slate-600">
          Radar te ayuda a encontrar inmuebles con cashflow positivo según tus hipótesis. Compatible con
          fuentes autorizadas y análisis manual. Puedes estudiar cualquier piso que encuentres y pasarlo al{' '}
          <a href="/simulador" className="text-brand-600 underline">
            simulador
          </a>
          .
        </p>
        <p className="mt-3 text-sm text-slate-500">
          Alertas de inversión inmobiliaria · Ranking por rentabilidad · Calculadora rentabilidad alquiler
          integrada
        </p>
      </section>

      <AuthorizedDataNotice />

      <section className="flex flex-wrap gap-4 text-sm">
        <a href="/radar/precios" className="font-semibold text-brand-600 underline">
          Ver planes y precios →
        </a>
        <a href="/radar/legal-data" className="text-slate-600 underline">
          Política de datos Radar
        </a>
      </section>
    </div>
  );
}
