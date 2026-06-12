import type { MarketSeoProfile, MarketSlug } from './types';

export const SEO_PROFILES: Record<MarketSlug, MarketSeoProfile> = {
  es: {
    title: 'BrickSignal — Calculadora rentabilidad alquiler e inversión inmobiliaria',
    description: 'Calcula si un piso de alquiler realmente te deja dinero cada mes. Simulador gratuito con hipoteca, gastos, vacancia y cashflow.',
    keywords: ['calculadora rentabilidad alquiler', 'simulador inversión inmobiliaria', 'calcular cashflow alquiler'],
    faq: [
      { question: '¿Cómo calcular la rentabilidad de un piso en alquiler?', answer: 'Introduce precio, renta, gastos e hipoteca. BrickSignal calcula rentabilidad bruta, neta y cashflow mensual.' },
    ],
  },
  pt: {
    title: 'BrickSignal — Calculadora rentabilidade arrendamento',
    description: 'Calcula se um imóvel para arrendar gera dinheiro todos os meses. Simulador gratuito com crédito, despesas e cashflow.',
    keywords: ['calculadora rentabilidade arrendamento', 'simulador investimento imobiliário', 'cashflow imóvel arrendado'],
  },
  it: {
    title: 'BrickSignal — Calcolatore rendimento affitto',
    description: 'Calcola se un immobile in affitto genera cassa ogni mese. Simulatore gratuito con mutuo, spese e cash flow.',
    keywords: ['calcolatore rendimento affitto', 'simulatore investimento immobiliare', 'cash flow immobile in affitto'],
  },
  uk: {
    title: 'BrickSignal — Buy to let calculator & rental yield calculator',
    description: 'Find out whether a rental property puts money in your pocket. Free buy-to-let calculator with mortgage, expenses and cash flow.',
    keywords: ['buy to let calculator', 'rental yield calculator', 'property investment calculator'],
  },
  us: {
    title: 'BrickSignal — Rental property calculator & cash flow calculator',
    description: 'Free rental property investment calculator with mortgage, expenses, vacancy and cash flow scenarios.',
    keywords: ['rental property calculator', 'cash flow rental calculator', 'real estate investment calculator'],
  },
  mx: {
    title: 'BrickSignal — Calculadora rentabilidad renta inmobiliaria',
    description: 'Calcula si una propiedad en renta realmente te deja flujo de efectivo cada mes. Simulador gratuito.',
    keywords: ['calculadora rentabilidad renta inmobiliaria', 'simulador inversión inmobiliaria', 'flujo de efectivo renta'],
  },
  au: {
    title: 'BrickSignal — Investment property calculator Australia',
    description: 'Free rental yield and property cash flow calculator for Australian investment properties.',
    keywords: ['investment property calculator', 'rental yield calculator Australia', 'property cash flow calculator'],
  },
  ie: {
    title: 'BrickSignal — Rental yield calculator Ireland',
    description: 'Buy-to-let calculator for Ireland. Net yield, mortgage and cash flow scenarios.',
    keywords: ['rental yield calculator Ireland', 'buy to let calculator Ireland', 'property investment calculator Ireland'],
  },
};
