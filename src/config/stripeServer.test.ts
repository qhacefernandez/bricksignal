import { describe, expect, it } from 'vitest';
import { CheckoutError, resolveCheckoutPrice, validateCheckoutRequest } from './stripeServer';

describe('stripeServer', () => {
  it('rejects invalid market', () => {
    expect(() => validateCheckoutRequest({ marketSlug: 'xx', productType: 'pro_report' })).toThrow(CheckoutError);
  });

  it('rejects price id from body — uses env keys only', () => {
    expect(() =>
      resolveCheckoutPrice('es', 'pro_report', { STRIPE_PRICE_REPORT_EUR: 'price_123' }),
    ).not.toThrow();
    expect(() => resolveCheckoutPrice('es', 'pro_report', {})).toThrow(/not configured/);
    expect(() =>
      resolveCheckoutPrice('es', 'pro_report', { STRIPE_PRICE_REPORT_EUR: 'prod_abc123' }),
    ).toThrow(/Price ID/);
  });

  it('blocks subscriptions when feature disabled', () => {
    expect(() =>
      resolveCheckoutPrice('es', 'radar_basic', { STRIPE_PRICE_RADAR_BASIC_EUR: 'price_x' }),
    ).toThrow(/not enabled/);
  });
});
