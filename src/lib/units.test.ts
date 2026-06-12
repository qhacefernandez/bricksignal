import { describe, expect, it } from 'vitest';
import { getMarket } from '@/config/markets';
import { m2ToSqft, sqftToM2, displayArea } from './units';

describe('units', () => {
  it('converts m2 to sqft', () => {
    expect(m2ToSqft(10)).toBeCloseTo(107.639, 1);
  });

  it('converts sqft to m2', () => {
    expect(sqftToM2(107.639)).toBeCloseTo(10, 0);
  });

  it('uk displays sqft primary', () => {
    const uk = getMarket('uk');
    const area = displayArea(65, uk);
    expect(area.primary).toContain('sq');
  });

  it('es displays m2', () => {
    const es = getMarket('es');
    expect(displayArea(65, es).primary).toContain('m²');
  });
});
