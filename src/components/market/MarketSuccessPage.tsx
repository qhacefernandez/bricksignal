'use client';

import { useEffect, useState } from 'react';
import type { MarketConfig } from '@/config/types';
import { track } from '@/lib/analytics';
import { loadBasicScenario, loadScenario, saveProAccess, verifyProSession } from '@/lib/marketStorage';
import { claimProReport, createProAccessFromPayment, scenarioFingerprint } from '@/lib/proReports';
import { assertProUnlockRequiresVerification } from '@/lib/proGating';
import { marketPath } from '@/i18n/routes';
import { useInvestmentScenario } from '@/hooks/useInvestmentScenario';
import ProInvestmentAnalysis from '../pro/ProInvestmentAnalysis';
import MarketDisclaimer from './MarketDisclaimer';

function PaidProReport({ market }: { market: MarketConfig }) {
  const scenario = useInvestmentScenario(market);
  return (
    <ProInvestmentAnalysis
      market={market}
      basic={scenario.basicForCalc}
      basicResults={scenario.basicResults}
      proUnlocked
      scenario={scenario}
    />
  );
}

export default function MarketSuccessPage({ market }: { market: MarketConfig }) {
  const [status, setStatus] = useState<'loading' | 'paid' | 'invalid' | 'no-scenario' | 'network'>('loading');
  const [verifyReason, setVerifyReason] = useState<string | null>(null);
  const [sessionVerified, setSessionVerified] = useState(false);

  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get('session_id');
    void (async () => {
      if (!id) { setStatus('invalid'); return; }
      const verification = await verifyProSession(id);
      if (!verification.ok) {
        setVerifyReason(verification.reason);
        setStatus(verification.reason === 'network' ? 'network' : 'invalid');
        return;
      }
      setSessionVerified(true);
      const access = createProAccessFromPayment(id);
      saveProAccess(market.slug, access);
      const savedBasic = loadBasicScenario(market.slug);
      if (savedBasic) {
        claimProReport(market.slug, scenarioFingerprint(savedBasic));
      }
      track('checkout_success', { marketSlug: market.slug, productType: 'pro_report' });
      const hasScenario = Boolean(loadBasicScenario(market.slug) || loadScenario(market.slug));
      setStatus(hasScenario ? 'paid' : 'no-scenario');
    })();
  }, [market.slug]);

  const proUnlocked = assertProUnlockRequiresVerification(sessionVerified, Boolean(loadScenario(market.slug)));

  return (
    <div className="space-y-6">
      <MarketDisclaimer />
      {status === 'loading' && <p>Verificando pago…</p>}
      {status === 'network' && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-amber-900">
          <p className="font-medium">El pago puede haberse completado, pero no pudimos verificarlo aquí.</p>
          <p className="mt-2 text-sm">
            Usa <code className="rounded bg-white px-1">npm run dev:netlify</code> y abre{' '}
            <strong>http://localhost:8888</strong> (no el puerto 4321). Luego vuelve a esta misma URL de success.
          </p>
        </div>
      )}
      {status === 'invalid' && (
        <p className="text-red-700">
          No se pudo verificar el pago.
          {verifyReason === 'unpaid' && ' El estado en Stripe no aparece como pagado.'}
        </p>
      )}
      {status === 'no-scenario' && (
        <p>
          Pago confirmado.{' '}
          <a href={marketPath(market.slug, 'simulator')} className="text-brand-600 underline">
            Vuelve al simulador
          </a>{' '}
          para regenerar tu informe.
        </p>
      )}
      {status === 'paid' && proUnlocked && (
        <>
          <h1 className="text-2xl font-bold">Pago confirmado — Informe PRO</h1>
          <PaidProReport market={market} />
        </>
      )}
    </div>
  );
}
