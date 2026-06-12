import { getMarket, isValidMarketSlug, MARKET_SLUGS } from '@/config/markets';
import type { MarketConfig, MarketSlug } from '@/config/types';

export class InvalidMarketError extends Error {
  constructor(slug: string) {
    super(`Invalid market slug: ${slug}`);
    this.name = 'InvalidMarketError';
  }
}

export function validateMarketSlug(slug: string): MarketSlug {
  if (!isValidMarketSlug(slug)) {
    throw new InvalidMarketError(slug);
  }
  return slug;
}

export function getValidatedMarket(slug: string): MarketConfig {
  return getMarket(validateMarketSlug(slug));
}

export function getAllMarketConfigs(): MarketConfig[] {
  return MARKET_SLUGS.map((s) => getMarket(s));
}
