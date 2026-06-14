import type { MarketSlug, ProductFeature } from './types';

export const ENABLE_RADAR_DEMO = true;
export const ENABLE_RADAR_EARLY_ACCESS = false;
export const ENABLE_SUPABASE_AUTH = false;
export const ENABLE_AUTHORIZED_LISTING_PROVIDER = false;

export const ENABLE_PRO_REPORT = true;
export const ENABLE_MARKET_PULSE_PRO = true;
export const ENABLE_MARKET_PULSE_AUTO_UPDATE = false;
export const ENABLE_PRO_PREVIEW_BLUR = true;
export const ENABLE_DETAILED_FREE_SIMULATOR = false;

export const GLOBAL_FEATURE_DEFAULTS: ProductFeature = {
  simulator: true,
  proReport: true,
  radarLanding: true,
  radarDemo: true,
  radarWaitlist: true,
  radarEarlyAccess: false,
  authorizedListings: false,
  subscriptions: false,
};

export function isFeatureEnabled(features: ProductFeature, feature: keyof ProductFeature): boolean {
  return features[feature] === true;
}

export const MARKET_PREFERRED_STORAGE_KEY = 'bricksignal-preferred-market';
export const COOKIE_CONSENT_STORAGE_KEY = 'bricksignal-cookie-consent';
export const DEFAULT_MARKET_SLUG: MarketSlug = 'es';
