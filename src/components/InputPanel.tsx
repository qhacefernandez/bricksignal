'use client';

import { SPANISH_REGIONS, type SimulatorInput } from '@/lib/types';

interface InputPanelProps {
  input: SimulatorInput;
  onChange: (patch: Partial<SimulatorInput>) => void;
}

function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-slate-700">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-slate-500">{hint}</span>}
    </label>
  );
}

function NumberInput({
  value,
  onChange,
  step = 1,
  min,
  max,
}: {
  value: number;
  onChange: (v: number) => void;
  step?: number;
  min?: number;
  max?: number;
}) {
  return (
    <input
      type="number"
      value={value}
      step={step}
      min={min}
      max={max}
      onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
    />
  );
}

export default function InputPanel({ input, onChange }: InputPanelProps) {
  return (
    <div className="space-y-8">
      <section className="rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="mb-4 text-lg font-semibold text-slate-900">1. Datos del inmueble</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Precio de compra (€)">
            <NumberInput value={input.purchasePrice} onChange={(v) => onChange({ purchasePrice: v })} step={1000} />
          </Field>
          <Field label="Comunidad autónoma">
            <select
              value={input.region}
              onChange={(e) => onChange({ region: e.target.value })}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            >
              {SPANISH_REGIONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Tipo">
            <select
              value={input.propertyType}
              onChange={(e) => onChange({ propertyType: e.target.value as SimulatorInput['propertyType'] })}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            >
              <option value="second_hand">Segunda mano</option>
              <option value="new_build">Obra nueva</option>
            </select>
          </Field>
          <Field label="Metros cuadrados">
            <NumberInput value={input.squareMeters ?? 0} onChange={(v) => onChange({ squareMeters: v })} />
          </Field>
          <Field label="Estado">
            <select
              value={input.propertyStatus}
              onChange={(e) => onChange({ propertyStatus: e.target.value as SimulatorInput['propertyStatus'] })}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            >
              <option value="ready">Listo para alquilar</option>
              <option value="needs_renovation">Necesita reforma</option>
            </select>
          </Field>
          {input.propertyStatus === 'needs_renovation' && (
            <Field label="Coste de reforma (€)">
              <NumberInput value={input.renovationCost} onChange={(v) => onChange({ renovationCost: v })} step={500} />
            </Field>
          )}
          <Field label="Muebles / equipamiento (€)">
            <NumberInput value={input.furnitureCost} onChange={(v) => onChange({ furnitureCost: v })} step={100} />
          </Field>
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="mb-4 text-lg font-semibold text-slate-900">2. Alquiler</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Renta mensual esperada (€)">
            <NumberInput value={input.monthlyRent} onChange={(v) => onChange({ monthlyRent: v })} step={25} />
          </Field>
          <Field label="Vacancia (% anual)" hint="Alternativa: puedes usar meses de vacancia">
            <NumberInput
              value={input.vacancyPercent ?? 0}
              onChange={(v) => onChange({ vacancyPercent: v, vacancyMonths: undefined })}
              step={0.5}
              max={100}
            />
          </Field>
          <Field label="Meses de vacancia / año">
            <NumberInput
              value={input.vacancyMonths ?? 0}
              onChange={(v) => onChange({ vacancyMonths: v, vacancyPercent: undefined })}
              max={12}
            />
          </Field>
          <Field label="Crecimiento anual renta (%)">
            <NumberInput value={input.rentGrowthPercent} onChange={(v) => onChange({ rentGrowthPercent: v })} step={0.5} />
          </Field>
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="mb-4 text-lg font-semibold text-slate-900">3. Gastos anuales</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="IBI (€)">
            <NumberInput value={input.ibi} onChange={(v) => onChange({ ibi: v })} />
          </Field>
          <Field label="Comunidad (€)">
            <NumberInput value={input.communityFees} onChange={(v) => onChange({ communityFees: v })} />
          </Field>
          <Field label="Seguro hogar (€)">
            <NumberInput value={input.homeInsurance} onChange={(v) => onChange({ homeInsurance: v })} />
          </Field>
          <Field label="Seguro impago (€)">
            <NumberInput value={input.rentDefaultInsurance} onChange={(v) => onChange({ rentDefaultInsurance: v })} />
          </Field>
          <Field label="Mantenimiento (€)">
            <NumberInput value={input.maintenance} onChange={(v) => onChange({ maintenance: v })} />
          </Field>
          <Field label="Gestión inmobiliaria (% del alquiler)">
            <NumberInput value={input.managementPercent} onChange={(v) => onChange({ managementPercent: v })} step={0.5} />
          </Field>
          <Field label="Otros gastos (€)">
            <NumberInput value={input.otherExpenses} onChange={(v) => onChange({ otherExpenses: v })} />
          </Field>
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="mb-4 text-lg font-semibold text-slate-900">4. Compra</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {input.propertyType === 'second_hand' ? (
            <Field label="ITP (%)" hint="Editable según tu CCAA">
              <NumberInput value={input.itpPercent} onChange={(v) => onChange({ itpPercent: v })} step={0.5} />
            </Field>
          ) : (
            <Field label="IVA (%)" hint="Por defecto 10% en vivienda">
              <NumberInput value={input.vatPercent} onChange={(v) => onChange({ vatPercent: v })} step={0.5} />
            </Field>
          )}
          <Field label="AJD (%)">
            <NumberInput value={input.ajdPercent} onChange={(v) => onChange({ ajdPercent: v })} step={0.1} />
          </Field>
          <Field label="Notaría / registro / gestoría (€)">
            <NumberInput value={input.notaryAndRegistry} onChange={(v) => onChange({ notaryAndRegistry: v })} step={100} />
          </Field>
          <Field label="Reserva de liquidez (€)">
            <NumberInput value={input.liquidityReserve} onChange={(v) => onChange({ liquidityReserve: v })} step={500} />
          </Field>
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="mb-4 text-lg font-semibold text-slate-900">5. Hipoteca</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Usar hipoteca">
            <select
              value={input.useMortgage ? 'yes' : 'no'}
              onChange={(e) => onChange({ useMortgage: e.target.value === 'yes' })}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            >
              <option value="yes">Sí</option>
              <option value="no">No</option>
            </select>
          </Field>
          {input.useMortgage && (
            <>
              <Field label="Entrada (€)">
                <NumberInput value={input.downPayment} onChange={(v) => onChange({ downPayment: v })} step={1000} />
              </Field>
              <Field label="Importe financiado (€)">
                <NumberInput value={input.financedAmount} onChange={(v) => onChange({ financedAmount: v })} step={1000} />
              </Field>
              <Field label="Tipo de interés anual (%)">
                <NumberInput value={input.interestRate} onChange={(v) => onChange({ interestRate: v })} step={0.1} />
              </Field>
              <Field label="Plazo (años)">
                <NumberInput value={input.mortgageYears} onChange={(v) => onChange({ mortgageYears: v })} min={1} max={40} />
              </Field>
            </>
          )}
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="mb-4 text-lg font-semibold text-slate-900">6. Fiscalidad (orientativa)</h2>
        <Field
          label="Tipo efectivo impuestos sobre beneficio del alquiler (%)"
          hint="Por defecto 0%. Consulta con un profesional para tu caso."
        >
          <NumberInput value={input.effectiveTaxRate} onChange={(v) => onChange({ effectiveTaxRate: v })} step={1} max={50} />
        </Field>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="mb-4 text-lg font-semibold text-slate-900">7. Proyección</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Horizonte (años)">
            <select
              value={input.projectionHorizon}
              onChange={(e) =>
                onChange({ projectionHorizon: parseInt(e.target.value, 10) as SimulatorInput['projectionHorizon'] })
              }
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            >
              <option value={5}>5 años</option>
              <option value={10}>10 años</option>
              <option value={15}>15 años</option>
              <option value={20}>20 años</option>
            </select>
          </Field>
          <Field label="Revalorización anual inmueble (%)">
            <NumberInput value={input.appreciationPercent} onChange={(v) => onChange({ appreciationPercent: v })} step={0.5} />
          </Field>
          <Field label="Coste de venta (%)">
            <NumberInput value={input.saleCostPercent} onChange={(v) => onChange({ saleCostPercent: v })} step={0.5} />
          </Field>
          <Field label="Inflación gastos (%)">
            <NumberInput value={input.expenseInflationPercent} onChange={(v) => onChange({ expenseInflationPercent: v })} step={0.5} />
          </Field>
        </div>
      </section>
    </div>
  );
}
