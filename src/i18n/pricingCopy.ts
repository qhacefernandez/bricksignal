import type { LanguageCode } from '@/config/types';

export interface PricingFaqItem {
  q: string;
  a: string;
}

export interface PricingComparisonRow {
  feature: string;
  free: boolean;
  pro: boolean;
}

export interface PricingPageCopy {
  heroTitle: string;
  heroSubtitle: string;
  freeName: string;
  freeSubtitle: string;
  freeFeatures: string[];
  proBadge: string;
  proSubtitle: string;
  proFeatures: string[];
  proViewSections: string;
  radarSubtitle: string;
  radarFeatures: string[];
  radarComingSoon: string;
  comparisonTitle: string;
  comparisonSubtitle: string;
  comparisonFeatureCol: string;
  comparisonFreeCol: string;
  comparisonProCol: string;
  comparisonRows: PricingComparisonRow[];
  comparisonCta: string;
  valueProps: { icon: string; title: string; text: string }[];
  faqTitle: string;
  faq: PricingFaqItem[];
  bottomTitle: string;
  bottomSubtitle: string;
  bottomSimulator: string;
  bottomViewReport: string;
  pageTitle: string;
  pageDescription: string;
}

const ES: PricingPageCopy = {
  heroTitle: 'Decide con datos, no con intuición',
  heroSubtitle:
    'Empieza gratis. Cuando tengas un inmueble en mente, desbloquea el análisis completo por un pago único.',
  freeName: 'Gratis',
  freeSubtitle: 'Para explorar y comparar operaciones',
  freeFeatures: [
    'Simulador interactivo ilimitado',
    'Cashflow mensual estimado',
    'Rentabilidad bruta',
    'Viabilidad simplificada',
    'Hipoteca y gastos básicos',
  ],
  proBadge: 'Más popular',
  proSubtitle: 'Pago único · 1 inmueble / escenario',
  proFeatures: [
    'Rentabilidad neta (métrica clave)',
    'Vacancia y gastos editables',
    'TIR, DSCR y cash-on-cash',
    'Proyección 10 y 20 años',
    'Matriz de sensibilidad',
    'Market Pulse por región',
    'PDF profesional descargable',
    'Checklist due diligence (10 pasos)',
  ],
  proViewSections: 'Ver ejemplo de cada sección →',
  radarSubtitle: 'Encuentra oportunidades que encajan con tu rentabilidad',
  radarFeatures: [
    'Alertas por zona y criterios',
    'Scoring con tus métricas objetivo',
    'Análisis directo al simulador',
  ],
  radarComingSoon: 'Próximamente',
  comparisonTitle: 'Comparativa detallada',
  comparisonSubtitle: 'Todo lo que desbloqueas con el Informe PRO',
  comparisonFeatureCol: 'Funcionalidad',
  comparisonFreeCol: 'Gratis',
  comparisonProCol: 'PRO',
  comparisonRows: [
    { feature: 'Simulador interactivo', free: true, pro: true },
    { feature: 'Cashflow mensual', free: true, pro: true },
    { feature: 'Rentabilidad bruta', free: true, pro: true },
    { feature: 'Rentabilidad neta', free: false, pro: true },
    { feature: 'TIR y DSCR', free: false, pro: true },
    { feature: 'Sensibilidad multi-escenario', free: false, pro: true },
    { feature: 'Market Pulse regional', free: false, pro: true },
    { feature: 'PDF descargable', free: false, pro: true },
    { feature: 'Checklist due diligence', free: false, pro: true },
  ],
  comparisonCta: 'Explorar el informe PRO con ejemplos visuales',
  valueProps: [
    { icon: '⚡', title: 'Resultado en minutos', text: 'Simula, ajusta hipótesis y genera el informe sin esperar a un analista.' },
    { icon: '🎯', title: 'Un pago, un inmueble', text: 'Sin suscripciones ocultas. Pagas cuando tienes una operación concreta que evaluar.' },
    { icon: '📋', title: 'Listo para compartir', text: 'PDF con formato profesional para banco, socio inversor o asesor.' },
  ],
  faqTitle: 'Preguntas frecuentes',
  faq: [
    {
      q: '¿Qué incluye exactamente el Informe PRO?',
      a: 'Rentabilidad neta, vacancia editable, TIR, DSCR, proyecciones a 10/20 años, sensibilidad, Market Pulse por región, checklist de due diligence y PDF completo descargable.',
    },
    {
      q: '¿Es una suscripción?',
      a: 'No. El Informe PRO es un pago único por inmueble/escenario. Radar (cuando esté disponible) será suscripción mensual.',
    },
    {
      q: '¿Puedo probar antes de pagar?',
      a: 'Sí. El simulador gratuito te muestra cashflow, rentabilidad bruta e inversión inicial. La rentabilidad neta y el análisis avanzado se desbloquean con PRO.',
    },
    {
      q: '¿Qué pasa si cambio el precio o la renta después de comprar?',
      a: 'Si modificas datos clave del escenario, puedes indicar que es la misma simulación (hasta 2 veces) o comprar un nuevo informe.',
    },
  ],
  bottomTitle: 'Tu próxima operación merece un análisis PRO',
  bottomSubtitle: 'Empieza gratis en el simulador. Cuando tengas claro el inmueble, desbloquea el informe por {price}.',
  bottomSimulator: 'Ir al simulador',
  bottomViewReport: 'Ver contenido del informe',
  pageTitle: 'Precios',
  pageDescription:
    'Planes BrickSignal: simulador gratis e Informe PRO con análisis completo, PDF y Market Pulse.',
};

const EN: PricingPageCopy = {
  heroTitle: 'Decide with data, not gut feeling',
  heroSubtitle:
    'Start for free. When you have a property in mind, unlock the full analysis with a one-time payment.',
  freeName: 'Free',
  freeSubtitle: 'Explore and compare deals',
  freeFeatures: [
    'Unlimited interactive simulator',
    'Estimated monthly cash flow',
    'Gross yield',
    'Simplified viability score',
    'Mortgage and basic expenses',
  ],
  proBadge: 'Most popular',
  proSubtitle: 'One-time payment · 1 property / scenario',
  proFeatures: [
    'Net yield (key metric)',
    'Editable vacancy and expenses',
    'IRR, DSCR and cash-on-cash',
    '10- and 20-year projection',
    'Sensitivity matrix',
    'Regional Market Pulse',
    'Professional downloadable PDF',
    'Due diligence checklist (10 steps)',
  ],
  proViewSections: 'See an example of each section →',
  radarSubtitle: 'Find opportunities that match your target return',
  radarFeatures: [
    'Alerts by area and criteria',
    'Scoring against your target metrics',
    'One-click analysis in the simulator',
  ],
  radarComingSoon: 'Coming soon',
  comparisonTitle: 'Detailed comparison',
  comparisonSubtitle: 'Everything you unlock with the PRO Report',
  comparisonFeatureCol: 'Feature',
  comparisonFreeCol: 'Free',
  comparisonProCol: 'PRO',
  comparisonRows: [
    { feature: 'Interactive simulator', free: true, pro: true },
    { feature: 'Monthly cash flow', free: true, pro: true },
    { feature: 'Gross yield', free: true, pro: true },
    { feature: 'Net yield', free: false, pro: true },
    { feature: 'IRR and DSCR', free: false, pro: true },
    { feature: 'Multi-scenario sensitivity', free: false, pro: true },
    { feature: 'Regional Market Pulse', free: false, pro: true },
    { feature: 'Downloadable PDF', free: false, pro: true },
    { feature: 'Due diligence checklist', free: false, pro: true },
  ],
  comparisonCta: 'Explore the PRO report with visual examples',
  valueProps: [
    { icon: '⚡', title: 'Results in minutes', text: 'Simulate, tune assumptions and generate the report without waiting for an analyst.' },
    { icon: '🎯', title: 'One payment, one property', text: 'No hidden subscriptions. Pay when you have a specific deal to evaluate.' },
    { icon: '📋', title: 'Ready to share', text: 'Professional PDF for your bank, partner or adviser.' },
  ],
  faqTitle: 'Frequently asked questions',
  faq: [
    {
      q: 'What exactly is included in the PRO Report?',
      a: 'Net yield, editable vacancy, IRR, DSCR, 10/20-year projections, sensitivity, regional Market Pulse, due diligence checklist and full downloadable PDF.',
    },
    {
      q: 'Is it a subscription?',
      a: 'No. The PRO Report is a one-time payment per property/scenario. Radar (when available) will be a monthly subscription.',
    },
    {
      q: 'Can I try before paying?',
      a: 'Yes. The free simulator shows cash flow, gross yield and initial investment. Net yield and advanced analysis unlock with PRO.',
    },
    {
      q: 'What if I change price or rent after purchasing?',
      a: 'If you change key scenario data, you can mark it as the same simulation (up to 2 times) or purchase a new report.',
    },
  ],
  bottomTitle: 'Your next deal deserves a PRO analysis',
  bottomSubtitle: 'Start free in the simulator. When you are ready, unlock the report for {price}.',
  bottomSimulator: 'Go to simulator',
  bottomViewReport: 'See report contents',
  pageTitle: 'Pricing',
  pageDescription:
    'BrickSignal plans: free simulator and PRO Report with full analysis, PDF and Market Pulse.',
};

const PT: PricingPageCopy = {
  heroTitle: 'Decida com dados, não com intuição',
  heroSubtitle:
    'Comece grátis. Quando tiver um imóvel em mente, desbloqueie a análise completa com um pagamento único.',
  freeName: 'Grátis',
  freeSubtitle: 'Para explorar e comparar operações',
  freeFeatures: [
    'Simulador interativo ilimitado',
    'Cashflow mensal estimado',
    'Rentabilidade bruta',
    'Viabilidade simplificada',
    'Crédito e despesas básicas',
  ],
  proBadge: 'Mais popular',
  proSubtitle: 'Pagamento único · 1 imóvel / cenário',
  proFeatures: [
    'Rentabilidade líquida (métrica chave)',
    'Vacância e despesas editáveis',
    'TIR, DSCR e cash-on-cash',
    'Projeção a 10 e 20 anos',
    'Matriz de sensibilidade',
    'Market Pulse por região',
    'PDF profissional descarregável',
    'Checklist due diligence (10 passos)',
  ],
  proViewSections: 'Ver exemplo de cada secção →',
  radarSubtitle: 'Encontre oportunidades alinhadas com a sua rentabilidade',
  radarFeatures: [
    'Alertas por zona e critérios',
    'Scoring com as suas métricas objetivo',
    'Análise direta no simulador',
  ],
  radarComingSoon: 'Em breve',
  comparisonTitle: 'Comparativo detalhado',
  comparisonSubtitle: 'Tudo o que desbloqueia com o Relatório PRO',
  comparisonFeatureCol: 'Funcionalidade',
  comparisonFreeCol: 'Grátis',
  comparisonProCol: 'PRO',
  comparisonRows: [
    { feature: 'Simulador interativo', free: true, pro: true },
    { feature: 'Cashflow mensal', free: true, pro: true },
    { feature: 'Rentabilidade bruta', free: true, pro: true },
    { feature: 'Rentabilidade líquida', free: false, pro: true },
    { feature: 'TIR e DSCR', free: false, pro: true },
    { feature: 'Sensibilidade multi-cenário', free: false, pro: true },
    { feature: 'Market Pulse regional', free: false, pro: true },
    { feature: 'PDF descarregável', free: false, pro: true },
    { feature: 'Checklist due diligence', free: false, pro: true },
  ],
  comparisonCta: 'Explorar o relatório PRO com exemplos visuais',
  valueProps: [
    { icon: '⚡', title: 'Resultado em minutos', text: 'Simule, ajuste hipóteses e gere o relatório sem esperar por um analista.' },
    { icon: '🎯', title: 'Um pagamento, um imóvel', text: 'Sem subscrições ocultas. Paga quando tem uma operação concreta para avaliar.' },
    { icon: '📋', title: 'Pronto a partilhar', text: 'PDF profissional para o banco, parceiro ou consultor.' },
  ],
  faqTitle: 'Perguntas frequentes',
  faq: [
    {
      q: 'O que inclui exatamente o Relatório PRO?',
      a: 'Rentabilidade líquida, vacância editável, TIR, DSCR, projeções a 10/20 anos, sensibilidade, Market Pulse por região, checklist de due diligence e PDF completo descarregável.',
    },
    {
      q: 'É uma subscrição?',
      a: 'Não. O Relatório PRO é um pagamento único por imóvel/cenário. O Radar (quando disponível) será subscrição mensal.',
    },
    {
      q: 'Posso experimentar antes de pagar?',
      a: 'Sim. O simulador gratuito mostra cashflow, rentabilidade bruta e investimento inicial. A rentabilidade líquida e a análise avançada desbloqueiam com PRO.',
    },
    {
      q: 'E se mudar o preço ou a renda depois de comprar?',
      a: 'Se alterar dados chave do cenário, pode indicar que é a mesma simulação (até 2 vezes) ou comprar um novo relatório.',
    },
  ],
  bottomTitle: 'A sua próxima operação merece uma análise PRO',
  bottomSubtitle: 'Comece grátis no simulador. Quando estiver pronto, desbloqueie o relatório por {price}.',
  bottomSimulator: 'Ir ao simulador',
  bottomViewReport: 'Ver conteúdo do relatório',
  pageTitle: 'Preços',
  pageDescription:
    'Planos BrickSignal: simulador grátis e Relatório PRO com análise completa, PDF e Market Pulse.',
};

const IT: PricingPageCopy = {
  heroTitle: 'Decidi con i dati, non con l\'intuito',
  heroSubtitle:
    'Inizia gratis. Quando hai un immobile in mente, sblocca l\'analisi completa con un pagamento unico.',
  freeName: 'Gratuito',
  freeSubtitle: 'Per esplorare e confrontare le operazioni',
  freeFeatures: [
    'Simulatore interattivo illimitato',
    'Cash flow mensile stimato',
    'Rendimento lordo',
    'Fattibilità semplificata',
    'Mutuo e spese di base',
  ],
  proBadge: 'Più popolare',
  proSubtitle: 'Pagamento unico · 1 immobile / scenario',
  proFeatures: [
    'Rendimento netto (metrica chiave)',
    'Sfitto e spese modificabili',
    'TIR, DSCR e cash-on-cash',
    'Proiezione a 10 e 20 anni',
    'Matrice di sensibilità',
    'Market Pulse per regione',
    'PDF professionale scaricabile',
    'Checklist due diligence (10 passi)',
  ],
  proViewSections: 'Vedi un esempio di ogni sezione →',
  radarSubtitle: 'Trova opportunità in linea con il tuo rendimento obiettivo',
  radarFeatures: [
    'Avvisi per zona e criteri',
    'Scoring rispetto alle tue metriche',
    'Analisi diretta nel simulatore',
  ],
  radarComingSoon: 'Prossimamente',
  comparisonTitle: 'Confronto dettagliato',
  comparisonSubtitle: 'Tutto ciò che sblocchi con il Report PRO',
  comparisonFeatureCol: 'Funzionalità',
  comparisonFreeCol: 'Gratis',
  comparisonProCol: 'PRO',
  comparisonRows: [
    { feature: 'Simulatore interattivo', free: true, pro: true },
    { feature: 'Cash flow mensile', free: true, pro: true },
    { feature: 'Rendimento lordo', free: true, pro: true },
    { feature: 'Rendimento netto', free: false, pro: true },
    { feature: 'TIR e DSCR', free: false, pro: true },
    { feature: 'Sensibilità multi-scenario', free: false, pro: true },
    { feature: 'Market Pulse regionale', free: false, pro: true },
    { feature: 'PDF scaricabile', free: false, pro: true },
    { feature: 'Checklist due diligence', free: false, pro: true },
  ],
  comparisonCta: 'Esplora il report PRO con esempi visivi',
  valueProps: [
    { icon: '⚡', title: 'Risultati in pochi minuti', text: 'Simula, regola le ipotesi e genera il report senza aspettare un analista.' },
    { icon: '🎯', title: 'Un pagamento, un immobile', text: 'Nessun abbonamento nascosto. Paghi quando hai un\'operazione concreta da valutare.' },
    { icon: '📋', title: 'Pronto da condividere', text: 'PDF professionale per banca, partner o consulente.' },
  ],
  faqTitle: 'Domande frequenti',
  faq: [
    {
      q: 'Cosa include esattamente il Report PRO?',
      a: 'Rendimento netto, sfitto modificabile, TIR, DSCR, proiezioni a 10/20 anni, sensibilità, Market Pulse per regione, checklist due diligence e PDF completo scaricabile.',
    },
    {
      q: 'È un abbonamento?',
      a: 'No. Il Report PRO è un pagamento unico per immobile/scenario. Radar (quando disponibile) sarà un abbonamento mensile.',
    },
    {
      q: 'Posso provare prima di pagare?',
      a: 'Sì. Il simulatore gratuito mostra cash flow, rendimento lordo e investimento iniziale. Rendimento netto e analisi avanzata si sbloccano con PRO.',
    },
    {
      q: 'Cosa succede se cambio prezzo o affitto dopo l\'acquisto?',
      a: 'Se modifichi dati chiave dello scenario, puoi indicare che è la stessa simulazione (fino a 2 volte) o acquistare un nuovo report.',
    },
  ],
  bottomTitle: 'La tua prossima operazione merita un\'analisi PRO',
  bottomSubtitle: 'Inizia gratis nel simulatore. Quando sei pronto, sblocca il report per {price}.',
  bottomSimulator: 'Vai al simulatore',
  bottomViewReport: 'Vedi contenuto del report',
  pageTitle: 'Prezzi',
  pageDescription:
    'Piani BrickSignal: simulatore gratuito e Report PRO con analisi completa, PDF e Market Pulse.',
};

const BY_LANG: Record<LanguageCode, PricingPageCopy> = { es: ES, en: EN, pt: PT, it: IT };

export function getPricingPageCopy(language: LanguageCode): PricingPageCopy {
  return BY_LANG[language] ?? ES;
}
