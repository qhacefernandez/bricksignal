import type { ListingProvider } from '../ListingProvider';
import type { InvestorCriteria, Listing } from '../types';

const MANUAL_STORAGE_KEY = 'bricksignal-manual-listings';

function loadManualListings(): Listing[] {
  if (typeof localStorage === 'undefined') return [];
  try {
    const raw = localStorage.getItem(MANUAL_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Listing[];
  } catch {
    return [];
  }
}

function matchesCriteria(listing: Listing, criteria: InvestorCriteria): boolean {
  const cityMatch =
    !criteria.targetCity ||
    listing.city.toLowerCase() === criteria.targetCity.toLowerCase();
  const priceMatch = listing.price <= criteria.maxPrice;
  return cityMatch && priceMatch;
}

/** Listings introducidos manualmente por el usuario (localStorage). */
export const manualProvider: ListingProvider = {
  name: 'Manual User Input Provider',
  async search(criteria: InvestorCriteria): Promise<Listing[]> {
    return loadManualListings().filter((l) => matchesCriteria(l, criteria));
  },
  async getById(id: string): Promise<Listing | null> {
    return loadManualListings().find((l) => l.id === id) ?? null;
  },
};

export function saveManualListing(listing: Listing): void {
  if (typeof localStorage === 'undefined') return;
  const existing = loadManualListings();
  const idx = existing.findIndex((l) => l.id === listing.id);
  if (idx >= 0) existing[idx] = listing;
  else existing.push(listing);
  localStorage.setItem(MANUAL_STORAGE_KEY, JSON.stringify(existing));
}
