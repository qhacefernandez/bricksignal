import type { CurrencyCode, MarketConfig } from '@/config/types';

const ZERO_DECIMAL: CurrencyCode[] = ['MXN'];

export function formatCurrencyAmount(
  value: number,
  currency: CurrencyCode,
  locale: string,
  precise = false,
): string {
  if (!Number.isFinite(value)) return '—';
  const fractionDigits = precise
    ? 2
    : ZERO_DECIMAL.includes(currency)
      ? 0
      : currency === 'EUR' || currency === 'GBP'
        ? 0
        : 2;
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: precise ? 2 : fractionDigits,
  }).format(value);
}

export function formatCurrencyForMarketConfig(value: number, market: MarketConfig, precise = false): string {
  return formatCurrencyAmount(value, market.currency, market.locale, precise);
}

export function formatCurrencyInputDisplay(
  value: number,
  _currency: CurrencyCode,
  locale: string,
): string {
  if (!Number.isFinite(value)) return '';
  return new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(Math.round(value));
}
