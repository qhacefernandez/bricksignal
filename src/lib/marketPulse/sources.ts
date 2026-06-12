import type { MarketSlug } from '@/config/types';
import type { MarketPulseSource } from './types';

/** Configured source references per market — no scraping, citations only */
export const MARKET_PULSE_SOURCE_CATALOG: Record<MarketSlug, MarketPulseSource[]> = {
  es: [
    { name: 'IPV vivienda', publisher: 'INE', date: '2026-05', accessType: 'public_report', url: 'https://www.ine.es' },
    { name: 'Índice hipotecas', publisher: 'INE / BdE', date: '2026-05', accessType: 'public_report' },
    { name: 'SERPAVI alquiler', publisher: 'MITMA', date: '2026-Q1', accessType: 'public_report' },
    { name: 'Estadística registral', publisher: 'Colegio de Registradores', date: '2026-Q1', accessType: 'manual_research' },
  ],
  pt: [
    { name: 'Índice de preços habitação', publisher: 'INE Portugal', date: '2026-Q1', accessType: 'public_report' },
    { name: 'Taxa Euribor', publisher: 'Banco de Portugal', date: '2026-05', accessType: 'public_report' },
  ],
  it: [
    { name: 'IPAB', publisher: 'ISTAT', date: '2026-Q1', accessType: 'public_report' },
    { name: 'Mutui tasso', publisher: 'Banca d\'Italia', date: '2026-05', accessType: 'public_report' },
  ],
  uk: [
    { name: 'UK House Price Index', publisher: 'ONS', date: '2026-04', accessType: 'public_report' },
    { name: 'Buy-to-let index', publisher: 'ONS / BoE', date: '2026-Q1', accessType: 'public_report' },
  ],
  us: [
    { name: 'FHFA HPI', publisher: 'FHFA', date: '2026-Q1', accessType: 'public_report' },
    { name: 'Mortgage rates', publisher: 'Freddie Mac PMMS', date: '2026-05', accessType: 'public_report' },
  ],
  mx: [
    { name: 'SHF índice precios', publisher: 'SHF', date: '2026-Q1', accessType: 'public_report' },
    { name: 'Tasa hipotecaria', publisher: 'Banxico', date: '2026-05', accessType: 'public_report' },
  ],
  au: [
    { name: 'Residential property prices', publisher: 'ABS', date: '2026-Q1', accessType: 'public_report' },
    { name: 'RBA lending rates', publisher: 'RBA', date: '2026-05', accessType: 'public_report' },
  ],
  ie: [
    { name: 'Residential Property Price Index', publisher: 'CSO Ireland', date: '2026-Q1', accessType: 'public_report' },
    { name: 'Mortgage rates', publisher: 'Central Bank of Ireland', date: '2026-05', accessType: 'public_report' },
  ],
};
