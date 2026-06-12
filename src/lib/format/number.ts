export function parseLocaleNumber(raw: string): number {
  const cleaned = raw.replace(/\s/g, '').replace(',', '.');
  const n = parseFloat(cleaned);
  return Number.isFinite(n) ? n : NaN;
}

export function roundToStep(value: number, step: number): number {
  if (step <= 0) return value;
  const decimals = String(step).includes('.') ? String(step).split('.')[1]?.length ?? 0 : 0;
  const rounded = Math.round(value / step) * step;
  return Number(rounded.toFixed(decimals));
}

export function clampNumber(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}
