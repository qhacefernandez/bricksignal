import { describe, expect, it } from 'vitest';
import { MARKETS } from '@/config/markets';
import { getLegalDocument, getMarketLegalPages } from '@/i18n/legal';

describe('legal pages', () => {
  it('provides legal, privacy and cookies for every market', () => {
    for (const market of MARKETS) {
      const pages = getMarketLegalPages(market);
      expect(pages.legal.sections.length).toBeGreaterThanOrEqual(6);
      expect(pages.privacy.sections.length).toBeGreaterThanOrEqual(8);
      expect(pages.cookies.sections.length).toBeGreaterThanOrEqual(5);
      expect(pages.nav.legal.length).toBeGreaterThan(2);
    }
  });

  it('localises titles by market language', () => {
    expect(getLegalDocument(MARKETS.find((m) => m.slug === 'es')!, 'legal').title).toContain('Aviso legal');
    expect(getLegalDocument(MARKETS.find((m) => m.slug === 'uk')!, 'privacy').title).toContain('Privacy policy');
    expect(getLegalDocument(MARKETS.find((m) => m.slug === 'pt')!, 'cookies').title).toContain('cookies');
    expect(getLegalDocument(MARKETS.find((m) => m.slug === 'mx')!, 'privacy').sections.some((s) => s.id === 'authority' && s.title.includes('México'))).toBe(true);
  });
});
