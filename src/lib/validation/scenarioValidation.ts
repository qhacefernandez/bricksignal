import type { BasicSimulatorInput } from '@/lib/calculations/basic';

export type ValidationMessage = { type: 'error' | 'warning'; message: string };

export function validateBasicScenario(input: BasicSimulatorInput): ValidationMessage[] {
  const messages: ValidationMessage[] = [];
  if (input.purchasePrice <= 0) {
    messages.push({ type: 'error', message: 'El precio de compra debe ser mayor que 0.' });
  }
  if (input.monthlyRent <= 0) {
    messages.push({ type: 'error', message: 'El alquiler mensual debe ser mayor que 0.' });
  }
  const approxCosts = input.purchasePrice * (input.purchaseCostsPercent / 100);
  if (input.useMortgage && input.downPayment >= input.purchasePrice + approxCosts) {
    messages.push({
      type: 'warning',
      message: 'La entrada cubre el precio y costes aproximados. Considera desactivar la hipoteca.',
    });
  }
  if (input.downPayment > input.purchasePrice + approxCosts) {
    messages.push({ type: 'warning', message: 'La entrada supera el precio de compra más costes estimados.' });
  }
  if (input.useMortgage && input.downPayment >= input.purchasePrice) {
    messages.push({ type: 'warning', message: 'Si no necesitas financiación, puedes desactivar la hipoteca.' });
  }
  if (input.interestRate === 0 && input.useMortgage) {
    messages.push({ type: 'warning', message: 'Tipo de interés al 0%: comprueba que refleja tu hipótesis real.' });
  }
  if (input.annualExpensesPercent < 5) {
    messages.push({ type: 'warning', message: 'Puede que estés infraestimando gastos.' });
  }
  if (input.annualExpensesPercent > 40) {
    messages.push({ type: 'warning', message: 'Gastos muy altos: revisa comunidad, mantenimiento o gestión.' });
  }
  return messages;
}

export function validateVacancyRate(vacancyPercent: number): ValidationMessage[] {
  const messages: ValidationMessage[] = [];
  if (vacancyPercent > 15) {
    messages.push({
      type: 'warning',
      message: 'Vacancia alta: revisa demanda, rotación y tiempo medio sin alquilar.',
    });
  }
  return messages;
}

export function isOutOfSliderRange(value: number, min: number, max: number): boolean {
  return value < min || value > max;
}
