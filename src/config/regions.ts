import type { MarketSlug } from './types';
import { SPANISH_REGIONS } from '@/lib/types';

const PT_DISTRICTS = [
  'Lisboa', 'Porto', 'Braga', 'Coimbra', 'Faro', 'Setúbal', 'Aveiro', 'Leiria',
] as const;

const IT_PROVINCES = [
  'Milano', 'Roma', 'Torino', 'Bologna', 'Firenze', 'Napoli', 'Padova', 'Verona',
] as const;

const UK_CITIES = [
  'London', 'Manchester', 'Birmingham', 'Leeds', 'Liverpool', 'Bristol', 'Glasgow', 'Edinburgh',
] as const;

const US_METROS = [
  'Austin', 'Dallas', 'Houston', 'Phoenix', 'Tampa', 'Atlanta', 'Denver', 'Charlotte',
] as const;

const MX_CITIES = [
  'Ciudad de México', 'Guadalajara', 'Monterrey', 'Querétaro', 'Puebla', 'Mérida', 'Tijuana',
] as const;

const AU_CITIES = [
  'Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide', 'Gold Coast', 'Canberra',
] as const;

const IE_CITIES = [
  'Dublin', 'Cork', 'Galway', 'Limerick', 'Waterford', 'Kilkenny',
] as const;

export const MARKET_REGIONS: Record<MarketSlug, readonly string[]> = {
  es: SPANISH_REGIONS,
  pt: PT_DISTRICTS,
  it: IT_PROVINCES,
  uk: UK_CITIES,
  us: US_METROS,
  mx: MX_CITIES,
  au: AU_CITIES,
  ie: IE_CITIES,
};

export function getRegionsForMarket(marketSlug: MarketSlug): readonly string[] {
  return MARKET_REGIONS[marketSlug];
}

export function filterRegions(marketSlug: MarketSlug, query: string): string[] {
  const q = query.trim().toLowerCase();
  const list = [...getRegionsForMarket(marketSlug)];
  if (!q) return list;
  return list.filter((r) => r.toLowerCase().includes(q));
}
