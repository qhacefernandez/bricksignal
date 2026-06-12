import {
  PRO_ACCESS_STORAGE_KEY,
  SCENARIO_STORAGE_KEY,
  type ProAccess,
  type SimulatorInput,
} from './types';

export function saveScenario(input: SimulatorInput): void {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem(SCENARIO_STORAGE_KEY, JSON.stringify(input));
}

export function loadScenario(): SimulatorInput | null {
  if (typeof localStorage === 'undefined') return null;
  const raw = localStorage.getItem(SCENARIO_STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as SimulatorInput;
  } catch {
    return null;
  }
}

export function saveProAccess(access: ProAccess): void {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem(PRO_ACCESS_STORAGE_KEY, JSON.stringify(access));
}

export function loadProAccess(): ProAccess | null {
  if (typeof localStorage === 'undefined') return null;
  const raw = localStorage.getItem(PRO_ACCESS_STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as ProAccess;
  } catch {
    return null;
  }
}

export async function verifyProSession(sessionId: string): Promise<boolean> {
  try {
    const res = await fetch('/.netlify/functions/verify-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId }),
    });
    if (!res.ok) return false;
    const data = (await res.json()) as { paid?: boolean };
    return data.paid === true;
  } catch {
    return false;
  }
}

export async function hasProAccess(): Promise<boolean> {
  const access = loadProAccess();
  if (!access?.sessionId) return false;
  return verifyProSession(access.sessionId);
}

export async function startCheckout(): Promise<void> {
  const res = await fetch('/.netlify/functions/create-checkout-session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({}),
  });

  if (!res.ok) {
    const err = (await res.json().catch(() => ({}))) as { error?: string };
    throw new Error(err.error ?? 'No se pudo iniciar el pago. Inténtalo de nuevo.');
  }

  const data = (await res.json()) as { url?: string };
  if (!data.url) throw new Error('Respuesta de pago inválida.');
  window.location.href = data.url;
}
