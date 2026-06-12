import type { ListingProvider } from '../ListingProvider';
import type { InvestorCriteria, Listing } from '../types';

const NOT_CONFIGURED_MSG =
  'Authorized API provider not configured. Add an approved API integration before enabling this provider.';

/**
 * Placeholder para integraciones con APIs oficiales/autorizadas.
 * NO implementa scraping ni endpoints de portales sin autorización.
 * Compatible con fuentes autorizadas en el futuro (p. ej. API de partner con contrato).
 */
export const authorizedApiProvider: ListingProvider = {
  name: 'Authorized API Provider (not configured)',
  async search(_criteria: InvestorCriteria): Promise<Listing[]> {
    throw new Error(NOT_CONFIGURED_MSG);
  },
  async getById(_id: string): Promise<Listing | null> {
    throw new Error(NOT_CONFIGURED_MSG);
  },
};

export { NOT_CONFIGURED_MSG };
