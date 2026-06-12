import type { Handler } from '@netlify/functions';

/**
 * Job futuro: enviar alertas email/push de nuevas oportunidades.
 * TODO: integrar email provider + tabla alerts en Supabase.
 */
export const handler: Handler = async () => {
  if (process.env.ENABLE_AUTHORIZED_LISTING_PROVIDER !== 'true') {
    return {
      statusCode: 403,
      body: JSON.stringify({ error: 'Radar alerts disabled until authorized data source is configured.' }),
    };
  }

  return {
    statusCode: 501,
    body: JSON.stringify({ error: 'send-radar-alerts job not implemented. Requires email provider + Supabase.' }),
  };
};
