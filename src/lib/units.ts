import type { MarketConfig } from '@/config/types';

const SQFT_PER_M2 = 10.7639;

export function m2ToSqft(m2: number): number {
  return m2 * SQFT_PER_M2;
}

export function sqftToM2(sqft: number): number {
  return sqft / SQFT_PER_M2;
}

export function formatArea(value: number, market: MarketConfig, unit?: 'm2' | 'sqft'): string {
  const u = unit ?? market.defaultAreaUnit;
  const locale = market.locale;
  const formatted = new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(value);
  return u === 'sqft' ? `${formatted} sq ft` : `${formatted} m²`;
}

export function displayArea(
  sizeM2: number,
  market: MarketConfig,
  showAlternate = true,
): { primary: string; alternate?: string } {
  if (market.defaultAreaUnit === 'sqft') {
    const sqft = Math.round(m2ToSqft(sizeM2));
    return {
      primary: formatArea(sqft, market, 'sqft'),
      alternate: showAlternate ? formatArea(sizeM2, { ...market, defaultAreaUnit: 'm2' }, 'm2') : undefined,
    };
  }
  return {
    primary: formatArea(sizeM2, market, 'm2'),
    alternate: showAlternate && market.measurementSystem === 'mixed'
      ? formatArea(Math.round(m2ToSqft(sizeM2)), { ...market, defaultAreaUnit: 'sqft' }, 'sqft')
      : undefined,
  };
}
