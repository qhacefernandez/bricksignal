import type { LanguageCode } from '@/config/types';

export type MessageKey =
  | 'hero.title'
  | 'hero.subtitle'
  | 'cta.calculate'
  | 'cta.proReport'
  | 'cta.radar'
  | 'nav.simulator'
  | 'nav.radar'
  | 'nav.pricing'
  | 'nav.proReport'
  | 'nav.guide'
  | 'metrics.grossYield'
  | 'metrics.netYield'
  | 'metrics.monthlyCashflow'
  | 'metrics.dscr'
  | 'metrics.initialInvestment'
  | 'disclaimer.main'
  | 'disclaimer.tax'
  | 'disclaimer.mortgageInterestFootnote'
  | 'pricing.report'
  | 'pricing.perMonth'
  | 'waitlist.title'
  | 'waitlist.submit'
  | 'waitlist.subtitle'
  | 'waitlist.privacyLink'
  | 'waitlist.earlyAccess'
  | 'error.invalidMarket'
  | 'error.subscriptionsDisabled'
  | 'global.selectCountry'
  | 'global.detectingMarket'
  | 'global.chooseMarket'
  | 'global.recommended'
  | 'cookies.banner'
  | 'cookies.bannerAria'
  | 'cookies.acceptAll'
  | 'cookies.necessaryOnly'
  | 'cookies.policyLink'
  | 'simulator.moveControls'
  | 'simulator.quickEstimate'
  | 'simulator.simplifiedAssumptions'
  | 'simulator.vacancyIncluded'
  | 'simulator.editableInPro'
  | 'simulator.availableInPro'
  | 'simulator.unlockFull'
  | 'simulator.outOfRange'
  | 'simulator.resetValues'
  | 'simulator.saveScenario'
  | 'simulator.vacancyUpgradeCopy'
  | 'simulator.includedAssumptions'
  | 'simulator.includedAssumptionsHelp'
  | 'simulator.quickEstimateDisclaimer'
  | 'simulator.resultsPlaceholder'
  | 'simulator.resultsPlaceholderTitle'
  | 'simulator.viabilityProHint'
  | 'simulator.fiscalProTip'
  | 'simulator.downloadPdf'
  | 'waitlist.email'
  | 'waitlist.city'
  | 'waitlist.maxBudget'
  | 'waitlist.availableCash'
  | 'waitlist.minGrossYield'
  | 'waitlist.minCashflow'
  | 'waitlist.strategy'
  | 'waitlist.strategyLongTerm'
  | 'waitlist.strategyRoom'
  | 'waitlist.strategyRenovate'
  | 'waitlist.consent'
  | 'waitlist.done'
  | 'radar.criteriaTitle'
  | 'radar.targetCity'
  | 'radar.maxBudget'
  | 'radar.availableCash'
  | 'radar.useMortgage'
  | 'radar.ltv'
  | 'radar.interestRate'
  | 'radar.mortgageYears'
  | 'radar.minGrossYield'
  | 'radar.minNetYield'
  | 'radar.minCashflow'
  | 'radar.search'
  | 'radar.searching';

type Messages = Record<MessageKey, string>;

const es: Messages = {
  'hero.title': 'Calcula si una vivienda de alquiler realmente te deja dinero cada mes.',
  'hero.subtitle': 'Incluye hipoteca, gastos, vacancia, reforma, rentabilidad neta, cashflow y escenarios.',
  'cta.calculate': 'Calcular rentabilidad gratis',
  'cta.proReport': 'Generar Informe Pro',
  'cta.radar': 'Encuentra inmuebles que encajan con tu rentabilidad objetivo.',
  'nav.simulator': 'Simulador',
  'nav.radar': 'Radar',
  'nav.pricing': 'Precios',
  'nav.proReport': 'Informe PRO',
  'nav.guide': 'Guía',
  'metrics.grossYield': 'Rentabilidad bruta',
  'metrics.netYield': 'Rentabilidad neta',
  'metrics.monthlyCashflow': 'Cashflow mensual',
  'metrics.dscr': 'DSCR',
  'metrics.initialInvestment': 'Inversión inicial',
  'disclaimer.main': 'Herramienta orientativa. No constituye asesoramiento financiero, fiscal, legal ni recomendación de compra.',
  'disclaimer.tax': 'Los impuestos y gastos son hipótesis editables. Consulta con un profesional.',
  'disclaimer.mortgageInterestFootnote': '* La deducción de intereses de hipoteca solo aplica en mercados donde la normativa fiscal lo permite.',
  'pricing.report': 'Informe Pro',
  'pricing.perMonth': '/mes',
  'waitlist.title': 'Lista de espera Radar',
  'waitlist.submit': 'Unirme a la lista de espera',
  'waitlist.subtitle': 'Déjanos tu email y te avisaremos cuando Radar esté disponible en tu mercado.',
  'waitlist.privacyLink': 'política de privacidad',
  'waitlist.earlyAccess': 'Reservar early access',
  'error.invalidMarket': 'Mercado no disponible.',
  'error.subscriptionsDisabled': 'Las suscripciones Radar no están activas en este mercado.',
  'global.selectCountry': 'Selecciona tu país',
  'global.detectingMarket': 'Detectando tu mercado…',
  'global.chooseMarket': 'Elige dónde quieres analizar inversiones.',
  'global.recommended': 'Recomendado',
  'cookies.banner':
    'Usamos almacenamiento necesario para el simulador y, si aceptas, analítica anónima para mejorar el servicio',
  'cookies.bannerAria': 'Preferencias de cookies',
  'cookies.acceptAll': 'Aceptar cookies',
  'cookies.necessaryOnly': 'Solo necesarias',
  'cookies.policyLink': 'política de cookies',
  'simulator.moveControls': 'Mueve los controles y mira cómo cambia la operación.',
  'simulator.quickEstimate': 'Estimación rápida',
  'simulator.simplifiedAssumptions': 'Hipótesis simplificadas',
  'simulator.vacancyIncluded': 'Vacancia estimada incluida',
  'simulator.editableInPro': 'Editable en PRO',
  'simulator.availableInPro': 'Disponible en PRO',
  'simulator.unlockFull': 'Desbloquear análisis completo',
  'simulator.outOfRange': 'Valor fuera del rango habitual',
  'simulator.resetValues': 'Restablecer valores',
  'simulator.saveScenario': 'Guardar escenario',
  'simulator.vacancyUpgradeCopy': 'Tu estimación rápida usa una vacancia estándar ({rate}). En PRO podrás probar diferentes niveles de ocupación, ver sensibilidad y descargar el informe completo.',
  'simulator.includedAssumptions': 'Hipótesis incluidas',
  'simulator.includedAssumptionsHelp': 'Para que puedas estimar rápido, usamos hipótesis simplificadas. En PRO podrás editar vacancia, reforma, fiscalidad, escenarios y sensibilidad.',
  'simulator.quickEstimateDisclaimer': 'Estimación rápida con hipótesis simplificadas. Para ver gastos reales, impuestos, sensibilidad, TIR, escenarios y tendencia de mercado, genera el Informe PRO.',
  'simulator.resultsPlaceholderTitle': 'Tu estimación aparecerá aquí',
  'simulator.resultsPlaceholder': 'Ajusta precio, alquiler o financiación para ver cashflow y viabilidad.',
  'simulator.viabilityProHint': 'Descubre la rentabilidad neta real en el Informe PRO.',
  'simulator.fiscalProTip': 'En el Informe PRO verás el impacto fiscal real: deducción de intereses*, tipo de amortización y rentabilidad neta.',
  'simulator.downloadPdf': 'Descarga el informe en PDF',
  'waitlist.email': 'Email',
  'waitlist.city': 'Ciudad',
  'waitlist.maxBudget': 'Presupuesto máximo',
  'waitlist.availableCash': 'Capital disponible',
  'waitlist.minGrossYield': 'Rentabilidad bruta mínima (%)',
  'waitlist.minCashflow': 'Cashflow mensual mínimo',
  'waitlist.strategy': 'Estrategia',
  'waitlist.strategyLongTerm': 'Alquiler tradicional',
  'waitlist.strategyRoom': 'Alquiler por habitaciones',
  'waitlist.strategyRenovate': 'Reforma y alquiler',
  'waitlist.consent': 'Acepto recibir comunicaciones sobre Radar',
  'waitlist.done': '¡Solicitud enviada! Te avisaremos cuando haya novedades.',
  'radar.criteriaTitle': 'Tus criterios de inversión',
  'radar.targetCity': 'Ciudad objetivo',
  'radar.maxBudget': 'Presupuesto máximo',
  'radar.availableCash': 'Capital disponible',
  'radar.useMortgage': 'Usar hipoteca',
  'radar.ltv': 'LTV hipoteca (%)',
  'radar.interestRate': 'Tipo de interés (%)',
  'radar.mortgageYears': 'Plazo hipotecario',
  'radar.minGrossYield': 'Rentabilidad bruta mín. (%)',
  'radar.minNetYield': 'Rentabilidad neta mín. (%)',
  'radar.minCashflow': 'Cashflow mensual mín.',
  'radar.search': 'Buscar oportunidades',
  'radar.searching': 'Buscando…',
};

const en: Messages = {
  'hero.title': 'Find out whether a rental property actually puts money in your pocket.',
  'hero.subtitle': 'Include mortgage, expenses, vacancy, renovation, net yield, cash flow and scenarios.',
  'cta.calculate': 'Calculate returns for free',
  'cta.proReport': 'Generate Pro Report',
  'cta.radar': 'Find properties that match your target return.',
  'nav.simulator': 'Simulator',
  'nav.radar': 'Radar',
  'nav.pricing': 'Pricing',
  'nav.proReport': 'PRO Report',
  'nav.guide': 'Guide',
  'metrics.grossYield': 'Gross yield',
  'metrics.netYield': 'Net yield',
  'metrics.monthlyCashflow': 'Monthly cash flow',
  'metrics.dscr': 'DSCR',
  'metrics.initialInvestment': 'Initial investment',
  'disclaimer.main': 'Indicative tool only. Not financial, tax, legal advice or a buy recommendation.',
  'disclaimer.tax': 'Taxes and costs are editable assumptions. Consult a professional.',
  'disclaimer.mortgageInterestFootnote': '* Mortgage interest deduction only applies in markets where tax law allows it.',
  'pricing.report': 'Pro Report',
  'pricing.perMonth': '/month',
  'waitlist.title': 'Radar waitlist',
  'waitlist.submit': 'Join the waitlist',
  'waitlist.subtitle': 'Leave your email and we will notify you when Radar launches in your market.',
  'waitlist.privacyLink': 'privacy policy',
  'waitlist.earlyAccess': 'Reserve early access',
  'error.invalidMarket': 'Market not available.',
  'error.subscriptionsDisabled': 'Radar subscriptions are not enabled for this market yet.',
  'global.selectCountry': 'Select your country',
  'global.detectingMarket': 'Detecting your market…',
  'global.chooseMarket': 'Choose where you want to analyse investments.',
  'global.recommended': 'Recommended',
  'cookies.banner':
    'We use necessary storage for the simulator and, if you accept, anonymous analytics to improve the service',
  'cookies.bannerAria': 'Cookie preferences',
  'cookies.acceptAll': 'Accept cookies',
  'cookies.necessaryOnly': 'Necessary only',
  'cookies.policyLink': 'cookie policy',
  'simulator.moveControls': 'Move the controls and see how the deal changes.',
  'simulator.quickEstimate': 'Quick estimate',
  'simulator.simplifiedAssumptions': 'Simplified assumptions',
  'simulator.vacancyIncluded': 'Estimated vacancy included',
  'simulator.editableInPro': 'Editable in PRO',
  'simulator.availableInPro': 'Available in PRO',
  'simulator.unlockFull': 'Unlock full analysis',
  'simulator.outOfRange': 'Value outside the usual range',
  'simulator.resetValues': 'Reset values',
  'simulator.saveScenario': 'Save scenario',
  'simulator.vacancyUpgradeCopy': 'Your quick estimate uses a standard vacancy assumption ({rate}). In PRO you can test occupancy levels, sensitivity and download the full report.',
  'simulator.includedAssumptions': 'Included assumptions',
  'simulator.includedAssumptionsHelp': 'For a fast estimate we use simplified assumptions. In PRO you can edit vacancy, renovation, tax, scenarios and sensitivity.',
  'simulator.quickEstimateDisclaimer': 'Quick estimate with simplified assumptions. For real expenses, taxes, sensitivity, IRR, scenarios and market trends, generate the PRO Report.',
  'simulator.resultsPlaceholderTitle': 'Your estimate will appear here',
  'simulator.resultsPlaceholder': 'Adjust price, rent or financing to see cashflow and viability.',
  'simulator.viabilityProHint': 'Discover real net yield in the PRO Report.',
  'simulator.fiscalProTip': 'The PRO Report shows real tax impact: interest deduction*, amortization method and net yield.',
  'simulator.downloadPdf': 'Download the report as PDF',
  'waitlist.email': 'Email',
  'waitlist.city': 'City',
  'waitlist.maxBudget': 'Maximum budget',
  'waitlist.availableCash': 'Available cash',
  'waitlist.minGrossYield': 'Minimum gross yield (%)',
  'waitlist.minCashflow': 'Minimum monthly cash flow',
  'waitlist.strategy': 'Strategy',
  'waitlist.strategyLongTerm': 'Long-term rental',
  'waitlist.strategyRoom': 'Room rental',
  'waitlist.strategyRenovate': 'Renovate & rent',
  'waitlist.consent': 'I agree to receive Radar communications',
  'waitlist.done': 'Request sent! We will notify you when there is news.',
  'radar.criteriaTitle': 'Your investment criteria',
  'radar.targetCity': 'Target city',
  'radar.maxBudget': 'Maximum budget',
  'radar.availableCash': 'Available cash',
  'radar.useMortgage': 'Use mortgage',
  'radar.ltv': 'Mortgage LTV (%)',
  'radar.interestRate': 'Interest rate (%)',
  'radar.mortgageYears': 'Mortgage term',
  'radar.minGrossYield': 'Min. gross yield (%)',
  'radar.minNetYield': 'Min. net yield (%)',
  'radar.minCashflow': 'Min. monthly cash flow',
  'radar.search': 'Search opportunities',
  'radar.searching': 'Searching…',
};

const pt: Messages = {
  'hero.title': 'Calcula se um imóvel para arrendar realmente gera dinheiro todos os meses.',
  'hero.subtitle': 'Inclui crédito, despesas, vacância, obras, rentabilidade líquida, cashflow e cenários.',
  'cta.calculate': 'Calcular rentabilidade grátis',
  'cta.proReport': 'Gerar Relatório Pro',
  'cta.radar': 'Encontra imóveis alinhados com a tua rentabilidade objetivo.',
  'nav.simulator': 'Simulador',
  'nav.radar': 'Radar',
  'nav.pricing': 'Preços',
  'nav.proReport': 'Relatório PRO',
  'nav.guide': 'Guia',
  'metrics.grossYield': 'Rentabilidade bruta',
  'metrics.netYield': 'Rentabilidade líquida',
  'metrics.monthlyCashflow': 'Cashflow mensal',
  'metrics.dscr': 'DSCR',
  'metrics.initialInvestment': 'Investimento inicial',
  'disclaimer.main': 'Ferramenta orientativa. Não constitui aconselhamento financeiro, fiscal ou jurídico.',
  'disclaimer.tax': 'Impostos e despesas são hipóteses editáveis.',
  'disclaimer.mortgageInterestFootnote': '* A dedução de juros de hipoteca aplica-se apenas nos mercados onde a legislação fiscal o permite.',
  'pricing.report': 'Relatório Pro',
  'pricing.perMonth': '/mês',
  'waitlist.title': 'Lista de espera Radar',
  'waitlist.submit': 'Juntar-me à lista de espera',
  'waitlist.subtitle': 'Deixa o teu email e avisaremos quando o Radar estiver disponível no teu mercado.',
  'waitlist.privacyLink': 'política de privacidade',
  'waitlist.earlyAccess': 'Reservar early access',
  'error.invalidMarket': 'Mercado não disponível.',
  'error.subscriptionsDisabled': 'Subscrições Radar ainda não estão ativas neste mercado.',
  'global.selectCountry': 'Seleciona o teu país',
  'global.detectingMarket': 'A detetar o teu mercado…',
  'global.chooseMarket': 'Escolhe onde queres analisar investimentos.',
  'global.recommended': 'Recomendado',
  'cookies.banner':
    'Usamos armazenamento necessário para o simulador e, se aceitar, analítica anónima para melhorar o serviço',
  'cookies.bannerAria': 'Preferências de cookies',
  'cookies.acceptAll': 'Aceitar cookies',
  'cookies.necessaryOnly': 'Apenas necessárias',
  'cookies.policyLink': 'política de cookies',
  'simulator.moveControls': 'Move os controlos e vê como a operação muda.',
  'simulator.quickEstimate': 'Estimativa rápida',
  'simulator.simplifiedAssumptions': 'Hipóteses simplificadas',
  'simulator.vacancyIncluded': 'Vacância estimada incluída',
  'simulator.editableInPro': 'Editável no PRO',
  'simulator.availableInPro': 'Disponível no PRO',
  'simulator.unlockFull': 'Desbloquear análise completa',
  'simulator.outOfRange': 'Valor fora do intervalo habitual',
  'simulator.resetValues': 'Repor valores',
  'simulator.saveScenario': 'Guardar cenário',
  'simulator.vacancyUpgradeCopy': 'A tua estimativa rápida usa uma hipótese padrão de vacância ({rate}). No PRO podes testar ocupação, sensibilidade e descarregar o relatório completo.',
  'simulator.includedAssumptions': 'Hipóteses incluídas',
  'simulator.includedAssumptionsHelp': 'Para estimares rápido, usamos hipóteses simplificadas. No PRO podes editar vacância, obras, fiscalidade, cenários e sensibilidade.',
  'simulator.quickEstimateDisclaimer': 'Estimativa rápida com hipóteses simplificadas. Para despesas reais, impostos, sensibilidade, TIR, cenários e tendência de mercado, gera o Relatório PRO.',
  'simulator.resultsPlaceholderTitle': 'A tua estimativa aparecerá aqui',
  'simulator.resultsPlaceholder': 'Ajusta preço, renda ou financiamento para ver cashflow e viabilidade.',
  'simulator.viabilityProHint': 'Descobre a rentabilidade líquida real no Relatório PRO.',
  'simulator.fiscalProTip': 'No Relatório PRO verá o impacto fiscal real: dedução de juros*, amortização e rentabilidade líquida.',
  'simulator.downloadPdf': 'Descarrega o relatório em PDF',
  'waitlist.email': 'Email',
  'waitlist.city': 'Cidade',
  'waitlist.maxBudget': 'Orçamento máximo',
  'waitlist.availableCash': 'Capital disponível',
  'waitlist.minGrossYield': 'Rentabilidade bruta mínima (%)',
  'waitlist.minCashflow': 'Cashflow mensal mínimo',
  'waitlist.strategy': 'Estratégia',
  'waitlist.strategyLongTerm': 'Arrendamento tradicional',
  'waitlist.strategyRoom': 'Arrendamento por quartos',
  'waitlist.strategyRenovate': 'Obras e arrendamento',
  'waitlist.consent': 'Aceito receber comunicações sobre o Radar',
  'waitlist.done': 'Pedido enviado! Avisaremos quando houver novidades.',
  'radar.criteriaTitle': 'Os teus critérios de investimento',
  'radar.targetCity': 'Cidade objetivo',
  'radar.maxBudget': 'Orçamento máximo',
  'radar.availableCash': 'Capital disponível',
  'radar.useMortgage': 'Usar crédito habitação',
  'radar.ltv': 'LTV (%)',
  'radar.interestRate': 'Taxa de juro (%)',
  'radar.mortgageYears': 'Prazo do crédito',
  'radar.minGrossYield': 'Rentabilidade bruta mín. (%)',
  'radar.minNetYield': 'Rentabilidade líquida mín. (%)',
  'radar.minCashflow': 'Cashflow mensal mín.',
  'radar.search': 'Procurar oportunidades',
  'radar.searching': 'A procurar…',
};

const it: Messages = {
  'hero.title': 'Calcola se un immobile in affitto genera davvero cassa ogni mese.',
  'hero.subtitle': 'Include mutuo, spese, sfitto, ristrutturazione, rendimento netto, cash flow e scenari.',
  'cta.calculate': 'Calcola la redditività gratis',
  'cta.proReport': 'Genera Report Pro',
  'cta.radar': 'Trova immobili in linea con il tuo rendimento obiettivo.',
  'nav.simulator': 'Simulatore',
  'nav.radar': 'Radar',
  'nav.pricing': 'Prezzi',
  'nav.proReport': 'Report PRO',
  'nav.guide': 'Guida',
  'metrics.grossYield': 'Rendimento lordo',
  'metrics.netYield': 'Rendimento netto',
  'metrics.monthlyCashflow': 'Cash flow mensile',
  'metrics.dscr': 'DSCR',
  'metrics.initialInvestment': 'Investimento iniziale',
  'disclaimer.main': 'Strumento orientativo. Non è consulenza finanziaria, fiscale o legale.',
  'disclaimer.tax': 'Tasse e costi sono ipotesi modificabili.',
  'disclaimer.mortgageInterestFootnote': '* La deduzione degli interessi del mutuo si applica solo nei mercati in cui la normativa fiscale lo consente.',
  'pricing.report': 'Report Pro',
  'pricing.perMonth': '/mese',
  'waitlist.title': 'Lista d\'attesa Radar',
  'waitlist.submit': 'Unisciti alla lista d\'attesa',
  'waitlist.subtitle': 'Lascia la tua email e ti avviseremo quando Radar sarà disponibile nel tuo mercato.',
  'waitlist.privacyLink': 'informativa sulla privacy',
  'waitlist.earlyAccess': 'Prenota early access',
  'error.invalidMarket': 'Mercato non disponibile.',
  'error.subscriptionsDisabled': 'Gli abbonamenti Radar non sono ancora attivi in questo mercato.',
  'global.selectCountry': 'Seleziona il tuo paese',
  'global.detectingMarket': 'Rilevamento del tuo mercato…',
  'global.chooseMarket': 'Scegli dove vuoi analizzare gli investimenti.',
  'global.recommended': 'Consigliato',
  'cookies.banner':
    'Usiamo archiviazione necessaria per il simulatore e, se accetti, analitica anonima per migliorare il servizio',
  'cookies.bannerAria': 'Preferenze cookie',
  'cookies.acceptAll': 'Accetta cookie',
  'cookies.necessaryOnly': 'Solo necessari',
  'cookies.policyLink': 'informativa sui cookie',
  'simulator.moveControls': 'Muovi i controlli e guarda come cambia l\'operazione.',
  'simulator.quickEstimate': 'Stima rapida',
  'simulator.simplifiedAssumptions': 'Ipotesi semplificate',
  'simulator.vacancyIncluded': 'Sfitto stimato incluso',
  'simulator.editableInPro': 'Modificabile in PRO',
  'simulator.availableInPro': 'Disponibile in PRO',
  'simulator.unlockFull': 'Sblocca l\'analisi completa',
  'simulator.outOfRange': 'Valore fuori dall\'intervallo abituale',
  'simulator.resetValues': 'Ripristina valori',
  'simulator.saveScenario': 'Salva scenario',
  'simulator.vacancyUpgradeCopy': 'La tua stima rapida usa un\'ipotesi standard di sfitto ({rate}). In PRO puoi testare occupazione, sensibilità e scaricare il report completo.',
  'simulator.includedAssumptions': 'Ipotesi incluse',
  'simulator.includedAssumptionsHelp': 'Per una stima veloce usiamo ipotesi semplificate. In PRO puoi modificare sfitto, ristrutturazione, fiscalità, scenari e sensibilità.',
  'simulator.quickEstimateDisclaimer': 'Stima rapida con ipotesi semplificate. Per spese reali, tasse, sensibilità, TIR, scenari e trend di mercato, genera il Report PRO.',
  'simulator.resultsPlaceholderTitle': 'La tua stima apparirà qui',
  'simulator.resultsPlaceholder': 'Regola prezzo, affitto o finanziamento per vedere cashflow e fattibilità.',
  'simulator.viabilityProHint': 'Scopri la rendita netta reale nel Report PRO.',
  'simulator.fiscalProTip': 'Nel Report PRO vedrai l\'impatto fiscale reale: deduzione interessi*, ammortamento e rendita netta.',
  'simulator.downloadPdf': 'Scarica il report in PDF',
  'waitlist.email': 'Email',
  'waitlist.city': 'Città',
  'waitlist.maxBudget': 'Budget massimo',
  'waitlist.availableCash': 'Capitale disponibile',
  'waitlist.minGrossYield': 'Rendimento lordo minimo (%)',
  'waitlist.minCashflow': 'Cash flow mensile minimo',
  'waitlist.strategy': 'Strategia',
  'waitlist.strategyLongTerm': 'Affitto a lungo termine',
  'waitlist.strategyRoom': 'Affitto a stanze',
  'waitlist.strategyRenovate': 'Ristrutturazione e affitto',
  'waitlist.consent': 'Accetto di ricevere comunicazioni su Radar',
  'waitlist.done': 'Richiesta inviata! Ti avviseremo quando ci saranno novità.',
  'radar.criteriaTitle': 'I tuoi criteri di investimento',
  'radar.targetCity': 'Città obiettivo',
  'radar.maxBudget': 'Budget massimo',
  'radar.availableCash': 'Capitale disponibile',
  'radar.useMortgage': 'Usa mutuo',
  'radar.ltv': 'LTV mutuo (%)',
  'radar.interestRate': 'Tasso di interesse (%)',
  'radar.mortgageYears': 'Durata mutuo',
  'radar.minGrossYield': 'Rend. lordo min. (%)',
  'radar.minNetYield': 'Rend. netto min. (%)',
  'radar.minCashflow': 'Cash flow mensile min.',
  'radar.search': 'Cerca opportunità',
  'radar.searching': 'Ricerca…',
};

const MESSAGES: Record<LanguageCode, Messages> = { es, en, pt, it };

export function getMessages(language: LanguageCode): Messages {
  return MESSAGES[language];
}

export function t(language: LanguageCode, key: MessageKey): string {
  return MESSAGES[language][key] ?? MESSAGES.en[key] ?? key;
}
