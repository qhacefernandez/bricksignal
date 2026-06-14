import type { LanguageCode } from '@/config/types';

export interface ProVisualCopy {
  executiveSummary: string;
  price: string;
  monthlyCashflow: string;
  netYield: string;
  viability: string;
  vacancyAndExpenses: string;
  vacancy: string;
  propertyTax: string;
  hoa: string;
  management: string;
  investorMetrics: string;
  irr10y: string;
  breakEven: string;
  wealthProjection: string;
  horizon: string;
  equity: string;
  monthlySensitivity: string;
  scenario: string;
  base: string;
  marketPulseRegion: string;
  stableTrend: string;
  priceYoy: string;
  rentYoy: string;
  refRate: string;
  investmentReport: string;
  pdfReady: string;
  dueDiligence: string;
  moreSteps: string;
  checklistItems: string[];
  fiscalYear1: string;
  deductibleInterest: string;
  estimatedTaxSaving: string;
  amortization: string;
  constantPayment: string;
}

const ES: ProVisualCopy = {
  executiveSummary: 'Resumen ejecutivo',
  price: 'Precio',
  monthlyCashflow: 'Cashflow/mes',
  netYield: 'Rent. neta',
  viability: '✓ Viabilidad: Operación viable — cashflow positivo y rentabilidad neta ≥ 4 %',
  vacancyAndExpenses: 'Vacancia y gastos',
  vacancy: 'Vacancia',
  propertyTax: 'IBI / año',
  hoa: 'Comunidad',
  management: 'Gestión 8 %',
  investorMetrics: 'Métricas de inversor',
  irr10y: 'TIR (10a)',
  breakEven: 'Break-even',
  wealthProjection: 'Proyección patrimonial',
  horizon: 'Horizonte',
  equity: 'Patrimonio',
  monthlySensitivity: 'Cashflow mensual por escenario',
  scenario: 'Escenario',
  base: 'Base',
  marketPulseRegion: 'Market Pulse · Madrid',
  stableTrend: 'Tendencia estable con rentas en alza',
  priceYoy: 'Precio YoY',
  rentYoy: 'Renta YoY',
  refRate: 'Tipo ref.',
  investmentReport: 'Informe de inversión PRO',
  pdfReady: '📥 PDF multipágina · listo para compartir',
  dueDiligence: 'Due diligence — 10 pasos',
  moreSteps: '+ 5 pasos más en el informe completo',
  checklistItems: [
    'Estado registral y cargas',
    'Comunidad al día',
    'Licencia de alquiler',
    '3–5 comparables de renta',
    'Plan de salida definido',
  ],
  fiscalYear1: 'Fiscalidad · año 1',
  deductibleInterest: 'Intereses deducibles*',
  estimatedTaxSaving: 'Ahorro fiscal estimado',
  amortization: 'Amortización',
  constantPayment: 'Cuota constante',
};

const EN: ProVisualCopy = {
  executiveSummary: 'Executive summary',
  price: 'Price',
  monthlyCashflow: 'Cash flow/mo',
  netYield: 'Net yield',
  viability: '✓ Viability: Viable deal — positive cash flow and net yield ≥ 4%',
  vacancyAndExpenses: 'Vacancy and expenses',
  vacancy: 'Vacancy',
  propertyTax: 'Property tax/yr',
  hoa: 'HOA fees',
  management: 'Mgmt 8%',
  investorMetrics: 'Investor metrics',
  irr10y: 'IRR (10y)',
  breakEven: 'Break-even',
  wealthProjection: 'Wealth projection',
  horizon: 'Horizon',
  equity: 'Equity',
  monthlySensitivity: 'Monthly cash flow by scenario',
  scenario: 'Scenario',
  base: 'Base',
  marketPulseRegion: 'Market Pulse · Manchester',
  stableTrend: 'Stable trend with rents rising',
  priceYoy: 'Price YoY',
  rentYoy: 'Rent YoY',
  refRate: 'Ref. rate',
  investmentReport: 'PRO investment report',
  pdfReady: '📥 Multi-page PDF · ready to share',
  dueDiligence: 'Due diligence — 10 steps',
  moreSteps: '+ 5 more steps in the full report',
  checklistItems: [
    'Land registry and charges',
    'HOA fees up to date',
    'Rental licence',
    '3–5 rent comparables',
    'Exit plan defined',
  ],
  fiscalYear1: 'Tax · year 1',
  deductibleInterest: 'Deductible interest*',
  estimatedTaxSaving: 'Estimated tax saving',
  amortization: 'Amortization',
  constantPayment: 'Level payment',
};

const PT: ProVisualCopy = {
  executiveSummary: 'Resumo executivo',
  price: 'Preço',
  monthlyCashflow: 'Cashflow/mês',
  netYield: 'Rent. líquida',
  viability: '✓ Viabilidade: Operação viável — cashflow positivo e rentabilidade líquida ≥ 4 %',
  vacancyAndExpenses: 'Vacância e despesas',
  vacancy: 'Vacância',
  propertyTax: 'IMI / ano',
  hoa: 'Condomínio',
  management: 'Gestão 8 %',
  investorMetrics: 'Métricas de investidor',
  irr10y: 'TIR (10a)',
  breakEven: 'Break-even',
  wealthProjection: 'Projeção patrimonial',
  horizon: 'Horizonte',
  equity: 'Património',
  monthlySensitivity: 'Cashflow mensal por cenário',
  scenario: 'Cenário',
  base: 'Base',
  marketPulseRegion: 'Market Pulse · Lisboa',
  stableTrend: 'Tendência estável com rendas em alta',
  priceYoy: 'Preço YoY',
  rentYoy: 'Renda YoY',
  refRate: 'Taxa ref.',
  investmentReport: 'Relatório de investimento PRO',
  pdfReady: '📥 PDF multipágina · pronto a partilhar',
  dueDiligence: 'Due diligence — 10 passos',
  moreSteps: '+ 5 passos no relatório completo',
  checklistItems: [
    'Registo predial e ónus',
    'Condomínio em dia',
    'Licença de arrendamento',
    '3–5 comparáveis de renda',
    'Plano de saída definido',
  ],
  fiscalYear1: 'Fiscalidade · ano 1',
  deductibleInterest: 'Juros dedutíveis*',
  estimatedTaxSaving: 'Poupança fiscal estimada',
  amortization: 'Amortização',
  constantPayment: 'Prestação constante',
};

const IT: ProVisualCopy = {
  executiveSummary: 'Sintesi esecutiva',
  price: 'Prezzo',
  monthlyCashflow: 'Cash flow/mese',
  netYield: 'Rend. netto',
  viability: '✓ Fattibilità: Operazione fattibile — cash flow positivo e rendimento netto ≥ 4%',
  vacancyAndExpenses: 'Sfitto e spese',
  vacancy: 'Sfitto',
  propertyTax: 'IMU / anno',
  hoa: 'Condominio',
  management: 'Gestione 8%',
  investorMetrics: 'Metriche investitore',
  irr10y: 'TIR (10a)',
  breakEven: 'Break-even',
  wealthProjection: 'Proiezione patrimoniale',
  horizon: 'Orizzonte',
  equity: 'Patrimonio',
  monthlySensitivity: 'Cash flow mensile per scenario',
  scenario: 'Scenario',
  base: 'Base',
  marketPulseRegion: 'Market Pulse · Milano',
  stableTrend: 'Trend stabile con affitti in crescita',
  priceYoy: 'Prezzo YoY',
  rentYoy: 'Affitto YoY',
  refRate: 'Tasso rif.',
  investmentReport: 'Report di investimento PRO',
  pdfReady: '📥 PDF multipagina · pronto da condividere',
  dueDiligence: 'Due diligence — 10 passi',
  moreSteps: '+ 5 passi nel report completo',
  checklistItems: [
    'Visura catastale e gravami',
    'Condominio in regola',
    'Licenza affitto',
    '3–5 comparabili affitto',
    'Piano di uscita definito',
  ],
  fiscalYear1: 'Fiscalità · anno 1',
  deductibleInterest: 'Interessi deducibili*',
  estimatedTaxSaving: 'Risparmio fiscale stimato',
  amortization: 'Ammortamento',
  constantPayment: 'Rata costante',
};

const BY_LANG: Record<LanguageCode, ProVisualCopy> = { es: ES, en: EN, pt: PT, it: IT };

export function getProVisualCopy(language: LanguageCode): ProVisualCopy {
  return BY_LANG[language] ?? ES;
}
