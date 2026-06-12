import type { MarketCode, MarketSlug } from '@/config/types';

export type MarketPulseLevel = 'low' | 'medium' | 'high' | 'very_high';
export type MarketPulseDirection = 'cooling' | 'stable' | 'warming' | 'hot';
export type MarketPulseConfidence = 'low' | 'medium' | 'high';

export type MarketPulseSource = {
  name: string;
  publisher: string;
  date: string;
  url?: string;
  accessType: 'official_api' | 'official_csv' | 'public_report' | 'manual_research' | 'licensed_data';
  notes?: string;
};

export type MarketPulseMetrics = {
  priceTrendYoY?: number;
  priceTrendQoQ?: number;
  rentTrendYoY?: number;
  rentTrendQoQ?: number;
  mortgageRate?: number;
  mortgageRateTrend?: 'up' | 'down' | 'flat';
  transactionVolumeYoY?: number;
  rentalSupplyTrend?: 'up' | 'down' | 'flat' | 'unknown';
  affordabilityPressure?: MarketPulseLevel;
  regulatoryRisk?: MarketPulseLevel;
};

export type MarketPulseNarrative = {
  headline: string;
  summary: string;
  positives: string[];
  risks: string[];
  watchlist: string[];
};

export type MarketPulseReport = {
  marketCode: MarketCode;
  marketSlug: MarketSlug;
  period: string;
  publishedAt: string;
  validUntil: string;
  geographyLevel: 'national' | 'region' | 'province' | 'city';
  geographyName: string;
  metrics: MarketPulseMetrics;
  direction: MarketPulseDirection;
  score: number;
  confidence: MarketPulseConfidence;
  narrative: MarketPulseNarrative;
  sources: MarketPulseSource[];
  disclaimer: string;
};

export type InvestmentScenarioContext = {
  monthlyCashflow: number;
  breakEvenRent: number;
  estimatedMonthlyRent: number;
  netYield: number;
  vacancyPercent?: number;
  defaultVacancyPercent?: number;
  vacancySensitive?: boolean;
};

export const MARKET_PULSE_DISCLAIMER =
  'Market Pulse PRO es una lectura orientativa basada en fuentes públicas, datos autorizados e hipótesis editables. No constituye asesoramiento financiero, fiscal, legal ni recomendación de inversión.';
