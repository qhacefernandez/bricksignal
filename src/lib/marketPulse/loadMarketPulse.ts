import type { MarketSlug } from '@/config/types';
import {
  calculateMarketPulseConfidence,
  calculateMarketPulseScore,
  deriveDirection,
} from './scoring';
import { MARKET_PULSE_SOURCE_CATALOG } from './sources';
import { enrichReportNarrative } from './narrative';
import type { InvestmentScenarioContext, MarketPulseReport } from './types';
import { MARKET_PULSE_DISCLAIMER } from './types';

import es202606 from '@/content/market-pulse/es/2026-06.json';
import esRegions from '@/content/market-pulse/es/regions.json';
import pt202606 from '@/content/market-pulse/pt/2026-06.json';
import it202606 from '@/content/market-pulse/it/2026-06.json';
import uk202606 from '@/content/market-pulse/uk/2026-06.json';
import us202606 from '@/content/market-pulse/us/2026-06.json';
import mx202606 from '@/content/market-pulse/mx/2026-06.json';
import au202606 from '@/content/market-pulse/au/2026-06.json';
import ie202606 from '@/content/market-pulse/ie/2026-06.json';

type RegionalPulseOverride = {
  geographyLevel?: MarketPulseReport['geographyLevel'];
  geographyName?: string;
  metrics?: Partial<MarketPulseReport['metrics']>;
  narrative?: MarketPulseReport['narrative'];
};

type PulseData = Omit<MarketPulseReport, 'score' | 'confidence' | 'direction' | 'narrative'> & {
  narrative?: MarketPulseReport['narrative'];
  regions?: Record<string, RegionalPulseOverride>;
};

const REGION_OVERRIDES: Partial<Record<MarketSlug, Record<string, RegionalPulseOverride>>> = {
  es: esRegions as Record<string, RegionalPulseOverride>,
};

function normalizeRegionKey(region: string): string {
  return region.trim().toLowerCase();
}

function resolveRegionalOverride(
  marketSlug: MarketSlug,
  region: string | undefined,
): RegionalPulseOverride | null {
  if (!region?.trim()) return null;
  const table = REGION_OVERRIDES[marketSlug];
  if (!table) return null;
  const exact = table[region];
  if (exact) return exact;
  const key = normalizeRegionKey(region);
  const match = Object.entries(table).find(([name]) => normalizeRegionKey(name) === key);
  return match?.[1] ?? null;
}

function applyRegionalPulse(raw: PulseData, override: RegionalPulseOverride): PulseData {
  return {
    ...raw,
    geographyLevel: override.geographyLevel ?? 'region',
    geographyName: override.geographyName ?? raw.geographyName,
    metrics: { ...raw.metrics, ...override.metrics },
    narrative: override.narrative ?? raw.narrative,
  };
}

const PULSE_BY_MARKET: Record<MarketSlug, PulseData[]> = {
  es: [es202606 as PulseData],
  pt: [pt202606 as PulseData],
  it: [it202606 as PulseData],
  uk: [uk202606 as PulseData],
  us: [us202606 as PulseData],
  mx: [mx202606 as PulseData],
  au: [au202606 as PulseData],
  ie: [ie202606 as PulseData],
};

export function getLatestPulseRaw(marketSlug: MarketSlug): PulseData | null {
  const reports = PULSE_BY_MARKET[marketSlug];
  if (!reports?.length) return null;
  return [...reports].sort((a, b) => b.period.localeCompare(a.period))[0] ?? null;
}

export function loadMarketPulse(
  marketSlug: MarketSlug,
  scenario: InvestmentScenarioContext,
  region?: string,
): (MarketPulseReport & { lastUpdatedLabel: string }) | null {
  const baseRaw = getLatestPulseRaw(marketSlug);
  if (!baseRaw) return null;
  const regional = resolveRegionalOverride(marketSlug, region);
  const raw = regional ? applyRegionalPulse(baseRaw, regional) : baseRaw;

  const sources = raw.sources.length > 0 ? raw.sources : MARKET_PULSE_SOURCE_CATALOG[marketSlug];
  const confidence = calculateMarketPulseConfidence(sources);
  const base: MarketPulseReport = {
    ...raw,
    sources,
    confidence,
    disclaimer: raw.disclaimer || MARKET_PULSE_DISCLAIMER,
    score: 0,
    direction: 'stable',
    narrative: raw.narrative ?? {
      headline: '', summary: '', positives: [], risks: [], watchlist: [],
    },
  };
  base.score = calculateMarketPulseScore(base, scenario);
  base.direction = deriveDirection(base.metrics, base.score);
  const enriched = enrichReportNarrative(base, scenario);

  const now = new Date();
  const validUntil = new Date(raw.validUntil);
  const isCurrent = now <= validUntil;
  const lastUpdatedLabel = isCurrent
    ? `Actualizado: ${raw.period}`
    : `Última actualización disponible: ${raw.period}`;

  return { ...enriched, lastUpdatedLabel };
}
