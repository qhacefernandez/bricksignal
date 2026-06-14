/**
 * @vitest-environment jsdom
 */
import { describe, expect, it, beforeEach } from 'vitest';
import {
  applyStoredCookieConsent,
  getCookieConsent,
  hasAnalyticsConsent,
  saveCookieConsent,
} from './cookieConsent';
import { COOKIE_CONSENT_STORAGE_KEY } from '@/config/featureFlags';

describe('cookieConsent', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('returns null when no consent saved', () => {
    expect(getCookieConsent()).toBeNull();
    expect(hasAnalyticsConsent()).toBe(false);
  });

  it('stores necessary-only consent without analytics', () => {
    saveCookieConsent('necessary');
    expect(getCookieConsent()?.level).toBe('necessary');
    expect(hasAnalyticsConsent()).toBe(false);
  });

  it('stores accept-all consent for analytics', () => {
    saveCookieConsent('all');
    expect(getCookieConsent()?.level).toBe('all');
    expect(hasAnalyticsConsent()).toBe(true);
  });

  it('reads consent from localStorage', () => {
    localStorage.setItem(
      COOKIE_CONSENT_STORAGE_KEY,
      JSON.stringify({ level: 'all', updatedAt: '2025-06-11T00:00:00.000Z' }),
    );
    expect(applyStoredCookieConsent()).toBe(true);
  });
});
