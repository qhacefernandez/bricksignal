import { isVacancySensitive } from '@/lib/calculations';
import type { CalculationResults, SimulatorInput } from '@/lib/types';
import SensitivityTable from '../SensitivityTable';

interface Props {
  input: SimulatorInput;
  results: CalculationResults;
  blurred?: boolean;
  defaultVacancy?: number;
}

export default function ProSensitivityAnalysis({ input, results, blurred, defaultVacancy }: Props) {
  const baseScenarios = results.sensitivity.filter((s) => (s.expenseMultiplier ?? 1) === 1);
  const vacancySensitive = isVacancySensitive(input);
  const baseV = input.vacancyPercent ?? defaultVacancy ?? 5;

  return (
    <section className={`rounded-xl border border-slate-200 bg-white p-5 ${blurred ? 'relative overflow-hidden' : ''}`}>
      <h4 className="mb-3 font-semibold text-slate-900">Sensibilidad</h4>
      <p className="mb-3 text-xs text-slate-500">
        Vacancia base {baseV}% · escenarios +5pp y +10pp · gastos operativos ±10–20%
      </p>
      {vacancySensitive && !blurred && (
        <p className="mb-3 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800">
          La rentabilidad es sensible a periodos sin alquilar (+5pp de vacancia cambia el signo del cashflow).
        </p>
      )}
      <div className={blurred ? 'pointer-events-none select-none blur-sm' : ''}>
        <SensitivityTable scenarios={baseScenarios} baseInterestRate={input.interestRate} />
      </div>
      {blurred && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/75">
          <p className="text-sm font-medium text-slate-700">🔒 Sensibilidad — desbloquea PRO</p>
        </div>
      )}
    </section>
  );
}
