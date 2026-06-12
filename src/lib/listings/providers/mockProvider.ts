import { getMarket } from '@/config/markets';
import type { MarketConfig, MarketSlug } from '@/config/types';
import type { ListingProvider } from '../ListingProvider';
import type { InvestorCriteria, Listing } from '../types';

const PRICE_MULTIPLIERS: Record<MarketSlug, number> = {
  es: 1, pt: 1.1, it: 1.2, uk: 1.1, us: 1.8, mx: 18, au: 3.5, ie: 1.3,
};

const RENT_RATIOS = [0.0055, 0.0062, 0.0058, 0.0065, 0.0048, 0.0052];

function generateListings(market: MarketConfig): Listing[] {
  const mult = PRICE_MULTIPLIERS[market.slug];
  const basePrice = market.code === 'MX' ? 1_800_000 : market.code === 'US' ? 220_000 : 140_000;
  const cities = market.mockCities;
  const districts = ['Centre', 'North', 'South', 'East'];

  return cities.flatMap((city, ci) =>
    districts.slice(0, 2).map((district, di) => {
      const idx = ci * 2 + di;
      const price = Math.round(basePrice * mult * (0.85 + idx * 0.08));
      const sizeM2 = market.defaultAreaUnit === 'sqft' ? 55 + idx * 8 : 48 + idx * 10;
      const monthlyRent = Math.round(price * RENT_RATIOS[idx % RENT_RATIOS.length]! / 12);
      const needsReno = idx % 3 === 1;

      return {
        id: `mock-${market.slug}-${idx}`,
        source: 'mock' as const,
        title: `${market.language === 'es' ? 'Piso demo' : market.language === 'pt' ? 'Imóvel demo' : market.language === 'it' ? 'Immobile demo' : 'Demo property'} ${city}`,
        city,
        district,
        price,
        sizeM2,
        rooms: 1 + (idx % 3),
        bathrooms: 1,
        floor: (idx % 5) + 1,
        hasElevator: idx % 2 === 0,
        condition: needsReno ? 'needs_renovation' : 'ready',
        estimatedRenovationCost: needsReno ? Math.round(price * 0.08) : 0,
        estimatedMonthlyRent: monthlyRent,
        communityFeesAnnual: Math.round(monthlyRent * 0.8),
        ibiAnnual: Math.round(price * 0.003),
        otherAnnualCosts: Math.round(monthlyRent * 0.2),
        publishedAt: '2026-05-01T10:00:00Z',
        updatedAt: '2026-06-01T10:00:00Z',
      };
    }),
  );
}

const CACHE: Partial<Record<MarketSlug, Listing[]>> = {};

function getListings(marketSlug: MarketSlug): Listing[] {
  if (!CACHE[marketSlug]) {
    CACHE[marketSlug] = generateListings(getMarket(marketSlug));
  }
  return CACHE[marketSlug]!;
}

function matchesCriteria(listing: Listing, criteria: InvestorCriteria): boolean {
  const cityMatch = !criteria.targetCity || listing.city.toLowerCase().includes(criteria.targetCity.toLowerCase());
  return cityMatch && listing.price <= criteria.maxPrice && listing.estimatedRenovationCost <= criteria.maxRenovationCost;
}

export function createMockProvider(marketSlug: MarketSlug): ListingProvider {
  return {
    name: `Mock Demo Provider (${marketSlug})`,
    async search(criteria: InvestorCriteria): Promise<Listing[]> {
      return getListings(marketSlug).filter((l) => matchesCriteria(l, criteria));
    },
    async getById(id: string): Promise<Listing | null> {
      return getListings(marketSlug).find((l) => l.id === id) ?? null;
    },
  };
}

/** @deprecated use createMockProvider(marketSlug) */
export const mockProvider = createMockProvider('es');
