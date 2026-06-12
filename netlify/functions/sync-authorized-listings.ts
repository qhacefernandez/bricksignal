import type { Handler } from '@netlify/functions';

/**
 * Job futuro: sincronizar listings desde ListingProvider autorizado.
 * NO ejecuta scraping. Requiere ENABLE_AUTHORIZED_LISTING_PROVIDER=true.
 * TODO: conectar authorizedApiProvider + Supabase listing_snapshots.
 */
export const handler: Handler = async () => {
  if (process.env.ENABLE_AUTHORIZED_LISTING_PROVIDER !== 'true') {
    return {
      statusCode: 403,
      body: JSON.stringify({
        error: 'Authorized listing provider disabled. Set ENABLE_AUTHORIZED_LISTING_PROVIDER=true after configuring an approved API.',
      }),
    };
  }

  console.info('[sync-authorized-listings] Job placeholder — no provider configured');
  return {
    statusCode: 501,
    body: JSON.stringify({
      error: 'Authorized API provider not configured. Add an approved API integration before enabling this job.',
    }),
  };
};
