'use client';

import { useState } from 'react';
import { getMarket } from '@/config/markets';
import { track } from '@/lib/analytics';
import { formatPriceLabel } from '@/lib/currency';
import { saveScenario, startCheckout } from '@/lib/storage';

const ES_REPORT_PRICE = formatPriceLabel(
  getMarket('es').pricing.reportPrice.amount,
  getMarket('es').pricing.reportPrice.currency,
  getMarket('es').locale,
);

interface PricingCTAProps {
  disabled?: boolean;
  variant?: 'primary' | 'secondary';
}

export default function PricingCTA({ disabled = false, variant = 'primary' }: PricingCTAProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClick = async () => {
    track('pro_cta_clicked');
    setLoading(true);
    setError(null);

    try {
      const scenarioRaw = localStorage.getItem('bricksignal-scenario');
      if (!scenarioRaw) {
        setError('Calcula primero tu escenario en el simulador.');
        setLoading(false);
        return;
      }
      saveScenario(JSON.parse(scenarioRaw));
      track('checkout_started');
      await startCheckout();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al iniciar el pago.');
      setLoading(false);
    }
  };

  const base =
    variant === 'primary'
      ? 'bg-brand-600 text-white hover:bg-brand-700'
      : 'border border-brand-600 text-brand-700 hover:bg-brand-50';

  return (
    <div>
      <button
        type="button"
        onClick={handleClick}
        disabled={disabled || loading}
        className={`w-full rounded-lg px-5 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto ${base}`}
      >
        {loading ? 'Redirigiendo a Stripe…' : `Generar Informe Pro — ${ES_REPORT_PRICE}`}
      </button>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      <ul className="mt-4 space-y-2 text-sm text-slate-600">
        <li>✓ Evita comprar con números incompletos.</li>
        <li>✓ Comprueba si el alquiler cubre la cuota.</li>
        <li>✓ Simula subidas de tipos, vacancia y bajadas de renta.</li>
        <li>✓ Descarga un PDF para revisar o compartir.</li>
      </ul>
    </div>
  );
}
