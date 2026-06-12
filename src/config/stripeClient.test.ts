import { describe, expect, it } from 'vitest';
import { stripeErrorMessage } from './stripeClient';

describe('stripeClient', () => {
  it('maps connection errors to a helpful message', () => {
    const err = Object.assign(new Error('connection failed'), { name: 'StripeConnectionError' });
    expect(stripeErrorMessage(err)).toBe('connection failed');
  });
});
