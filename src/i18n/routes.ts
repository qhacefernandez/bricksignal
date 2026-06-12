import type { MarketSlug } from '@/config/types';

export const ROUTE_SEGMENTS = {
  simulator: 'simulador',
  pricing: 'precios',
  proReport: 'informe-pro',
  success: 'success',
  cancel: 'cancel',
  radar: 'radar',
  radarDemo: 'radar/demo',
  radarPricing: 'radar/precios',
  radarWaitlist: 'radar/waitlist',
  radarLegalData: 'radar/legal-data',
  guide: 'guia/rentabilidad-alquiler',
  legal: 'legal',
  privacy: 'privacidad',
  cookies: 'cookies',
} as const;

export type RouteSegment = keyof typeof ROUTE_SEGMENTS;

export function marketPath(market: MarketSlug, segment?: RouteSegment): string {
  const base = `/${market}`;
  if (!segment) return base;
  return `${base}/${ROUTE_SEGMENTS[segment]}`;
}

export function getHreflangAlternates(siteUrl: string): Array<{ hreflang: string; href: string }> {
  const slugs: MarketSlug[] = ['es', 'pt', 'it', 'uk', 'us', 'mx', 'au', 'ie'];
  const hreflangMap: Record<MarketSlug, string> = {
    es: 'es-ES', pt: 'pt-PT', it: 'it-IT', uk: 'en-GB',
    us: 'en-US', mx: 'es-MX', au: 'en-AU', ie: 'en-IE',
  };
  return slugs.map((slug) => ({
    hreflang: hreflangMap[slug],
    href: `${siteUrl}/${slug}/`,
  }));
}
