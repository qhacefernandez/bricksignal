'use client';

import { useState } from 'react';
import { getMarket } from '@/config/markets';
import { formatPriceLabel } from '@/lib/currency';
import { ENABLE_RADAR_EARLY_ACCESS } from '@/lib/flags';

const es = getMarket('es');
const REPORT_PRICE_LABEL = formatPriceLabel(
  es.pricing.reportPrice.amount,
  es.pricing.reportPrice.currency,
  es.locale,
);

const PLANS = [
  {
    name: 'Gratis',
    price: '0 €',
    period: '',
    features: ['Simulador completo', '3 análisis manuales al mes', 'Sin alertas'],
    cta: 'Usar simulador',
    href: '/simulador',
    highlight: false,
  },
  {
    name: 'Informe Pro',
    price: REPORT_PRICE_LABEL,
    period: 'pago único',
    features: ['PDF avanzado de una operación', 'Proyecciones y sensibilidad', 'Checklist due diligence'],
    cta: 'Ver Informe Pro',
    href: '/precios',
    highlight: false,
  },
  {
    name: 'Radar Basic',
    price: '9 €',
    period: '/mes',
    priceId: 'basic',
    features: ['1 zona', 'Alertas semanales', 'Hasta 20 oportunidades/mes', 'Ranking por rentabilidad'],
    cta: 'Reservar early access',
    highlight: true,
  },
  {
    name: 'Radar Pro',
    price: '19 €',
    period: '/mes',
    priceId: 'pro',
    features: [
      'Varias zonas',
      'Alertas diarias',
      'Informes PDF por oportunidad',
      'Comparación de escenarios',
      'Export CSV',
    ],
    cta: 'Reservar early access',
    highlight: false,
  },
  {
    name: 'Radar Investor',
    price: '39 €',
    period: '/mes',
    priceId: 'investor',
    features: [
      'Más búsquedas guardadas',
      'Alertas avanzadas',
      'Scoring configurable',
      'Comparativa de cartera',
    ],
    cta: 'Reservar early access',
    highlight: false,
  },
];

export default function RadarPricing() {
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleEarlyAccess = async (priceId: string) => {
    if (!ENABLE_RADAR_EARLY_ACCESS) return;
    setLoading(priceId);
    setError(null);
    try {
      const res = await fetch('/.netlify/functions/create-subscription-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: priceId }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(data.error ?? 'Error al iniciar suscripción');
      }
      const data = (await res.json()) as { url?: string };
      if (data.url) window.location.href = data.url;
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error desconocido');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-slate-900">Planes Radar Pro</h1>
        <p className="mt-2 text-slate-600">Elige el nivel de alertas y análisis que necesitas.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3 xl:grid-cols-5">
        {PLANS.map((plan) => (
          <div
            key={plan.name}
            className={`flex flex-col rounded-xl border p-6 ${
              plan.highlight ? 'border-brand-400 bg-brand-50 shadow-md' : 'border-slate-200 bg-white'
            }`}
          >
            <h2 className="text-lg font-bold text-slate-900">{plan.name}</h2>
            <p className="mt-2">
              <span className="text-2xl font-bold">{plan.price}</span>
              {plan.period && <span className="text-sm text-slate-500">{plan.period}</span>}
            </p>
            <ul className="mt-4 flex-1 space-y-2 text-sm text-slate-600">
              {plan.features.map((f) => (
                <li key={f}>✓ {f}</li>
              ))}
            </ul>
            {plan.href ? (
              <a
                href={plan.href}
                className="mt-6 block rounded-lg border border-brand-600 px-4 py-2 text-center text-sm font-semibold text-brand-700 hover:bg-brand-50"
              >
                {plan.cta}
              </a>
            ) : (
              <button
                type="button"
                disabled={!ENABLE_RADAR_EARLY_ACCESS || loading === plan.priceId}
                onClick={() => plan.priceId && handleEarlyAccess(plan.priceId)}
                className="mt-6 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-50"
                title={
                  ENABLE_RADAR_EARLY_ACCESS
                    ? undefined
                    : 'Early access desactivado (ENABLE_RADAR_EARLY_ACCESS=false)'
                }
              >
                {loading === plan.priceId
                  ? 'Redirigiendo…'
                  : ENABLE_RADAR_EARLY_ACCESS
                    ? plan.cta
                    : 'Próximamente'}
              </button>
            )}
          </div>
        ))}
      </div>

      {!ENABLE_RADAR_EARLY_ACCESS && (
        <p className="text-center text-sm text-slate-500">
          Suscripción early access desactivada.{' '}
          <a href="/radar/waitlist" className="text-brand-600 underline">
            Únete a la waitlist
          </a>{' '}
          para validar demanda.
        </p>
      )}
      {error && <p className="text-center text-sm text-red-600">{error}</p>}
    </div>
  );
}
