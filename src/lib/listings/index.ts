import type { MarketSlug } from '@/config/types';
import { ENABLE_AUTHORIZED_LISTING_PROVIDER } from '@/config/featureFlags';
import type { ListingProvider } from './ListingProvider';
import { authorizedApiProvider } from './providers/authorizedApiProvider';
import { manualProvider } from './providers/manualProvider';
import { createMockProvider } from './providers/mockProvider';
import type { InvestorCriteria } from './types';

export function getActiveListingProvider(marketSlug: MarketSlug): ListingProvider {
  if (ENABLE_AUTHORIZED_LISTING_PROVIDER) {
    return authorizedApiProvider;
  }
  return createMockProvider(marketSlug);
}

export async function searchOpportunities(
  criteria: InvestorCriteria,
  marketSlug: MarketSlug,
): Promise<import('./types').Listing[]> {
  const provider = getActiveListingProvider(marketSlug);
  const manual = await manualProvider.search(criteria);
  const primary = await provider.search(criteria);
  const seen = new Set<string>();
  return [...primary, ...manual].filter((l) => {
    if (seen.has(l.id)) return false;
    seen.add(l.id);
    return true;
  });
}

export * from './types';
export * from './scoring';
export * from './simulatorBridge';
export { createMockProvider } from './providers/mockProvider';
export { manualProvider } from './providers/manualProvider';
export { authorizedApiProvider, NOT_CONFIGURED_MSG } from './providers/authorizedApiProvider';
