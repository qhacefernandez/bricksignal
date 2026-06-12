import { describe, expect, it } from 'vitest';
import { assertProUnlockRequiresVerification, maskProValue } from './proGating';

describe('pro gating', () => {
  it('masks values when locked', () => {
    expect(maskProValue(false, '12.5%')).toBe('••••');
    expect(maskProValue(true, '12.5%')).toBe('12.5%');
  });

  it('does not unlock PRO from localStorage alone', () => {
    expect(assertProUnlockRequiresVerification(false, true)).toBe(false);
    expect(assertProUnlockRequiresVerification(true, false)).toBe(true);
    expect(assertProUnlockRequiresVerification(true, true)).toBe(true);
  });
});
