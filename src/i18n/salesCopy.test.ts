import { describe, expect, it } from 'vitest';
import { MARKETS } from '@/config/markets';
import { getPricingPageCopy } from './pricingCopy';
import { getProReportPageCopy } from './proReportCopy';
import { getProVisualCopy } from './proVisualCopy';

describe('sales i18n', () => {
  it('has pricing copy for each market language', () => {
    const langs = new Set(MARKETS.map((m) => m.language));
    for (const lang of langs) {
      const copy = getPricingPageCopy(lang);
      expect(copy.heroTitle.length).toBeGreaterThan(10);
      expect(copy.proFeatures.length).toBeGreaterThanOrEqual(8);
      expect(copy.faq.length).toBeGreaterThanOrEqual(4);
    }
  });

  it('has pro report sections in each language', () => {
    expect(getProReportPageCopy('es').sections).toHaveLength(8);
    expect(getProReportPageCopy('en').sections[0].title).toBe('Net yield');
    expect(getProReportPageCopy('pt').sections[0].title).toContain('líquida');
    expect(getProReportPageCopy('it').sections[0].title).toContain('netto');
  });

  it('localises visual mock labels', () => {
    expect(getProVisualCopy('es').executiveSummary).toBe('Resumen ejecutivo');
    expect(getProVisualCopy('en').executiveSummary).toBe('Executive summary');
    expect(getProVisualCopy('pt').checklistItems).toHaveLength(5);
  });
});
