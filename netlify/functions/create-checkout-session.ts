import type { Handler } from '@netlify/functions';
import Stripe from 'stripe';
import { getStripeClient, isStripeConfigured, stripeErrorMessage } from '../../src/config/stripeClient';
import { CheckoutError, resolveCheckoutPrice, validateCheckoutRequest } from '../../src/config/stripeServer';

const siteUrl = process.env.PUBLIC_SITE_URL || 'http://localhost:8888';

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  if (!isStripeConfigured()) {
    return { statusCode: 500, body: JSON.stringify({ error: 'Stripe not configured.' }) };
  }

  try {
    const body = JSON.parse(event.body ?? '{}');
    const { marketSlug, productType } = validateCheckoutRequest(body);

    if (productType !== 'pro_report') {
      return { statusCode: 400, body: JSON.stringify({ error: 'Use subscription endpoint for radar plans.' }) };
    }

    const { priceId } = resolveCheckoutPrice(marketSlug as import('../../src/config/types').MarketSlug, productType, process.env);
    const stripe = getStripeClient();

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${siteUrl}/${marketSlug}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/${marketSlug}/cancel`,
      metadata: { product: 'bricksignal_pro_report', marketSlug, productType },
    });

    if (!session.url) {
      return { statusCode: 500, body: JSON.stringify({ error: 'Could not create checkout session.' }) };
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: session.url, sessionId: session.id }),
    };
  } catch (err) {
    if (err instanceof CheckoutError) {
      return { statusCode: 400, body: JSON.stringify({ error: err.message }) };
    }
    const message = stripeErrorMessage(err);
    console.error('create-checkout-session:', err);
    const status = err instanceof Stripe.errors.StripeConnectionError ? 503 : 500;
    return { statusCode: status, body: JSON.stringify({ error: message }) };
  }
};
