import { GLOBAL_FEATURE_DEFAULTS } from './featureFlags';
import { MORTGAGE_PROFILES } from './mortgageProfiles';
import { MARKET_PRICING } from './pricing';
import { SEO_PROFILES } from './seoProfiles';
import { TAX_PROFILES } from './taxProfiles';
import type { MarketConfig, MarketSlug } from './types';

const BASE_FEATURES = { ...GLOBAL_FEATURE_DEFAULTS };

function legal(disclaimer: string): MarketConfig['legal'] {
  return {
    disclaimer,
    dataNotice: 'Demo data is fictional. Portal integrations require authorization or official API.',
    noAdviceNotice: 'Not financial, tax or legal advice. Returns are not guaranteed.',
  };
}

const RADAR_MSG =
  'Demo con datos ficticios. Las integraciones con portales inmobiliarios requieren autorización o API oficial.';

export const MARKETS: MarketConfig[] = [
  {
    code: 'ES', slug: 'es', name: 'Spain', nativeName: 'España',
    currency: 'EUR', locale: 'es-ES', language: 'es',
    measurementSystem: 'metric', defaultAreaUnit: 'm2',
    features: { ...BASE_FEATURES },
    defaultMortgage: MORTGAGE_PROFILES.es,
    taxProfile: TAX_PROFILES.es,
    pricing: MARKET_PRICING.es,
    seo: SEO_PROFILES.es,
    radar: { enabled: true, waitlistEnabled: true, demoEnabled: false, authorizedProviderEnabled: false, supportedStrategies: ['long_term_rental', 'room_rental', 'renovate_and_rent'], dataSourceMessage: RADAR_MSG },
    legal: legal('Herramienta orientativa. No constituye asesoramiento financiero, fiscal ni legal.'),
    mockCities: ['Madrid', 'Valencia', 'Zaragoza', 'Málaga'],
    defaultRegion: 'Madrid',
  },
  {
    code: 'PT', slug: 'pt', name: 'Portugal', nativeName: 'Portugal',
    currency: 'EUR', locale: 'pt-PT', language: 'pt',
    measurementSystem: 'metric', defaultAreaUnit: 'm2',
    features: { ...BASE_FEATURES },
    defaultMortgage: MORTGAGE_PROFILES.pt,
    taxProfile: TAX_PROFILES.pt,
    pricing: MARKET_PRICING.pt,
    seo: SEO_PROFILES.pt,
    radar: { enabled: true, waitlistEnabled: true, demoEnabled: false, authorizedProviderEnabled: false, supportedStrategies: ['long_term_rental', 'room_rental', 'renovate_and_rent'], dataSourceMessage: 'Dados fictícios para demonstração. Integrações requerem autorização.' },
    legal: legal('Ferramenta orientativa. Não constitui aconselhamento financeiro, fiscal ou jurídico.'),
    mockCities: ['Lisboa', 'Porto', 'Braga', 'Coimbra'],
    defaultRegion: 'Lisboa',
  },
  {
    code: 'IT', slug: 'it', name: 'Italy', nativeName: 'Italia',
    currency: 'EUR', locale: 'it-IT', language: 'it',
    measurementSystem: 'metric', defaultAreaUnit: 'm2',
    features: { ...BASE_FEATURES },
    defaultMortgage: MORTGAGE_PROFILES.it,
    taxProfile: TAX_PROFILES.it,
    pricing: MARKET_PRICING.it,
    seo: SEO_PROFILES.it,
    radar: { enabled: true, waitlistEnabled: true, demoEnabled: false, authorizedProviderEnabled: false, supportedStrategies: ['long_term_rental', 'room_rental', 'renovate_and_rent'], dataSourceMessage: 'Dati dimostrativi fittizi. Le integrazioni richiedono autorizzazione.' },
    legal: legal('Strumento orientativo. Non costituisce consulenza finanziaria, fiscale o legale.'),
    mockCities: ['Milano', 'Torino', 'Bologna', 'Napoli'],
    defaultRegion: 'Milano',
  },
  {
    code: 'GB', slug: 'uk', name: 'United Kingdom', nativeName: 'United Kingdom',
    currency: 'GBP', locale: 'en-GB', language: 'en',
    measurementSystem: 'mixed', defaultAreaUnit: 'sqft',
    features: { ...BASE_FEATURES },
    defaultMortgage: MORTGAGE_PROFILES.uk,
    taxProfile: TAX_PROFILES.uk,
    pricing: MARKET_PRICING.uk,
    seo: SEO_PROFILES.uk,
    radar: { enabled: true, waitlistEnabled: true, demoEnabled: false, authorizedProviderEnabled: false, supportedStrategies: ['long_term_rental', 'room_rental'], dataSourceMessage: 'Fictional demo data. Portal integrations require authorization.' },
    legal: legal('Indicative tool only. Not financial, tax or legal advice.'),
    mockCities: ['Manchester', 'Birmingham', 'Leeds', 'Liverpool'],
    defaultRegion: 'Manchester',
  },
  {
    code: 'US', slug: 'us', name: 'United States', nativeName: 'United States',
    currency: 'USD', locale: 'en-US', language: 'en',
    measurementSystem: 'imperial', defaultAreaUnit: 'sqft',
    features: { ...BASE_FEATURES },
    defaultMortgage: MORTGAGE_PROFILES.us,
    taxProfile: TAX_PROFILES.us,
    pricing: MARKET_PRICING.us,
    seo: SEO_PROFILES.us,
    radar: { enabled: true, waitlistEnabled: true, demoEnabled: false, authorizedProviderEnabled: false, supportedStrategies: ['long_term_rental', 'room_rental', 'short_term_rental'], dataSourceMessage: 'Fictional demo data. Portal integrations require authorization.' },
    legal: legal('Indicative tool only. Not financial, tax or legal advice.'),
    mockCities: ['Dallas', 'Tampa', 'Phoenix', 'Atlanta'],
    defaultRegion: 'Texas',
  },
  {
    code: 'MX', slug: 'mx', name: 'Mexico', nativeName: 'México',
    currency: 'MXN', locale: 'es-MX', language: 'es',
    measurementSystem: 'metric', defaultAreaUnit: 'm2',
    features: { ...BASE_FEATURES },
    defaultMortgage: MORTGAGE_PROFILES.mx,
    taxProfile: TAX_PROFILES.mx,
    pricing: MARKET_PRICING.mx,
    seo: SEO_PROFILES.mx,
    radar: { enabled: true, waitlistEnabled: true, demoEnabled: false, authorizedProviderEnabled: false, supportedStrategies: ['long_term_rental', 'room_rental', 'renovate_and_rent'], dataSourceMessage: RADAR_MSG },
    legal: legal('Herramienta orientativa. No constituye asesoramiento financiero, fiscal ni legal.'),
    mockCities: ['Ciudad de México', 'Guadalajara', 'Monterrey', 'Querétaro'],
    defaultRegion: 'Ciudad de México',
  },
  {
    code: 'AU', slug: 'au', name: 'Australia', nativeName: 'Australia',
    currency: 'AUD', locale: 'en-AU', language: 'en',
    measurementSystem: 'metric', defaultAreaUnit: 'm2',
    features: { ...BASE_FEATURES },
    defaultMortgage: MORTGAGE_PROFILES.au,
    taxProfile: TAX_PROFILES.au,
    pricing: MARKET_PRICING.au,
    seo: SEO_PROFILES.au,
    radar: { enabled: true, waitlistEnabled: true, demoEnabled: false, authorizedProviderEnabled: false, supportedStrategies: ['long_term_rental', 'room_rental'], dataSourceMessage: 'Fictional demo data. Portal integrations require authorization.' },
    legal: legal('Indicative tool only. Not financial, tax or legal advice.'),
    mockCities: ['Brisbane', 'Perth', 'Adelaide', 'Melbourne'],
    defaultRegion: 'Queensland',
  },
  {
    code: 'IE', slug: 'ie', name: 'Ireland', nativeName: 'Ireland',
    currency: 'EUR', locale: 'en-IE', language: 'en',
    measurementSystem: 'metric', defaultAreaUnit: 'm2',
    features: { ...BASE_FEATURES },
    defaultMortgage: MORTGAGE_PROFILES.ie,
    taxProfile: TAX_PROFILES.ie,
    pricing: MARKET_PRICING.ie,
    seo: SEO_PROFILES.ie,
    radar: { enabled: true, waitlistEnabled: true, demoEnabled: false, authorizedProviderEnabled: false, supportedStrategies: ['long_term_rental', 'room_rental'], dataSourceMessage: 'Fictional demo data. Portal integrations require authorization.' },
    legal: legal('Indicative tool only. Not financial, tax or legal advice.'),
    mockCities: ['Dublin', 'Cork', 'Galway', 'Limerick'],
    defaultRegion: 'Dublin',
  },
];

export const MARKETS_BY_SLUG: Record<MarketSlug, MarketConfig> = Object.fromEntries(
  MARKETS.map((m) => [m.slug, m]),
) as Record<MarketSlug, MarketConfig>;

export const MARKET_SLUGS = MARKETS.map((m) => m.slug);

export function isValidMarketSlug(slug: string): slug is MarketSlug {
  return slug in MARKETS_BY_SLUG;
}

export function getMarket(slug: MarketSlug): MarketConfig {
  return MARKETS_BY_SLUG[slug];
}
