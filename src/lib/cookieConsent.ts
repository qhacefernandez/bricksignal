import { COOKIE_CONSENT_STORAGE_KEY } from '@/config/featureFlags';

export type CookieConsentLevel = 'all' | 'necessary';

export interface CookieConsent {
  level: CookieConsentLevel;
  updatedAt: string;
}

function parseConsent(raw: string | null): CookieConsent | null {
  if (!raw) return null;
  try {
    const data = JSON.parse(raw) as CookieConsent;
    if (data.level === 'all' || data.level === 'necessary') return data;
  } catch {
    return null;
  }
  return null;
}

export function getCookieConsent(): CookieConsent | null {
  if (typeof localStorage === 'undefined') return null;
  return parseConsent(localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY));
}

export function saveCookieConsent(level: CookieConsentLevel): CookieConsent {
  const consent: CookieConsent = { level, updatedAt: new Date().toISOString() };
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(COOKIE_CONSENT_STORAGE_KEY, JSON.stringify(consent));
  }
  if (level === 'all') {
    loadAnalyticsScript();
  }
  return consent;
}

export function hasAnalyticsConsent(): boolean {
  return getCookieConsent()?.level === 'all';
}

export function loadAnalyticsScript(): void {
  if (typeof document === 'undefined') return;
  if (!hasAnalyticsConsent()) return;

  const domain = import.meta.env.PUBLIC_PLAUSIBLE_DOMAIN;
  if (!domain) return;
  if (document.querySelector('script[data-plausible-loader]')) return;

  const script = document.createElement('script');
  script.defer = true;
  script.dataset.domain = domain;
  script.src = 'https://plausible.io/js/script.js';
  script.setAttribute('data-plausible-loader', '1');
  document.head.appendChild(script);
}

export function applyStoredCookieConsent(): boolean {
  if (!hasAnalyticsConsent()) return false;
  loadAnalyticsScript();
  return true;
}
