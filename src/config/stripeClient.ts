import Stripe from 'stripe';

let stripeSingleton: Stripe | null = null;

function readSecretKey(): string {
  const raw = process.env.STRIPE_SECRET_KEY;
  if (!raw?.trim()) {
    throw new Error('STRIPE_SECRET_KEY no configurada');
  }
  return raw.trim().replace(/^['"]|['"]$/g, '');
}

/**
 * Lazy Stripe client for Netlify Functions.
 * Uses Node HTTP client explicitly (reliable when esbuild bundles functions).
 */
export function getStripeClient(): Stripe {
  if (!stripeSingleton) {
    stripeSingleton = new Stripe(readSecretKey(), {
      apiVersion: '2025-08-27.basil',
      maxNetworkRetries: 3,
      timeout: 30_000,
      httpClient: Stripe.createNodeHttpClient(),
      appInfo: { name: 'BrickSignal', version: '1.0.0' },
    });
  }
  return stripeSingleton;
}

export function isStripeConfigured(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY?.trim());
}

export function stripeErrorMessage(err: unknown): string {
  if (err instanceof Stripe.errors.StripeConnectionError) {
    return 'No se pudo conectar con Stripe. Comprueba tu conexión a internet y que STRIPE_SECRET_KEY sea válida (sk_test_... o sk_live_...).';
  }
  if (err instanceof Stripe.errors.StripeAuthenticationError) {
    return 'Clave secreta de Stripe inválida. Revisa STRIPE_SECRET_KEY en tu archivo .env o en Netlify.';
  }
  if (err instanceof Stripe.errors.StripeInvalidRequestError) {
    return err.message;
  }
  if (err instanceof Error) {
    return err.message;
  }
  return 'Error de pago desconocido';
}
