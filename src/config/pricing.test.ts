import { describe, expect, it } from 'vitest';
import { getMarketPricingStrategy, getPriceConfig, MARKET_PRICE_TIERS, resolveStripePriceId } from './pricing';

describe('pricing', () => {
  it('applies market pricing strategy table for PRO report', () => {
    expect(getPriceConfig('es', 'pro_report')?.amount).toBe(14.9);
    expect(getPriceConfig('pt', 'pro_report')?.amount).toBe(14.9);
    expect(getPriceConfig('it', 'pro_report')?.amount).toBe(14.9);
    expect(getPriceConfig('uk', 'pro_report')?.amount).toBe(19.9);
    expect(getPriceConfig('us', 'pro_report')?.amount).toBe(19.9);
    expect(getPriceConfig('mx', 'pro_report')?.amount).toBe(199);
    expect(getPriceConfig('au', 'pro_report')?.amount).toBe(24.9);
    expect(getPriceConfig('ie', 'pro_report')?.amount).toBe(14.9);
  });

  it('applies market pricing strategy table for Radar tiers', () => {
    expect(getPriceConfig('es', 'radar_basic')?.amount).toBe(9);
    expect(getPriceConfig('es', 'radar_investor')?.amount).toBe(39);
    expect(getPriceConfig('it', 'radar_pro')?.amount).toBe(24);
    expect(getPriceConfig('uk', 'radar_investor')?.amount).toBe(59);
    expect(getPriceConfig('us', 'radar_basic')?.amount).toBe(19);
    expect(getPriceConfig('mx', 'radar_pro')?.amount).toBe(299);
    expect(getPriceConfig('au', 'radar_pro')?.amount).toBe(59);
    expect(getPriceConfig('ie', 'radar_investor')?.amount).toBe(79);
  });

  it('uses correct currency per market', () => {
    expect(getPriceConfig('uk', 'pro_report')?.currency).toBe('GBP');
    expect(getPriceConfig('mx', 'pro_report')?.currency).toBe('MXN');
    expect(getPriceConfig('au', 'pro_report')?.currency).toBe('AUD');
    expect(getPriceConfig('ie', 'pro_report')?.currency).toBe('EUR');
  });

  it('tags each market with a pricing strategy', () => {
    expect(getMarketPricingStrategy('es')).toBe('competitive_low');
    expect(getMarketPricingStrategy('pt')).toBe('scale_competitive');
    expect(getMarketPricingStrategy('mx')).toBe('scale');
    expect(getMarketPricingStrategy('uk')).toBe('competitive_premium');
  });

  it('keeps tier table in sync with eight markets', () => {
    expect(Object.keys(MARKET_PRICE_TIERS)).toHaveLength(8);
  });

  it('does not accept price id from frontend — env only', () => {
    const env = { STRIPE_PRICE_REPORT_EUR: 'price_from_env' };
    const config = getPriceConfig('es', 'pro_report')!;
    expect(resolveStripePriceId(config.stripePriceEnvKey, env)).toBe('price_from_env');
    expect(resolveStripePriceId('FAKE_KEY', env)).toBeUndefined();
  });
});
