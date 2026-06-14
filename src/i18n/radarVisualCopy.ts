import type { LanguageCode } from '@/config/types';

export interface RadarVisualCopy {
  productName: string;
  yourCriteria: string;
  maxBudget: string;
  minCashflow: string;
  minGrossYield: string;
  city: string;
  topOpportunitiesToday: string;
  perMonth: string;
  rankingRows: { addr: string; cf: string }[];
  newOpportunity: string;
  matchesCriteria: string;
  alertListing: string;
  estimatedCashflow: string;
  score: string;
  viewInSimulator: string;
  plannedTiers: string;
  tierRows: { name: string; desc: string; highlight?: boolean }[];
}

const ES: RadarVisualCopy = {
  productName: 'BrickSignal Radar',
  yourCriteria: 'Tus criterios',
  maxBudget: 'Presupuesto máx.',
  minCashflow: 'Cashflow mín.',
  minGrossYield: 'Rent. bruta mín.',
  city: 'Ciudad',
  topOpportunitiesToday: 'Top oportunidades hoy',
  perMonth: '/mes',
  rankingRows: [
    { addr: 'Piso · Benimaclet', cf: '+186 €' },
    { addr: 'Ático · Campanar', cf: '+142 €' },
    { addr: 'Bajo · Ruzafa', cf: '+98 €' },
  ],
  newOpportunity: 'Nueva oportunidad',
  matchesCriteria: 'Encaja con tus criterios',
  alertListing: 'Piso 3 hab. · 168.000 € · Alquiler est. 950 €',
  estimatedCashflow: 'Cashflow est.',
  score: 'Score',
  viewInSimulator: 'Ver en simulador',
  plannedTiers: 'Planes previstos',
  tierRows: [
    { name: 'Basic', desc: '1 mercado · alertas esenciales' },
    { name: 'Pro', desc: 'Más zonas · criterios avanzados', highlight: true },
    { name: 'Investor', desc: 'Máxima cobertura · API y MCP (gen-AI)' },
  ],
};

const EN: RadarVisualCopy = {
  productName: 'BrickSignal Radar',
  yourCriteria: 'Your criteria',
  maxBudget: 'Max budget',
  minCashflow: 'Min cash flow',
  minGrossYield: 'Min gross yield',
  city: 'City',
  topOpportunitiesToday: 'Top opportunities today',
  perMonth: '/mo',
  rankingRows: [
    { addr: 'Flat · Northern quarter', cf: '+£186' },
    { addr: 'Penthouse · Riverside', cf: '+£142' },
    { addr: 'Ground floor · Centre', cf: '+£98' },
  ],
  newOpportunity: 'New opportunity',
  matchesCriteria: 'Matches your criteria',
  alertListing: '3-bed flat · £168,000 · Est. rent £950',
  estimatedCashflow: 'Est. cash flow',
  score: 'Score',
  viewInSimulator: 'Open in simulator',
  plannedTiers: 'Planned tiers',
  tierRows: [
    { name: 'Basic', desc: '1 market · essential alerts' },
    { name: 'Pro', desc: 'More areas · advanced criteria', highlight: true },
    { name: 'Investor', desc: 'Maximum coverage · API & MCP (gen-AI)' },
  ],
};

const PT: RadarVisualCopy = {
  productName: 'BrickSignal Radar',
  yourCriteria: 'Os teus critérios',
  maxBudget: 'Orçamento máx.',
  minCashflow: 'Cashflow mín.',
  minGrossYield: 'Rent. bruta mín.',
  city: 'Cidade',
  topOpportunitiesToday: 'Top oportunidades hoje',
  perMonth: '/mês',
  rankingRows: [
    { addr: 'Apartamento · Baixa', cf: '+186 €' },
    { addr: 'Penthouse · Foz', cf: '+142 €' },
    { addr: 'Rés-do-chão · Cedofeita', cf: '+98 €' },
  ],
  newOpportunity: 'Nova oportunidade',
  matchesCriteria: 'Encaixa nos teus critérios',
  alertListing: 'T3 · 168.000 € · Renda est. 950 €',
  estimatedCashflow: 'Cashflow est.',
  score: 'Score',
  viewInSimulator: 'Ver no simulador',
  plannedTiers: 'Planos previstos',
  tierRows: [
    { name: 'Basic', desc: '1 mercado · alertas essenciais' },
    { name: 'Pro', desc: 'Mais zonas · critérios avançados', highlight: true },
    { name: 'Investor', desc: 'Máxima cobertura · API e MCP (gen-AI)' },
  ],
};

const IT: RadarVisualCopy = {
  productName: 'BrickSignal Radar',
  yourCriteria: 'I tuoi criteri',
  maxBudget: 'Budget max.',
  minCashflow: 'Cash flow min.',
  minGrossYield: 'Rend. lordo min.',
  city: 'Città',
  topOpportunitiesToday: 'Top opportunità oggi',
  perMonth: '/mese',
  rankingRows: [
    { addr: 'Trilocale · Navigli', cf: '+186 €' },
    { addr: 'Attico · Porta Romana', cf: '+142 €' },
    { addr: 'Piano terra · Isola', cf: '+98 €' },
  ],
  newOpportunity: 'Nuova opportunità',
  matchesCriteria: 'Rispetta i tuoi criteri',
  alertListing: 'Trilocale · 168.000 € · Affitto est. 950 €',
  estimatedCashflow: 'Cash flow est.',
  score: 'Score',
  viewInSimulator: 'Apri nel simulatore',
  plannedTiers: 'Piani previsti',
  tierRows: [
    { name: 'Basic', desc: '1 mercato · alert essenziali' },
    { name: 'Pro', desc: 'Più zone · criteri avanzati', highlight: true },
    { name: 'Investor', desc: 'Massima copertura · API e MCP (gen-AI)' },
  ],
};

const BY_LANG: Record<LanguageCode, RadarVisualCopy> = { es: ES, en: EN, pt: PT, it: IT };

export function getRadarVisualCopy(language: LanguageCode): RadarVisualCopy {
  return BY_LANG[language] ?? ES;
}
