import { describe, expect, it } from 'vitest';
import { buildIRRCashflows, calculateIRR } from './irr';

describe('calculateIRR', () => {
  it('returns positive IRR for profitable investment', () => {
    const flows = [-1000, 300, 300, 300, 400];
    const irr = calculateIRR(flows);
    expect(irr * 100).toBeGreaterThan(8);
    expect(irr * 100).toBeLessThan(12);
  });

  it('handles break-even investment', () => {
    const flows = [-1000, 250, 250, 250, 250];
    const irr = calculateIRR(flows);
    expect(irr).toBeCloseTo(0, 2);
  });
});

describe('buildIRRCashflows', () => {
  it('includes sale proceeds in final year', () => {
    const flows = buildIRRCashflows(50_000, [2000, 2000], 2, 30_000);
    expect(flows).toHaveLength(3);
    expect(flows[0]).toBe(-50_000);
    expect(flows[2]).toBe(32_000);
  });
});
