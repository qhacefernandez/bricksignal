import { describe, expect, it } from 'vitest';
import { formatCurrencyAmount } from './currency';
import { formatPercentValue } from './percent';
import { parseLocaleNumber, roundToStep } from './number';

describe('formatting', () => {
  it('formats EUR for Spain', () => {
    expect(formatCurrencyAmount(180_000, 'EUR', 'es-ES')).toContain('180');
  });

  it('formats USD', () => {
    expect(formatCurrencyAmount(300_000, 'USD', 'en-US')).toContain('300');
  });

  it('formats percent', () => {
    expect(formatPercentValue(5, 'es-ES')).toContain('5');
  });

  it('parses locale numbers', () => {
    expect(parseLocaleNumber('3,25')).toBe(3.25);
  });

  it('rounds to step', () => {
    expect(roundToStep(952, 25)).toBe(950);
  });
});
