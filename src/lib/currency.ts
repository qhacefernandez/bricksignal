import type { CurrencyCode, MarketConfig } from '@/config/types';

const ZERO_DECIMAL: CurrencyCode[] = ['MXN'];

export function formatCurrency(
  value: number,
  currency: CurrencyCode,
  locale: string,
  precise = false,
): string {
  if (!Number.isFinite(value)) return '—';
  const fractionDigits = precise ? 2 : ZERO_DECIMAL.includes(currency) ? 0 : currency === 'EUR' || currency === 'GBP' ? 0 : 2;
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: precise ? 2 : fractionDigits,
  }).format(value);
}

export function formatCurrencyForMarket(value: number, market: MarketConfig, precise = false): string {
  return formatCurrency(value, market.currency, market.locale, precise);
}

/** Price tags in UI — always show cents (e.g. 14,90 €, not 15 €). */
export function formatPriceLabel(amount: number, currency: CurrencyCode, locale: string): string {
  const showCents = !ZERO_DECIMAL.includes(currency);
  return formatCurrency(amount, currency, locale, showCents);
}
