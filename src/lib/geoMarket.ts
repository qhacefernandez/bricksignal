import type { MarketSlug } from '@/config/types';

/** ISO 3166-1 alpha-2 → BrickSignal market slug */
export const COUNTRY_CODE_TO_MARKET: Record<string, MarketSlug> = {
  ES: 'es',
  PT: 'pt',
  IT: 'it',
  GB: 'uk',
  US: 'us',
  MX: 'mx',
  AU: 'au',
  IE: 'ie',
};

export function marketSlugFromCountryCode(countryCode: string | null | undefined): MarketSlug | null {
  if (!countryCode) return null;
  return COUNTRY_CODE_TO_MARKET[countryCode.toUpperCase()] ?? null;
}

const LOCALE_HINTS: Array<{ prefix: string; slug: MarketSlug }> = [
  { prefix: 'es-mx', slug: 'mx' },
  { prefix: 'es', slug: 'es' },
  { prefix: 'pt', slug: 'pt' },
  { prefix: 'it', slug: 'it' },
  { prefix: 'en-gb', slug: 'uk' },
  { prefix: 'en-au', slug: 'au' },
  { prefix: 'en-ie', slug: 'ie' },
  { prefix: 'en-us', slug: 'us' },
];

/** Soft hint when IP geo is unavailable — never auto-redirects on locale alone. */
export function marketSlugFromBrowserLocale(): MarketSlug | null {
  if (typeof navigator === 'undefined') return null;
  const locales = [...navigator.languages, navigator.language]
    .filter(Boolean)
    .map((l) => l.toLowerCase());
  for (const locale of locales) {
    const match = LOCALE_HINTS.find(({ prefix }) => locale.startsWith(prefix));
    if (match) return match.slug;
  }
  return null;
}
