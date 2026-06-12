import type { InvestorCriteria, Listing } from './types';

export interface ListingProvider {
  name: string;
  search(criteria: InvestorCriteria): Promise<Listing[]>;
  getById(id: string): Promise<Listing | null>;
}
