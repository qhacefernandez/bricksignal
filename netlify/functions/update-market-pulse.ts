import type { Handler } from '@netlify/functions';

/**
 * Scheduled function placeholder — DESACTIVADA por defecto.
 * ENABLE_MARKET_PULSE_AUTO_UPDATE debe ser true para ejecutar lógica futura.
 *
 * Limitación Netlify: no escribir archivos persistentes en runtime.
 * Para persistencia real usar Supabase, GitHub Action o almacenamiento externo.
 * No hacer scraping de portales inmobiliarios.
 */
const ENABLE_MARKET_PULSE_AUTO_UPDATE = false;

export const handler: Handler = async () => {
  if (!ENABLE_MARKET_PULSE_AUTO_UPDATE) {
    return {
      statusCode: 200,
      body: JSON.stringify({
        ok: true,
        skipped: true,
        message:
          'Auto-update disabled. Set ENABLE_MARKET_PULSE_AUTO_UPDATE=true and configure external persistence.',
      }),
    };
  }

  return {
    statusCode: 501,
    body: JSON.stringify({
      ok: false,
      message: 'Not implemented — use scripts/update-market-pulse-es.ts for manual updates.',
    }),
  };
};
