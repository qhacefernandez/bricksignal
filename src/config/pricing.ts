import type { CurrencyCode, MarketPricing, MarketSlug, ProductType } from './types';

export type PricingVariant = 'control' | 'variant';

/** Estrategia de pricing documentada por mercado (referencia interna / analytics). */
export type MarketPricingStrategy =
  | 'competitive_low'
  | 'scale_competitive'
  | 'competitive'
  | 'competitive_premium'
  | 'aggressive_competitive'
  | 'scale';

export interface MarketPriceTier {
  strategy: MarketPricingStrategy;
  proReport: number;
  radarBasic: number;
  radarPro: number;
  radarInvestor: number;
}

/**
 * Precios de referencia por mercado (UI + resolución de env Stripe).
 * Los Price IDs reales viven en variables STRIPE_PRICE_* por divisa.
 */
export const MARKET_PRICE_TIERS: Record<MarketSlug, MarketPriceTier> = {
  /** España — competitivo bajo · mercado grande, muchas alternativas gratis */
  es: { strategy: 'competitive_low', proReport: 14.9, radarBasic: 9, radarPro: 19, radarInvestor: 39 },
  /** Portugal — escala/competitivo · sensibilidad alta, mercado menor */
  pt: { strategy: 'scale_competitive', proReport: 14.9, radarBasic: 9, radarPro: 19, radarInvestor: 39 },
  /** Italia — competitivo · equilibrio tamaño / pricing */
  it: { strategy: 'competitive', proReport: 14.9, radarBasic: 12, radarPro: 24, radarInvestor: 49 },
  /** UK — competitivo premium · cultura buy-to-let */
  uk: { strategy: 'competitive_premium', proReport: 19.9, radarBasic: 14, radarPro: 29, radarInvestor: 59 },
  /** US — competitivo agresivo · mercado enorme, competencia alta */
  us: { strategy: 'aggressive_competitive', proReport: 19.9, radarBasic: 19, radarPro: 39, radarInvestor: 79 },
  /** México — escala · alta sensibilidad, volumen */
  mx: { strategy: 'scale', proReport: 199, radarBasic: 149, radarPro: 299, radarInvestor: 599 },
  /** Australia — competitivo premium · mercado acostumbrado a datos caros */
  au: { strategy: 'competitive_premium', proReport: 24.9, radarBasic: 29, radarPro: 59, radarInvestor: 99 },
  /** Irlanda — competitivo premium · alto valor percibido, mercado pequeño */
  ie: { strategy: 'competitive_premium', proReport: 14.9, radarBasic: 19, radarPro: 39, radarInvestor: 79 },
};

const MARKET_CURRENCY: Record<MarketSlug, CurrencyCode> = {
  es: 'EUR',
  pt: 'EUR',
  it: 'EUR',
  ie: 'EUR',
  uk: 'GBP',
  us: 'USD',
  mx: 'MXN',
  au: 'AUD',
};

/** A/B pricing — variant reservado para experimentos; control = MARKET_PRICE_TIERS */
export const PRICING_AB = {
  activePricingVariant: 'control' as PricingVariant,
  proReportPriceControl: Object.fromEntries(
    (Object.keys(MARKET_PRICE_TIERS) as MarketSlug[]).map((slug) => [slug, MARKET_PRICE_TIERS[slug].proReport]),
  ) as Record<MarketSlug, number>,
  proReportPriceVariant: Object.fromEntries(
    (Object.keys(MARKET_PRICE_TIERS) as MarketSlug[]).map((slug) => [slug, MARKET_PRICE_TIERS[slug].proReport]),
  ) as Record<MarketSlug, number>,
};

function reportAmount(market: MarketSlug): number {
  if (PRICING_AB.activePricingVariant === 'variant') {
    return PRICING_AB.proReportPriceVariant[market];
  }
  return MARKET_PRICE_TIERS[market].proReport;
}

function report(currency: CurrencyCode, market: MarketSlug): MarketPricing['reportPrice'] {
  return {
    amount: reportAmount(market),
    currency,
    stripePriceEnvKey: `STRIPE_PRICE_REPORT_${currency}`,
  };
}

function radarFromTier(currency: CurrencyCode, tier: MarketPriceTier) {
  const mk = (amount: number, plan: string) => ({
    amount,
    currency,
    interval: 'month' as const,
    stripePriceEnvKey: `STRIPE_PRICE_RADAR_${plan}_${currency}`,
  });
  return {
    radarBasic: mk(tier.radarBasic, 'BASIC'),
    radarPro: mk(tier.radarPro, 'PRO'),
    radarInvestor: mk(tier.radarInvestor, 'INVESTOR'),
  };
}

function buildMarketPricing(slug: MarketSlug): MarketPricing {
  const currency = MARKET_CURRENCY[slug];
  const tier = MARKET_PRICE_TIERS[slug];
  return {
    reportPrice: report(currency, slug),
    ...radarFromTier(currency, tier),
  };
}

export const MARKET_PRICING: Record<MarketSlug, MarketPricing> = {
  es: buildMarketPricing('es'),
  pt: buildMarketPricing('pt'),
  it: buildMarketPricing('it'),
  uk: buildMarketPricing('uk'),
  us: buildMarketPricing('us'),
  mx: buildMarketPricing('mx'),
  au: buildMarketPricing('au'),
  ie: buildMarketPricing('ie'),
};

export function getMarketPricingStrategy(market: MarketSlug): MarketPricingStrategy {
  return MARKET_PRICE_TIERS[market].strategy;
}

export function getActivePricingVariant(): PricingVariant {
  return PRICING_AB.activePricingVariant;
}

/** Informes PRO incluidos por cada pago único (1 = un inmueble/escenario). */
export const REPORTS_PER_PURCHASE = 1;

export function getReportsPerPurchase(): number {
  return REPORTS_PER_PURCHASE;
}

export function getPriceConfig(market: MarketSlug, productType: ProductType) {
  const pricing = MARKET_PRICING[market];
  switch (productType) {
    case 'pro_report':
      return pricing.reportPrice;
    case 'radar_basic':
      return pricing.radarBasic;
    case 'radar_pro':
      return pricing.radarPro;
    case 'radar_investor':
      return pricing.radarInvestor;
  }
}

export function resolveStripePriceId(envKey: string, env: Record<string, string | undefined>): string | undefined {
  return env[envKey];
}
