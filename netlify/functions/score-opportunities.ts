import type { Handler } from '@netlify/functions';

/**
 * Job futuro: puntuar oportunidades para búsquedas guardadas.
 * Usa solo ListingProvider autorizado o snapshots en BD.
 * TODO: leer saved_searches + listing_snapshots, escribir opportunity_scores.
 */
export const handler: Handler = async () => {
  if (process.env.ENABLE_AUTHORIZED_LISTING_PROVIDER !== 'true') {
    return {
      statusCode: 403,
      body: JSON.stringify({ error: 'Scoring batch disabled until authorized data source is configured.' }),
    };
  }

  return {
    statusCode: 501,
    body: JSON.stringify({ error: 'score-opportunities job not implemented. Requires Supabase + authorized provider.' }),
  };
};
