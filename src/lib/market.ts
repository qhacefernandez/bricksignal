export {
  getMarket,
  isValidMarketSlug,
  MARKETS,
  MARKETS_BY_SLUG,
  MARKET_SLUGS,
} from '@/config/markets';

export { DEFAULT_MARKET_SLUG, MARKET_PREFERRED_STORAGE_KEY } from '@/config/featureFlags';

import { DEFAULT_MARKET_SLUG, MARKET_PREFERRED_STORAGE_KEY } from '@/config/featureFlags';
import { getMarket, isValidMarketSlug } from '@/config/markets';
import type { MarketConfig, MarketSlug } from '@/config/types';

export function getMarketOrThrow(slug: string): MarketConfig {
  if (!isValidMarketSlug(slug)) {
    throw new Error(`Invalid market slug: ${slug}`);
  }
  return getMarket(slug);
}

export function savePreferredMarket(slug: MarketSlug): void {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem(MARKET_PREFERRED_STORAGE_KEY, slug);
}

export function loadPreferredMarket(): MarketSlug {
  if (typeof localStorage === 'undefined') return DEFAULT_MARKET_SLUG;
  const saved = localStorage.getItem(MARKET_PREFERRED_STORAGE_KEY);
  if (saved && isValidMarketSlug(saved)) return saved;
  return DEFAULT_MARKET_SLUG;
}

export function hasExplicitPreferredMarket(): boolean {
  if (typeof localStorage === 'undefined') return false;
  const saved = localStorage.getItem(MARKET_PREFERRED_STORAGE_KEY);
  return !!(saved && isValidMarketSlug(saved));
}

export function scenarioStorageKey(market: MarketSlug): string {
  return `bricksignal-scenario-${market}`;
}

export function proAccessStorageKey(market: MarketSlug): string {
  return `bricksignal-pro-access-${market}`;
}
