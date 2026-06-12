export function formatPercentValue(value: number, locale: string, decimals = 1): string {
  if (!Number.isFinite(value)) return '—';
  return new Intl.NumberFormat(locale, {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value / 100);
}

export function formatPercentInput(value: number, decimals = 2): string {
  if (!Number.isFinite(value)) return '';
  return value.toFixed(decimals);
}
