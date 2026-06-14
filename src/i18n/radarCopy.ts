import type { LanguageCode } from '@/config/types';

export type RadarVisualType = 'criteria' | 'ranking' | 'alert' | 'tiers';

export interface RadarSection {
  id: string;
  icon: string;
  title: string;
  tagline: string;
  description: string;
  visual: RadarVisualType;
}

export interface RadarPageCopy {
  heroBadge: string;
  heroTitle: string;
  heroSubtitle: string;
  ctaPrimary: string;
  ctaSecondary: string;
  sectionLabel: string;
  exampleLabel: string;
  finalTitle: string;
  finalSubtitle: string;
  trustStrip: { value: string; label: string }[];
  sections: RadarSection[];
  pageTitle: string;
  pageDescription: string;
}

const SECTIONS_ES: RadarSection[] = [
  {
    id: 'criteria',
    icon: '🎯',
    title: 'Tus criterios, tu rentabilidad objetivo',
    tagline: 'Presupuesto, hipoteca, cashflow mínimo y zona',
    description:
      'Define en minutos qué encaja contigo: capital disponible, LTV, tipo, plazo, rentabilidad bruta/neta mínima y cashflow mensual objetivo por ciudad o región.',
    visual: 'criteria',
  },
  {
    id: 'ranking',
    icon: '📋',
    title: 'Oportunidades ordenadas por encaje',
    tagline: 'Dejas de revisar anuncios al azar',
    description:
      'Cada inmueble pasa por el mismo motor de viabilidad que el simulador: score de encaje, cashflow estimado y alertas cuando aparece algo que cumple tus números.',
    visual: 'ranking',
  },
  {
    id: 'alert',
    icon: '🔔',
    title: 'Alertas cuando sale algo que encaja',
    tagline: 'Actúas antes que el resto del mercado',
    description:
      'Recibe avisos cuando entra una oportunidad en tu zona que cumple tus umbrales. Sin revisar portales a mano cada mañana.',
    visual: 'alert',
  },
  {
    id: 'tiers',
    icon: '⚡',
    title: 'Tres niveles: Basic, Pro e Investor',
    tagline: 'Escala cuando necesites más cobertura',
    description:
      'Desde búsquedas esenciales hasta más mercados, más alertas y criterios avanzados. Investor incluirá API y MCP para conectar con modelos de IA generativa.',
    visual: 'tiers',
  },
];

const SECTIONS_EN: RadarSection[] = [
  {
    id: 'criteria',
    icon: '🎯',
    title: 'Your criteria, your target yield',
    tagline: 'Budget, mortgage, minimum cash flow and area',
    description:
      'Set what fits you in minutes: available cash, LTV, rate, term, minimum gross/net yield and target monthly cash flow by city or region.',
    visual: 'criteria',
  },
  {
    id: 'ranking',
    icon: '📋',
    title: 'Opportunities ranked by fit',
    tagline: 'Stop scrolling listings at random',
    description:
      'Each property runs through the same viability engine as the simulator: fit score, estimated cash flow and alerts when something matches your numbers.',
    visual: 'ranking',
  },
  {
    id: 'alert',
    icon: '🔔',
    title: 'Alerts when a match appears',
    tagline: 'Move before the rest of the market',
    description:
      'Get notified when a deal in your area meets your thresholds. No manual portal checking every morning.',
    visual: 'alert',
  },
  {
    id: 'tiers',
    icon: '⚡',
    title: 'Three tiers: Basic, Pro and Investor',
    tagline: 'Scale when you need more coverage',
    description:
      'From essential searches to more markets, more alerts and advanced criteria. Investor will include API and MCP to connect with generative AI models.',
    visual: 'tiers',
  },
];

const SECTIONS_PT: RadarSection[] = [
  {
    id: 'criteria',
    icon: '🎯',
    title: 'Os teus critérios, a tua rentabilidade objetivo',
    tagline: 'Orçamento, crédito, cashflow mínimo e zona',
    description:
      'Define em minutos o que encaixa contigo: capital disponível, LTV, taxa, prazo, rentabilidade bruta/líquida mínima e cashflow mensal objetivo por cidade ou região.',
    visual: 'criteria',
  },
  {
    id: 'ranking',
    icon: '📋',
    title: 'Oportunidades ordenadas por encaixe',
    tagline: 'Deixas de rever anúncios ao acaso',
    description:
      'Cada imóvel passa pelo mesmo motor de viabilidade do simulador: score de encaixe, cashflow estimado e alertas quando aparece algo que cumpre os teus números.',
    visual: 'ranking',
  },
  {
    id: 'alert',
    icon: '🔔',
    title: 'Alertas quando surge um encaixe',
    tagline: 'Agis antes do resto do mercado',
    description:
      'Recebe avisos quando entra uma oportunidade na tua zona que cumpre os teus limiares. Sem rever portais manualmente todas as manhãs.',
    visual: 'alert',
  },
  {
    id: 'tiers',
    icon: '⚡',
    title: 'Três níveis: Basic, Pro e Investor',
    tagline: 'Escala quando precisares de mais cobertura',
    description:
      'Desde pesquisas essenciais a mais mercados, mais alertas e critérios avançados. Investor incluirá API e MCP para ligar a modelos de IA generativa.',
    visual: 'tiers',
  },
];

const SECTIONS_IT: RadarSection[] = [
  {
    id: 'criteria',
    icon: '🎯',
    title: 'I tuoi criteri, la tua rendita obiettivo',
    tagline: 'Budget, mutuo, cash flow minimo e zona',
    description:
      'Definisci in pochi minuti cosa fa per te: capitale disponibile, LTV, tasso, durata, rendimento lordo/netto minimo e cash flow mensile obiettivo per città o regione.',
    visual: 'criteria',
  },
  {
    id: 'ranking',
    icon: '📋',
    title: 'Opportunità ordinate per affinità',
    tagline: 'Smetti di scorrere annunci a caso',
    description:
      'Ogni immobile passa dallo stesso motore di fattibilità del simulatore: punteggio di affinità, cash flow stimato e alert quando compare un affare che rispetta i tuoi numeri.',
    visual: 'ranking',
  },
  {
    id: 'alert',
    icon: '🔔',
    title: 'Alert quando compare un affare adatto',
    tagline: 'Agisci prima del resto del mercato',
    description:
      'Ricevi avvisi quando entra un\'opportunità nella tua zona che rispetta le tue soglie. Niente controllo manuale dei portali ogni mattina.',
    visual: 'alert',
  },
  {
    id: 'tiers',
    icon: '⚡',
    title: 'Tre livelli: Basic, Pro e Investor',
    tagline: 'Scala quando ti serve più copertura',
    description:
      'Dalle ricerche essenziali a più mercati, più alert e criteri avanzati. Investor includerà API e MCP per collegarsi a modelli di IA generativa.',
    visual: 'tiers',
  },
];

const ES: RadarPageCopy = {
  heroBadge: 'Radar',
  heroTitle: 'Encuentra inmuebles que encajan con tu rentabilidad — antes que nadie',
  heroSubtitle:
    'Define tus criterios una vez. Radar ordena oportunidades, estima viabilidad y te avisa cuando aparece algo que cumple tus números.',
  ctaPrimary: 'Unirme a la lista de espera',
  ctaSecondary: 'Calcular rentabilidad gratis',
  sectionLabel: 'Así funcionará',
  exampleLabel: 'Vista previa del producto',
  finalTitle: 'Sé de los primeros cuando abramos tu mercado',
  finalSubtitle:
    'Estamos construyendo Radar con datos autorizados y el mismo motor de análisis que ya usas en el simulador.',
  trustStrip: [
    { value: '3', label: 'Planes previstos' },
    { value: '24/7', label: 'Monitorización' },
    { value: '1', label: 'Motor de viabilidad' },
    { value: '∞', label: 'Criterios editables' },
  ],
  sections: SECTIONS_ES,
  pageTitle: 'Radar',
  pageDescription: 'Encuentra oportunidades de alquiler que encajan con tu rentabilidad y cashflow objetivo.',
};

const EN: RadarPageCopy = {
  heroBadge: 'Radar',
  heroTitle: 'Find properties that match your yield — before anyone else',
  heroSubtitle:
    'Set your criteria once. Radar ranks opportunities, estimates viability and alerts you when something fits your numbers.',
  ctaPrimary: 'Join the waitlist',
  ctaSecondary: 'Calculate yield for free',
  sectionLabel: 'How it will work',
  exampleLabel: 'Product preview',
  finalTitle: 'Be first when we open your market',
  finalSubtitle:
    'We are building Radar with authorized data and the same analysis engine you already use in the simulator.',
  trustStrip: [
    { value: '3', label: 'Planned tiers' },
    { value: '24/7', label: 'Monitoring' },
    { value: '1', label: 'Viability engine' },
    { value: '∞', label: 'Editable criteria' },
  ],
  sections: SECTIONS_EN,
  pageTitle: 'Radar',
  pageDescription: 'Find rental opportunities that match your target yield and cash flow.',
};

const PT: RadarPageCopy = {
  heroBadge: 'Radar',
  heroTitle: 'Encontre imóveis que encaixam na sua rentabilidade — antes dos outros',
  heroSubtitle:
    'Define os critérios uma vez. O Radar ordena oportunidades, estima viabilidade e avisa quando aparece algo que cumpre os seus números.',
  ctaPrimary: 'Juntar-me à lista de espera',
  ctaSecondary: 'Calcular rentabilidade grátis',
  sectionLabel: 'Como vai funcionar',
  exampleLabel: 'Pré-visualização do produto',
  finalTitle: 'Seja dos primeiros quando abrirmos o seu mercado',
  finalSubtitle:
    'Estamos a construir o Radar com dados autorizados e o mesmo motor de análise do simulador.',
  trustStrip: [
    { value: '3', label: 'Planos previstos' },
    { value: '24/7', label: 'Monitorização' },
    { value: '1', label: 'Motor de viabilidade' },
    { value: '∞', label: 'Critérios editáveis' },
  ],
  sections: SECTIONS_PT,
  pageTitle: 'Radar',
  pageDescription: 'Encontre oportunidades de arrendamento que encaixam na sua rentabilidade objetivo.',
};

const IT: RadarPageCopy = {
  heroBadge: 'Radar',
  heroTitle: 'Trova immobili che rispettano la tua rendita — prima degli altri',
  heroSubtitle:
    'Definisci i criteri una volta. Radar ordina le opportunità, stima la fattibilità e ti avvisa quando compare un affare adatto.',
  ctaPrimary: 'Unisciti alla lista d\'attesa',
  ctaSecondary: 'Calcola la rendita gratis',
  sectionLabel: 'Come funzionerà',
  exampleLabel: 'Anteprima prodotto',
  finalTitle: 'Sii tra i primi quando apriremo il tuo mercato',
  finalSubtitle:
    'Stiamo costruendo Radar con dati autorizzati e lo stesso motore di analisi del simulatore.',
  trustStrip: [
    { value: '3', label: 'Piani previsti' },
    { value: '24/7', label: 'Monitoraggio' },
    { value: '1', label: 'Motore di fattibilità' },
    { value: '∞', label: 'Criteri modificabili' },
  ],
  sections: SECTIONS_IT,
  pageTitle: 'Radar',
  pageDescription: 'Trova opportunità di affitto in linea con la rendita e il cash flow obiettivo.',
};

const COPY: Record<LanguageCode, RadarPageCopy> = { es: ES, en: EN, pt: PT, it: IT };

export function getRadarPageCopy(language: LanguageCode): RadarPageCopy {
  return COPY[language] ?? ES;
}
