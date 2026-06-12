import { getMarket, isValidMarketSlug } from './markets';
import { getPriceConfig, resolveStripePriceId } from './pricing';
import type { MarketSlug, ProductType } from './types';

export type CheckoutRequest = {
  marketSlug: string;
  productType: ProductType;
};

export function validateCheckoutRequest(body: unknown): CheckoutRequest {
  if (!body || typeof body !== 'object') throw new CheckoutError('Invalid JSON body');
  const { marketSlug, productType } = body as CheckoutRequest;
  if (!marketSlug || !isValidMarketSlug(marketSlug)) {
    throw new CheckoutError('Invalid market slug');
  }
  const validProducts: ProductType[] = ['pro_report', 'radar_basic', 'radar_pro', 'radar_investor'];
  if (!productType || !validProducts.includes(productType)) {
    throw new CheckoutError('Invalid product type');
  }
  return { marketSlug, productType };
}

export class CheckoutError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CheckoutError';
  }
}

export function resolveCheckoutPrice(
  marketSlug: MarketSlug,
  productType: ProductType,
  env: Record<string, string | undefined>,
): { priceId: string; mode: 'payment' | 'subscription' } {
  const market = getMarket(marketSlug);

  if (productType !== 'pro_report' && !market.features.subscriptions) {
    throw new CheckoutError('Radar subscriptions are not enabled for this market yet.');
  }

  const priceConfig = getPriceConfig(marketSlug, productType);
  if (!priceConfig) {
    throw new CheckoutError(`Pricing not configured for ${productType} in ${marketSlug}`);
  }

  const priceId = resolveStripePriceId(priceConfig.stripePriceEnvKey, env);
  if (!priceId) {
    throw new CheckoutError(`Stripe price not configured: ${priceConfig.stripePriceEnvKey}`);
  }
  if (priceId.startsWith('prod_')) {
    throw new CheckoutError(
      `${priceConfig.stripePriceEnvKey} usa un Product ID (prod_...). Debe ser un Price ID (price_...). En Stripe → Productos → abre el precio y copia el ID que empieza por price_.`,
    );
  }
  if (!priceId.startsWith('price_')) {
    throw new CheckoutError(`${priceConfig.stripePriceEnvKey} debe ser un Price ID válido (price_...).`);
  }

  return {
    priceId,
    mode: productType === 'pro_report' ? 'payment' : 'subscription',
  };
}
