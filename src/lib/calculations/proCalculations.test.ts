import { describe, expect, it } from 'vitest';
import { DEFAULT_BASIC_INPUT } from './basic';
import { runFullProAnalysis } from './pro';

describe('pro calculations', () => {
  const { results } = runFullProAnalysis({ ...DEFAULT_BASIC_INPUT, marketSlug: 'es' });

  it('returns IRR', () => {
    expect(typeof results.irr).toBe('number');
    expect(Number.isFinite(results.irr) || results.irr === 0).toBe(true);
  });

  it('returns DSCR', () => {
    expect(results.dscr).toBeGreaterThan(0);
  });

  it('returns sensitivity matrix', () => {
    expect(results.sensitivity.length).toBeGreaterThan(0);
  });
});
