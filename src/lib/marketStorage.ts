import type { MarketSlug } from '@/config/types';
import type { BasicSimulatorInput } from './calculations/basic';
import { track } from './analytics';
import type { ProAccess, SimulatorInput } from './types';

export function scenarioStorageKey(market: MarketSlug): string {
  return `bricksignal-scenario-${market}`;
}

export function basicScenarioStorageKey(market: MarketSlug): string {
  return `bricksignal-basic-scenario-${market}`;
}

export function saveBasicScenario(market: MarketSlug, input: BasicSimulatorInput): void {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem(basicScenarioStorageKey(market), JSON.stringify(input));
}

export function loadBasicScenario(market: MarketSlug): BasicSimulatorInput | null {
  if (typeof localStorage === 'undefined') return null;
  const raw = localStorage.getItem(basicScenarioStorageKey(market));
  if (!raw) return null;
  try {
    return JSON.parse(raw) as BasicSimulatorInput;
  } catch {
    return null;
  }
}

export function proAccessStorageKey(market: MarketSlug): string {
  return `bricksignal-pro-access-${market}`;
}

export function saveScenario(market: MarketSlug, input: SimulatorInput): void {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem(scenarioStorageKey(market), JSON.stringify(input));
}

export function loadScenario(market: MarketSlug): SimulatorInput | null {
  if (typeof localStorage === 'undefined') return null;
  const raw = localStorage.getItem(scenarioStorageKey(market));
  if (!raw) return null;
  try {
    return JSON.parse(raw) as SimulatorInput;
  } catch {
    return null;
  }
}

export function saveProAccess(market: MarketSlug, access: ProAccess): void {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem(proAccessStorageKey(market), JSON.stringify(access));
}

export function loadProAccess(market: MarketSlug): ProAccess | null {
  if (typeof localStorage === 'undefined') return null;
  const raw = localStorage.getItem(proAccessStorageKey(market));
  if (!raw) return null;
  try {
    return JSON.parse(raw) as ProAccess;
  } catch {
    return null;
  }
}

export type VerifyProSessionResult =
  | { ok: true }
  | { ok: false; reason: 'network' | 'unpaid' | 'server' | 'invalid_session' };

export async function verifyProSession(sessionId: string): Promise<VerifyProSessionResult> {
  if (!sessionId.startsWith('cs_')) {
    return { ok: false, reason: 'invalid_session' };
  }
  try {
    const res = await fetch('/.netlify/functions/verify-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId }),
    });
    const data = (await res.json().catch(() => ({}))) as {
      paid?: boolean;
      paymentStatus?: string;
      error?: string;
    };
    if (!res.ok) {
      return { ok: false, reason: res.status === 404 ? 'network' : 'server' };
    }
    if (data.paid === true) return { ok: true };
    return { ok: false, reason: 'unpaid' };
  } catch {
    return { ok: false, reason: 'network' };
  }
}

export async function hasProAccess(market: MarketSlug): Promise<boolean> {
  const access = loadProAccess(market);
  if (!access?.sessionId) return false;
  const result = await verifyProSession(access.sessionId);
  return result.ok;
}

export async function startCheckout(
  marketSlug: MarketSlug,
  productType: 'pro_report' | 'radar_basic' | 'radar_pro' | 'radar_investor',
): Promise<void> {
  track('checkout_started', { marketSlug, productType });
  const endpoint =
    productType === 'pro_report'
      ? '/.netlify/functions/create-checkout-session'
      : '/.netlify/functions/create-subscription-checkout-session';

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ marketSlug, productType }),
  });

  if (!res.ok) {
    const err = (await res.json().catch(() => ({}))) as { error?: string };
    throw new Error(err.error ?? 'Payment error');
  }

  const data = (await res.json()) as { url?: string };
  if (!data.url) throw new Error('Invalid payment response');
  window.location.href = data.url;
}

