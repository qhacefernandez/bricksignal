import { describe, expect, it } from 'vitest';
import { formatCurrency, formatPriceLabel } from './currency';

describe('formatCurrency', () => {
  it('formats EUR', () => {
    expect(formatCurrency(150000, 'EUR', 'es-ES')).toContain('150');
  });

  it('formats GBP', () => {
    expect(formatCurrency(9950, 'GBP', 'en-GB')).toMatch(/£|GBP/);
  });

  it('formats USD', () => {
    expect(formatCurrency(1490, 'USD', 'en-US')).toMatch(/\$|USD/);
  });

  it('formats MXN', () => {
    expect(formatCurrency(149, 'MXN', 'es-MX')).toBeTruthy();
  });

  it('formats AUD', () => {
    expect(formatCurrency(1490, 'AUD', 'en-AU')).toBeTruthy();
  });

  it('formatPriceLabel shows cents for EUR report price', () => {
    const label = formatPriceLabel(14.9, 'EUR', 'es-ES');
    expect(label).toMatch(/14[,.]90/);
    expect(label).not.toMatch(/15/);
  });
});
