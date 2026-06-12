import type { Handler } from '@netlify/functions';
import type Stripe from 'stripe';
import { getStripeClient, isStripeConfigured } from '../../src/config/stripeClient';

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET?.trim();

/**
 * Webhook Stripe — preparado para Supabase.
 * v1: registra eventos en logs. NO concede acceso Pro vía localStorage.
 * TODO: persistir en tabla subscriptions (ver docs/database-schema.md).
 */
export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' };
  }

  if (!isStripeConfigured() || !webhookSecret) {
    console.warn('stripe-webhook: STRIPE_SECRET_KEY o STRIPE_WEBHOOK_SECRET no configurados');
    return { statusCode: 500, body: 'Webhook no configurado' };
  }

  const stripe = getStripeClient();
  const signature = event.headers['stripe-signature'];

  if (!signature || !event.body) {
    return { statusCode: 400, body: 'Missing signature or body' };
  }

  let stripeEvent: Stripe.Event;
  try {
    stripeEvent = stripe.webhooks.constructEvent(event.body, signature, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Invalid signature';
    console.error('stripe-webhook signature error:', message);
    return { statusCode: 400, body: `Webhook Error: ${message}` };
  }

  switch (stripeEvent.type) {
    case 'checkout.session.completed': {
      const session = stripeEvent.data.object as Stripe.Checkout.Session;
      console.info('[webhook] checkout.session.completed', {
        sessionId: session.id,
        mode: session.mode,
        customer: session.customer,
        subscription: session.subscription,
        metadata: session.metadata,
      });
      // TODO: upsert subscriptions table in Supabase
      break;
    }
    case 'customer.subscription.created':
    case 'customer.subscription.updated':
    case 'customer.subscription.deleted': {
      const sub = stripeEvent.data.object as Stripe.Subscription;
      const periodEnd = (sub as Stripe.Subscription & { current_period_end?: number }).current_period_end;
      console.info(`[webhook] ${stripeEvent.type}`, {
        subscriptionId: sub.id,
        status: sub.status,
        customerId: sub.customer,
        priceId: sub.items.data[0]?.price.id,
        currentPeriodEnd: periodEnd,
      });
      // TODO: sync subscription status to Supabase
      break;
    }
    case 'invoice.paid':
    case 'invoice.payment_failed': {
      const invoice = stripeEvent.data.object as Stripe.Invoice;
      const subscriptionId =
        typeof invoice.parent?.subscription_details?.subscription === 'string'
          ? invoice.parent.subscription_details.subscription
          : undefined;
      console.info(`[webhook] ${stripeEvent.type}`, {
        invoiceId: invoice.id,
        customerId: invoice.customer,
        subscriptionId,
      });
      break;
    }
    default:
      console.info('[webhook] unhandled event', stripeEvent.type);
  }

  return { statusCode: 200, body: JSON.stringify({ received: true }) };
};
