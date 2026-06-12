'use client';

import { useState } from 'react';
import { track } from '@/lib/analytics';

export default function LeadCaptureForm() {
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="rounded-xl border border-green-200 bg-green-50 p-5 text-green-800">
        ¡Gracias! Te avisaremos cuando publiquemos mejoras y la plantilla Excel.
      </div>
    );
  }

  return (
    <form
      name="lead-capture"
      method="POST"
      data-netlify="true"
      netlify-honeypot="bot-field"
      className="rounded-xl border border-slate-200 bg-white p-5"
      onSubmit={() => {
        track('lead_submitted');
        setSubmitted(true);
      }}
    >
      <input type="hidden" name="form-name" value="lead-capture" />
      <p className="hidden">
        <label>
          No rellenar: <input name="bot-field" />
        </label>
      </p>
      <h3 className="text-lg font-semibold text-slate-900">Recibir mejoras y plantilla Excel gratuita</h3>
      <p className="mt-1 text-sm text-slate-600">Opcional. Solo usaremos tu email para avisarte de novedades.</p>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <input
          type="email"
          name="email"
          required
          placeholder="tu@email.com"
          className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm"
        />
        <button
          type="submit"
          className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
        >
          Quiero la plantilla
        </button>
      </div>
      <label className="mt-3 flex items-start gap-2 text-xs text-slate-600">
        <input type="checkbox" name="consent" required className="mt-0.5" />
        <span>
          Acepto recibir comunicaciones sobre BrickSignal y entiendo que puedo darme de baja en cualquier
          momento. Consulta la{' '}
          <a href="/privacidad" className="text-brand-600 underline">
            política de privacidad
          </a>
          .
        </span>
      </label>
    </form>
  );
}
