import type { Handler } from '@netlify/functions';
import Stripe from 'stripe';
import { getStripeClient, isStripeConfigured, stripeErrorMessage } from '../../src/config/stripeClient';

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  if (!isStripeConfigured()) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Stripe no configurado.' }),
    };
  }

  let sessionId: string | undefined;
  try {
    const body = JSON.parse(event.body ?? '{}') as { sessionId?: string };
    sessionId = body.sessionId;
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: 'JSON inválido' }) };
  }

  if (!sessionId || !sessionId.startsWith('cs_')) {
    return { statusCode: 400, body: JSON.stringify({ error: 'session_id inválido' }) };
  }

  try {
    const stripe = getStripeClient();
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    const paid = session.payment_status === 'paid';
    const validProduct = session.metadata?.product === 'bricksignal_pro_report';

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        paid: paid && validProduct,
        paymentStatus: session.payment_status,
      }),
    };
  } catch (err) {
    const message = stripeErrorMessage(err);
    console.error('verify-checkout-session error:', err);
    const status = err instanceof Stripe.errors.StripeConnectionError ? 503 : 500;
    return {
      statusCode: status,
      body: JSON.stringify({ error: message }),
    };
  }
};
