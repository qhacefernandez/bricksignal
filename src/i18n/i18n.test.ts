import { describe, expect, it } from 'vitest';
import { getMessages, t } from './messages';
import { MARKETS } from '@/config/markets';

describe('i18n', () => {
  it('has messages for each market language', () => {
    const langs = new Set(MARKETS.map((m) => m.language));
    for (const lang of langs) {
      expect(getMessages(lang)['hero.title'].length).toBeGreaterThan(10);
    }
  });

  it('translates hero per language', () => {
    expect(t('es', 'cta.calculate')).toContain('gratis');
    expect(t('en', 'cta.calculate')).toContain('free');
    expect(t('pt', 'cta.calculate')).toContain('grátis');
  });
});
