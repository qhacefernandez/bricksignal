'use client';

import { useEffect, useState } from 'react';
import { track } from '@/lib/analytics';
import { calculateInvestment } from '@/lib/calculations';
import {
  loadProAccess,
  loadScenario,
  saveProAccess,
  verifyProSession,
} from '@/lib/storage';
import AdvancedResults from '@/components/AdvancedResults';
import DisclaimerBox from '@/components/DisclaimerBox';

export default function SuccessPage() {
  const [status, setStatus] = useState<'loading' | 'paid' | 'invalid' | 'no-scenario'>('loading');
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('session_id');
    setSessionId(id);

    async function verify() {
      if (!id) {
        setStatus('invalid');
        return;
      }

      const paid = await verifyProSession(id);
      if (!paid) {
        setStatus('invalid');
        return;
      }

      saveProAccess({ sessionId: id, verifiedAt: Date.now() });
      track('checkout_success', { session_id: id });

      const scenario = loadScenario();
      if (!scenario) {
        setStatus('no-scenario');
        return;
      }

      setStatus('paid');
    }

    void verify();
  }, []);

  const scenario = loadScenario();
  const results = scenario ? calculateInvestment(scenario) : null;
  const existingAccess = loadProAccess();

  return (
    <div className="space-y-6">
      <DisclaimerBox />

      {status === 'loading' && (
        <p className="text-center text-slate-600">Verificando tu pago con Stripe…</p>
      )}

      {status === 'invalid' && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
          <h1 className="text-xl font-bold text-red-900">No pudimos confirmar el pago</h1>
          <p className="mt-2 text-red-800">
            Si crees que es un error, contacta con soporte indicando tu email de compra.
          </p>
          <a href="/simulador" className="mt-4 inline-block text-brand-600 underline">
            Volver al simulador
          </a>
        </div>
      )}

      {status === 'no-scenario' && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-6">
          <h1 className="text-xl font-bold text-amber-900">Pago confirmado</h1>
          <p className="mt-2 text-amber-800">
            Hemos verificado tu pago, pero no encontramos el escenario guardado en este navegador. Vuelve al{' '}
            <a href="/simulador" className="font-semibold underline">
              simulador
            </a>{' '}
            y regenera el informe: no tendrás que pagar de nuevo mientras tu sesión{' '}
            <code className="text-xs">{sessionId ?? existingAccess?.sessionId}</code> siga siendo válida.
          </p>
        </div>
      )}

      {status === 'paid' && scenario && results && (
        <div>
          <h1 className="text-2xl font-bold text-slate-900">¡Pago confirmado!</h1>
          <p className="mt-2 text-slate-600">Tu Informe Pro está listo. Descarga el PDF cuando quieras.</p>
          <div className="mt-6">
            <AdvancedResults input={scenario} results={results} proUnlocked={true} />
          </div>
        </div>
      )}
    </div>
  );
}
