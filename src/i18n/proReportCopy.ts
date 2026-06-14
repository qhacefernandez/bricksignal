import type { LanguageCode } from '@/config/types';
import type { ProVisualType } from '@/content/proReportVisualTypes';

export interface ProReportSection {
  id: string;
  icon: string;
  title: string;
  tagline: string;
  description: string;
  visual: ProVisualType;
}

export interface ProReportPageCopy {
  heroBadge: string;
  heroTitle: string;
  heroSubtitle: string;
  oneTimePayment: string;
  ctaPrimary: string;
  ctaSecondary: string;
  sectionLabel: string;
  exampleLabel: string;
  finalTitle: string;
  finalSubtitle: string;
  viewAllPlans: string;
  trustStrip: { value: string; label: string }[];
  salesTitle: string;
  salesSubtitle: string;
  viewVisualExamples: string;
  sections: ProReportSection[];
  pageTitle: string;
  pageDescription: string;
}

const SECTIONS_ES: ProReportSection[] = [
  { id: 'net-yield', icon: '📊', title: 'Rentabilidad neta', tagline: 'La cifra que separa una buena operación de una ilusión', description: 'Calculada con gastos operativos reales, vacancia y financiación — no con una regla del 30 %. Solo visible en PRO para forzar un análisis serio antes de comprometerte.', visual: 'netYield' },
  { id: 'vacancy', icon: '🏠', title: 'Vacancia y gastos editables', tagline: '¿Aguanta 2 meses vacío? ¿Y si sube el IBI?', description: 'Edita ocupación, IBI, comunidad, seguro y gestión en % o euros. Comprueba el margen real antes de firmar la arras.', visual: 'vacancy' },
  { id: 'metrics', icon: '📈', title: 'TIR, DSCR y cash-on-cash', tagline: 'El lenguaje que entiende tu banco y tu socio inversor', description: 'Tasa interna de retorno con venta al horizonte, cobertura del servicio de deuda y rentabilidad sobre capital aportado.', visual: 'advancedMetrics' },
  { id: 'fiscal', icon: '🧾', title: 'Fiscalidad con deducción de intereses*', tagline: 'La hipoteca también mueve la rentabilidad neta', description: 'Modelo por mercado: deducción de intereses según amortización (francés, alemán o solo intereses), tipo efectivo editable y proyección fiscal año a año.', visual: 'fiscal' },
  { id: 'projection', icon: '🔮', title: 'Proyección a 10 y 20 años', tagline: '¿Cuánto patrimonio acumulas si aguantas la operación?', description: 'Cashflow acumulado, valor del inmueble, deuda pendiente y patrimonio neto año a año con revalorización configurable.', visual: 'projection' },
  { id: 'sensitivity', icon: '🎛️', title: 'Análisis de sensibilidad', tagline: 'Anticipa el peor escenario antes de que ocurra', description: 'Matriz de renta (−10 %, base, +10 %), vacancia (0–10 %) y tipos (+0 a +2 pp). Identifica en qué punto se rompe el cashflow.', visual: 'sensitivity' },
  { id: 'pulse', icon: '🌡️', title: 'Market Pulse PRO', tagline: 'Contexto de mercado en tu región, no solo números aislados', description: 'Score de mercado, tendencia de precios y rentas, tipo hipotecario de referencia y narrativa orientativa con fuentes públicas.', visual: 'marketPulse' },
  { id: 'pdf', icon: '📄', title: 'PDF profesional descargable', tagline: 'Llévalo a la reunión con el banco, tu pareja o tu asesor', description: 'Informe multipágina con cabecera de marca, viabilidad, KPIs, cashflows de 20 años, sensibilidad, Market Pulse y checklist.', visual: 'pdfPreview' },
  { id: 'checklist', icon: '✅', title: 'Checklist de due diligence', tagline: '10 pasos que no deberías saltarte antes de comprar', description: 'Desde el estado registral hasta el plan de salida: una lista orientativa para no olvidar nada crítico en la operación.', visual: 'checklist' },
];

const SECTIONS_EN: ProReportSection[] = [
  { id: 'net-yield', icon: '📊', title: 'Net yield', tagline: 'The number that separates a good deal from wishful thinking', description: 'Calculated with real operating expenses, vacancy and financing — not a 30% rule of thumb. PRO-only to encourage rigorous analysis before you commit.', visual: 'netYield' },
  { id: 'vacancy', icon: '🏠', title: 'Editable vacancy and expenses', tagline: 'Can it survive 2 empty months? What if rates rise?', description: 'Edit occupancy, property tax, HOA, insurance and management in % or absolute amounts. Check real margin before you sign.', visual: 'vacancy' },
  { id: 'metrics', icon: '📈', title: 'IRR, DSCR and cash-on-cash', tagline: 'The language your bank and co-investor understand', description: 'Internal rate of return with exit at horizon, debt service coverage and return on equity invested.', visual: 'advancedMetrics' },
  { id: 'fiscal', icon: '🧾', title: 'Tax with mortgage interest relief*', tagline: 'Your mortgage also moves net yield', description: 'Per-market model: interest deduction by amortization method (annuity, linear or interest-only), editable effective rate and year-by-year tax projection.', visual: 'fiscal' },
  { id: 'projection', icon: '🔮', title: '10- and 20-year projection', tagline: 'How much wealth do you build if you hold the deal?', description: 'Cumulative cash flow, property value, outstanding debt and net equity year by year with configurable appreciation.', visual: 'projection' },
  { id: 'sensitivity', icon: '🎛️', title: 'Sensitivity analysis', tagline: 'Anticipate the worst case before it happens', description: 'Matrix of rent (−10%, base, +10%), vacancy (0–10%) and rates (+0 to +2 pp). Find where cash flow breaks.', visual: 'sensitivity' },
  { id: 'pulse', icon: '🌡️', title: 'Market Pulse PRO', tagline: 'Market context in your region, not isolated numbers', description: 'Market score, price and rent trends, reference mortgage rate and narrative from public sources.', visual: 'marketPulse' },
  { id: 'pdf', icon: '📄', title: 'Professional downloadable PDF', tagline: 'Take it to your bank meeting, partner or adviser', description: 'Multi-page report with branded header, viability, KPIs, 20-year cash flows, sensitivity, Market Pulse and checklist.', visual: 'pdfPreview' },
  { id: 'checklist', icon: '✅', title: 'Due diligence checklist', tagline: '10 steps you should not skip before buying', description: 'From land registry to exit plan: an indicative list so you do not miss anything critical.', visual: 'checklist' },
];

const SECTIONS_PT: ProReportSection[] = [
  { id: 'net-yield', icon: '📊', title: 'Rentabilidade líquida', tagline: 'O número que separa uma boa operação de uma ilusão', description: 'Calculada com despesas operacionais reais, vacância e financiamento — não com uma regra dos 30 %. Só visível no PRO para uma análise rigorosa antes de se comprometer.', visual: 'netYield' },
  { id: 'vacancy', icon: '🏠', title: 'Vacância e despesas editáveis', tagline: 'Aguenta 2 meses vazio? E se subir o IMI?', description: 'Edite ocupação, IMI, condomínio, seguro e gestão em % ou euros. Confirme a margem real antes de assinar.', visual: 'vacancy' },
  { id: 'metrics', icon: '📈', title: 'TIR, DSCR e cash-on-cash', tagline: 'A linguagem que o seu banco e parceiro entendem', description: 'Taxa interna de retorno com venda no horizonte, cobertura do serviço da dívida e rentabilidade sobre capital investido.', visual: 'advancedMetrics' },
  { id: 'fiscal', icon: '🧾', title: 'Fiscalidade com dedução de juros*', tagline: 'A hipoteca também move a rentabilidade líquida', description: 'Modelo por mercado: dedução de juros consoante amortização, taxa efetiva editável e projeção fiscal ano a ano.', visual: 'fiscal' },
  { id: 'projection', icon: '🔮', title: 'Projeção a 10 e 20 anos', tagline: 'Quanto património acumula se mantiver a operação?', description: 'Cashflow acumulado, valor do imóvel, dívida pendente e património líquido ano a ano com revalorização configurável.', visual: 'projection' },
  { id: 'sensitivity', icon: '🎛️', title: 'Análise de sensibilidade', tagline: 'Antecipe o pior cenário antes que aconteça', description: 'Matriz de renda (−10 %, base, +10 %), vacância (0–10 %) e taxas (+0 a +2 pp). Identifique onde o cashflow quebra.', visual: 'sensitivity' },
  { id: 'pulse', icon: '🌡️', title: 'Market Pulse PRO', tagline: 'Contexto de mercado na sua região, não só números isolados', description: 'Score de mercado, tendência de preços e rendas, taxa hipotecária de referência e narrativa com fontes públicas.', visual: 'marketPulse' },
  { id: 'pdf', icon: '📄', title: 'PDF profissional descarregável', tagline: 'Leve-o à reunião com o banco, parceiro ou consultor', description: 'Relatório multipágina com cabeçalho de marca, viabilidade, KPIs, cashflows de 20 anos, sensibilidade, Market Pulse e checklist.', visual: 'pdfPreview' },
  { id: 'checklist', icon: '✅', title: 'Checklist de due diligence', tagline: '10 passos que não deve saltar antes de comprar', description: 'Do registo predial ao plano de saída: lista orientativa para não esquecer nada crítico.', visual: 'checklist' },
];

const SECTIONS_IT: ProReportSection[] = [
  { id: 'net-yield', icon: '📊', title: 'Rendimento netto', tagline: 'La cifra che separa un buon affare da un\'illusione', description: 'Calcolato con spese operative reali, sfitto e finanziamento — non con la regola del 30%. Solo in PRO per un\'analisi rigorosa prima di impegnarti.', visual: 'netYield' },
  { id: 'vacancy', icon: '🏠', title: 'Sfitto e spese modificabili', tagline: 'Regge 2 mesi vuoti? E se sale l\'IMU?', description: 'Modifica occupazione, IMU, condominio, assicurazione e gestione in % o euro. Verifica il margine reale prima di firmare.', visual: 'vacancy' },
  { id: 'metrics', icon: '📈', title: 'TIR, DSCR e cash-on-cash', tagline: 'Il linguaggio che capiscono banca e co-investitore', description: 'Tasso interno di rendimento con vendita all\'orizzonte, copertura del servizio del debito e rendimento sul capitale investito.', visual: 'advancedMetrics' },
  { id: 'fiscal', icon: '🧾', title: 'Fiscalità con deduzione interessi*', tagline: 'Il mutuo muove anche la rendita netta', description: 'Modello per mercato: deduzione interessi per tipo di ammortamento, aliquota effettiva modificabile e proiezione fiscale annuale.', visual: 'fiscal' },
  { id: 'projection', icon: '🔮', title: 'Proiezione a 10 e 20 anni', tagline: 'Quanto patrimonio accumuli se mantieni l\'operazione?', description: 'Cash flow cumulato, valore immobile, debito residuo e patrimonio netto anno per anno con rivalutazione configurabile.', visual: 'projection' },
  { id: 'sensitivity', icon: '🎛️', title: 'Analisi di sensibilità', tagline: 'Anticipa il peggior scenario prima che accada', description: 'Matrice di affitto (−10%, base, +10%), sfitto (0–10%) e tassi (+0 a +2 pp). Trova dove si rompe il cash flow.', visual: 'sensitivity' },
  { id: 'pulse', icon: '🌡️', title: 'Market Pulse PRO', tagline: 'Contesto di mercato nella tua regione, non numeri isolati', description: 'Score di mercato, trend prezzi e affitti, tasso mutuo di riferimento e narrativa da fonti pubbliche.', visual: 'marketPulse' },
  { id: 'pdf', icon: '📄', title: 'PDF professionale scaricabile', tagline: 'Portalo in banca, dal partner o dal consulente', description: 'Report multipagina con intestazione brand, fattibilità, KPI, cash flow 20 anni, sensibilità, Market Pulse e checklist.', visual: 'pdfPreview' },
  { id: 'checklist', icon: '✅', title: 'Checklist due diligence', tagline: '10 passi da non saltare prima di comprare', description: 'Dalla visura al piano di uscita: lista orientativa per non dimenticare nulla di critico.', visual: 'checklist' },
];

const ES: ProReportPageCopy = {
  heroBadge: 'Informe PRO',
  heroTitle: 'Todo lo que necesitas para decidir si comprar — en un solo informe',
  heroSubtitle: 'No es una estimación rápida: es un análisis completo con métricas de inversor, escenarios, mercado y PDF descargable. Un pago único por inmueble.',
  oneTimePayment: 'pago único',
  ctaPrimary: 'Generar mi informe PRO',
  ctaSecondary: 'Probar gratis primero',
  sectionLabel: 'Incluido en tu informe',
  exampleLabel: 'Ejemplo real del informe',
  finalTitle: '¿Listo para analizar tu próxima operación?',
  finalSubtitle: 'Simula gratis, ajusta el escenario y desbloquea el informe cuando quieras decidir con datos.',
  viewAllPlans: 'Ver todos los planes →',
  trustStrip: [
    { value: '9+', label: 'Bloques de análisis' },
    { value: '20', label: 'Años de cashflows' },
    { value: 'PDF', label: 'Informe descargable' },
    { value: '1', label: 'Pago por escenario' },
  ],
  salesTitle: 'Todo lo que incluye tu informe — {price}',
  salesSubtitle: 'Un pago único por inmueble/escenario. Rentabilidad neta, fiscalidad con deducción de intereses*, análisis avanzado y PDF para decidir con datos.',
  viewVisualExamples: 'Ver ejemplos visuales de cada sección →',
  sections: SECTIONS_ES,
  pageTitle: 'Informe PRO',
  pageDescription: 'Análisis completo de inversión inmobiliaria: rentabilidad neta, TIR, sensibilidad, Market Pulse y PDF descargable.',
};

const EN: ProReportPageCopy = {
  heroBadge: 'PRO Report',
  heroTitle: 'Everything you need to decide whether to buy — in one report',
  heroSubtitle: 'Not a quick estimate: a full analysis with investor metrics, scenarios, market context and a downloadable PDF. One payment per property.',
  oneTimePayment: 'one-time payment',
  ctaPrimary: 'Generate my PRO report',
  ctaSecondary: 'Try free first',
  sectionLabel: 'Included in your report',
  exampleLabel: 'Real report example',
  finalTitle: 'Ready to analyse your next deal?',
  finalSubtitle: 'Simulate for free, tune the scenario and unlock the report when you want data-driven clarity.',
  viewAllPlans: 'See all plans →',
  trustStrip: [
    { value: '9+', label: 'Analysis blocks' },
    { value: '20', label: 'Years of cash flows' },
    { value: 'PDF', label: 'Downloadable report' },
    { value: '1', label: 'Payment per scenario' },
  ],
  salesTitle: 'Everything in your report — {price}',
  salesSubtitle: 'One payment per property/scenario. Net yield, mortgage interest tax relief*, advanced analysis and PDF to decide with data.',
  viewVisualExamples: 'See visual examples of each section →',
  sections: SECTIONS_EN,
  pageTitle: 'PRO Report',
  pageDescription: 'Full rental investment analysis: net yield, IRR, sensitivity, Market Pulse and downloadable PDF.',
};

const PT: ProReportPageCopy = {
  heroBadge: 'Relatório PRO',
  heroTitle: 'Tudo o que precisa para decidir se compra — num único relatório',
  heroSubtitle: 'Não é uma estimativa rápida: análise completa com métricas de investidor, cenários, mercado e PDF descarregável. Pagamento único por imóvel.',
  oneTimePayment: 'pagamento único',
  ctaPrimary: 'Gerar o meu relatório PRO',
  ctaSecondary: 'Experimentar grátis',
  sectionLabel: 'Incluído no seu relatório',
  exampleLabel: 'Exemplo real do relatório',
  finalTitle: 'Pronto para analisar a sua próxima operação?',
  finalSubtitle: 'Simule grátis, ajuste o cenário e desbloqueie o relatório quando quiser decidir com dados.',
  viewAllPlans: 'Ver todos os planos →',
  trustStrip: [
    { value: '8+', label: 'Blocos de análise' },
    { value: '20', label: 'Anos de cashflows' },
    { value: 'PDF', label: 'Relatório descarregável' },
    { value: '1', label: 'Pagamento por cenário' },
  ],
  salesTitle: 'Tudo o que inclui o seu relatório — {price}',
  salesSubtitle: 'Pagamento único por imóvel/cenário. Rentabilidade líquida, fiscalidade com dedução de juros*, análise avançada e PDF.',
  viewVisualExamples: 'Ver exemplos visuais de cada secção →',
  sections: SECTIONS_PT,
  pageTitle: 'Relatório PRO',
  pageDescription: 'Análise completa de investimento imobiliário: rentabilidade líquida, TIR, sensibilidade, Market Pulse e PDF descarregável.',
};

const IT: ProReportPageCopy = {
  heroBadge: 'Report PRO',
  heroTitle: 'Tutto ciò che serve per decidere se comprare — in un unico report',
  heroSubtitle: 'Non è una stima rapida: analisi completa con metriche da investitore, scenari, mercato e PDF scaricabile. Pagamento unico per immobile.',
  oneTimePayment: 'pagamento unico',
  ctaPrimary: 'Genera il mio report PRO',
  ctaSecondary: 'Prova gratis',
  sectionLabel: 'Incluso nel tuo report',
  exampleLabel: 'Esempio reale dal report',
  finalTitle: 'Pronto ad analizzare il tuo prossimo investimento?',
  finalSubtitle: 'Simula gratis, regola lo scenario e sblocca il report quando vuoi decidere con i dati.',
  viewAllPlans: 'Vedi tutti i piani →',
  trustStrip: [
    { value: '8+', label: 'Blocchi di analisi' },
    { value: '20', label: 'Anni di cash flow' },
    { value: 'PDF', label: 'Report scaricabile' },
    { value: '1', label: 'Pagamento per scenario' },
  ],
  salesTitle: 'Tutto ciò che include il tuo report — {price}',
  salesSubtitle: 'Pagamento unico per immobile/scenario. Rendimento netto, fiscalità con deduzione interessi*, analisi avanzata e PDF.',
  viewVisualExamples: 'Vedi esempi visivi di ogni sezione →',
  sections: SECTIONS_IT,
  pageTitle: 'Report PRO',
  pageDescription: 'Analisi completa dell\'investimento immobiliare: rendimento netto, TIR, sensibilità, Market Pulse e PDF scaricabile.',
};

const BY_LANG: Record<LanguageCode, ProReportPageCopy> = { es: ES, en: EN, pt: PT, it: IT };

export function getProReportPageCopy(language: LanguageCode): ProReportPageCopy {
  return BY_LANG[language] ?? ES;
}
