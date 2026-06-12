'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { track } from '@/lib/analytics';
import { calculateInvestment } from '@/lib/calculations';
import { hasProAccess, saveScenario } from '@/lib/storage';
import { DEFAULT_INPUT, simulatorInputSchema, type SimulatorInput } from '@/lib/types';
import AdvancedResults from './AdvancedResults';
import DisclaimerBox from './DisclaimerBox';
import FormulaExplanation from './FormulaExplanation';
import InputPanel from './InputPanel';
import LeadCaptureForm from './LeadCaptureForm';
import PricingCTA from './PricingCTA';
import ResultsSummary from './ResultsSummary';

export default function InvestmentSimulator() {
  const [input, setInput] = useState<SimulatorInput>(DEFAULT_INPUT);
  const [proUnlocked, setProUnlocked] = useState(false);
  const [started, setStarted] = useState(false);

  const results = useMemo(() => calculateInvestment(input), [input]);

  useEffect(() => {
    track('simulator_started');
    const saved = localStorage.getItem('bricksignal-scenario');
    if (saved) {
      try {
        const parsed = simulatorInputSchema.parse(JSON.parse(saved));
        setInput(parsed);
      } catch {
        /* ignore invalid saved data */
      }
    }
    void hasProAccess().then(setProUnlocked);
  }, []);

  useEffect(() => {
    saveScenario(input);
    if (started) track('simulator_completed');
  }, [input, started]);

  const handleChange = useCallback((patch: Partial<SimulatorInput>) => {
    setStarted(true);
    setInput((prev) => {
      const next = { ...prev, ...patch };
      if (patch.useMortgage === false) {
        next.financedAmount = 0;
        next.downPayment = next.purchasePrice;
      }
      if (patch.purchasePrice && prev.useMortgage) {
        const financed = Math.max(0, patch.purchasePrice - prev.downPayment);
        next.financedAmount = financed;
      }
      return next;
    });
  }, []);

  const scrollToPro = () => {
    document.getElementById('pro-cta')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="space-y-8">
      <DisclaimerBox />

      <div className="lg:hidden">
        <ResultsSummary results={results} sticky={false} />
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <InputPanel input={input} onChange={handleChange} />
        <div className="hidden lg:block">
          <ResultsSummary results={results} />
        </div>
      </div>

      <section id="pro-cta" className="rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="text-xl font-semibold text-slate-900">¿Quieres el informe completo?</h2>
        <p className="mt-1 text-sm text-slate-600">
          Pago único. Incluye PDF, proyecciones, sensibilidad y checklist.
        </p>
        <div className="mt-4">
          <PricingCTA />
        </div>
      </section>

      <AdvancedResults
        input={input}
        results={results}
        proUnlocked={proUnlocked}
        onRequestPro={scrollToPro}
      />

      <FormulaExplanation />
      <LeadCaptureForm />
    </div>
  );
}
