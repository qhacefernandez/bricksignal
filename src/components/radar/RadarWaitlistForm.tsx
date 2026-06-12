'use client';

import { useState } from 'react';
import { track } from '@/lib/analytics';
import { ENABLE_RADAR_EARLY_ACCESS } from '@/lib/flags';

export default function RadarWaitlistForm() {
  const [submitted, setSubmitted] = useState(false);
  const [earlyLoading, setEarlyLoading] = useState(false);

  const handleEarlyAccess = async () => {
    if (!ENABLE_RADAR_EARLY_ACCESS) return;
    setEarlyLoading(true);
    try {
      const res = await fetch('/.netlify/functions/create-subscription-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: 'basic' }),
      });
      const data = (await res.json()) as { url?: string; error?: string };
      if (data.url) window.location.href = data.url;
    } finally {
      setEarlyLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="rounded-xl border border-green-200 bg-green-50 p-8 text-center text-green-800">
        <h2 className="text-xl font-bold">¡Estás en la lista!</h2>
        <p className="mt-2">Te avisaremos cuando Radar Pro esté disponible en tu zona.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-slate-900">Lista de espera Radar Pro</h1>
        <p className="mt-2 text-slate-600">
          Cuéntanos qué buscas y te avisaremos del lanzamiento.
        </p>
      </div>

      <form
        name="radar-waitlist"
        method="POST"
        data-netlify="true"
        netlify-honeypot="bot-field"
        className="space-y-4 rounded-xl border border-slate-200 bg-white p-6"
        onSubmit={() => {
          track('radar_waitlist_submitted');
          setSubmitted(true);
        }}
      >
        <input type="hidden" name="form-name" value="radar-waitlist" />
        <p className="hidden">
          <label>
            No rellenar: <input name="bot-field" />
          </label>
        </p>

        <label className="block">
          <span className="text-sm font-medium text-slate-700">Email *</span>
          <input
            type="email"
            name="email"
            required
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-slate-700">Ciudad o zona de interés *</span>
          <input
            type="text"
            name="city"
            required
            placeholder="Ej. Madrid, Ruzafa, Poble Sec…"
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-slate-700">Presupuesto máximo (€) *</span>
          <input
            type="number"
            name="max_budget"
            required
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-slate-700">Entrada disponible (€) *</span>
          <input
            type="number"
            name="available_cash"
            required
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-slate-700">Rentabilidad bruta mínima (%) *</span>
          <input
            type="number"
            name="min_gross_yield"
            step="0.5"
            required
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-slate-700">Cashflow mensual mínimo (€) *</span>
          <input
            type="number"
            name="min_cashflow"
            required
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-slate-700">Tipo de inversión *</span>
          <select
            name="strategy"
            required
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          >
            <option value="traditional_rental">Alquiler tradicional</option>
            <option value="room_rental">Alquiler por habitaciones</option>
            <option value="renovate_and_rent">Reforma y alquiler</option>
          </select>
        </label>

        <label className="flex items-start gap-2 text-xs text-slate-600">
          <input type="checkbox" name="consent" required className="mt-0.5" />
          <span>
            Acepto recibir comunicaciones sobre Radar Pro y entiendo la{' '}
            <a href="/privacidad" className="text-brand-600 underline">
              política de privacidad
            </a>
            . *
          </span>
        </label>

        <button
          type="submit"
          className="w-full rounded-lg bg-brand-600 px-4 py-3 text-sm font-semibold text-white hover:bg-brand-700"
        >
          Unirme a la lista de espera de Radar Pro
        </button>
      </form>

      <div className="text-center">
        <button
          type="button"
          disabled={!ENABLE_RADAR_EARLY_ACCESS || earlyLoading}
          onClick={handleEarlyAccess}
          className="rounded-lg border border-brand-600 px-5 py-2.5 text-sm font-semibold text-brand-700 hover:bg-brand-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {ENABLE_RADAR_EARLY_ACCESS
            ? earlyLoading
              ? 'Redirigiendo…'
              : 'Reservar early access — 9 €/mes'
            : 'Early access — próximamente'}
        </button>
      </div>
    </div>
  );
}
