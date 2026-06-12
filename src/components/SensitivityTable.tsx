import { formatEuro, formatPercent, viabilityBg, viabilityDot } from '@/lib/format';
import type { SensitivityScenario } from '@/lib/types';

interface SensitivityTableProps {
  scenarios: SensitivityScenario[];
  baseInterestRate: number;
}

export default function SensitivityTable({ scenarios, baseInterestRate }: SensitivityTableProps) {
  const rentLabels = ['-10%', 'Base', '+10%'];
  const vacancyRates = [...new Set(scenarios.map((s) => s.vacancyPercent))].sort((a, b) => a - b);
  const rateDeltas = [0, 1, 2];

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-left text-sm">
        <thead>
          <tr className="border-b border-slate-200 text-slate-600">
            <th className="px-2 py-2 font-medium">Escenario</th>
            {rentLabels.map((l) => (
              <th key={l} className="px-2 py-2 font-medium">
                Renta {l}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {vacancyRates.map((vacancy) =>
            rateDeltas.map((delta) => {
              const label = `Vac. ${vacancy}% · Tipo ${(baseInterestRate + delta).toFixed(1)}%`;
              return (
                <tr key={`${vacancy}-${delta}`} className="border-b border-slate-100">
                  <td className="whitespace-nowrap px-2 py-2 text-slate-700">{label}</td>
                  {rentLabels.map((rentLabel) => {
                    const cell = scenarios.find(
                      (s) =>
                        s.rentLabel === rentLabel &&
                        s.vacancyPercent === vacancy &&
                        s.interestRate === baseInterestRate + delta,
                    );
                    if (!cell) {
                      return (
                        <td key={rentLabel} className="px-2 py-2">
                          —
                        </td>
                      );
                    }
                    return (
                      <td key={rentLabel} className="px-2 py-2">
                        <div
                          className={`rounded-lg border px-2 py-1.5 ${viabilityBg(cell.cell.viability)}`}
                        >
                          <div className="flex items-center gap-1.5">
                            <span className={`h-2 w-2 rounded-full ${viabilityDot(cell.cell.viability)}`} />
                            <span className="font-medium">{formatEuro(cell.cell.monthlyCashflow, true)}/mes</span>
                          </div>
                          <div className="mt-0.5 text-xs text-slate-600">
                            DSCR {cell.cell.dscr === Infinity ? '∞' : cell.cell.dscr.toFixed(2)} ·{' '}
                            {formatPercent(cell.cell.netYield)}
                          </div>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              );
            }),
          )}
        </tbody>
      </table>
    </div>
  );
}
