import type { LanguageCode } from '@/config/types';

export type ProMetricKey = 'netYield' | 'cashOnCash' | 'dscr' | 'breakEven' | 'irr';

export interface ProMetricCopy {
  label: string;
  /** Definición + por qué es útil (visible en el tooltip ?) */
  tooltip: string;
}

export interface ProMetricsCopy {
  previewTitle: string;
  unlockedTitle: string;
  perMonth: string;
  metrics: Record<ProMetricKey, ProMetricCopy>;
}

const ES: ProMetricsCopy = {
  previewTitle: 'Vista previa Informe PRO',
  unlockedTitle: 'Informe PRO desbloqueado',
  perMonth: '/mes',
  metrics: {
    netYield: {
      label: 'Rentabilidad neta',
      tooltip:
        'Ingresos operativos menos gastos reales, dividido entre el precio de compra. Por qué importa: es la métrica que distingue una operación sólida de una que solo “cuadra en Excel” con hipótesis optimistas.',
    },
    cashOnCash: {
      label: 'Cash-on-cash',
      tooltip:
        'Cashflow anual después de gastos y deuda, dividido entre el capital que aportas. Por qué importa: te dice qué rendimiento obtienes sobre el dinero que realmente sacas del bolsillo, no sobre el valor total del inmueble.',
    },
    dscr: {
      label: 'DSCR',
      tooltip:
        'NOI (ingreso neto operativo) dividido entre el servicio anual de la deuda. Por qué importa: los bancos suelen exigir ≥ 1,2; por debajo de 1,0 la operación no cubre la hipoteca solo con los alquileres.',
    },
    breakEven: {
      label: 'Break-even renta',
      tooltip:
        'Renta mensual mínima para cubrir gastos operativos y la cuota hipotecaria. Por qué importa: marca el suelo de renta que necesitas; si el mercado paga menos, la operación pierde dinero cada mes.',
    },
    irr: {
      label: 'TIR estimada',
      tooltip:
        'Tasa interna de retorno incluyendo cashflows y venta al horizonte elegido. Por qué importa: permite comparar esta inversión con otras alternativas (fondos, otro piso, dejar el dinero en el banco) en una sola cifra.',
    },
  },
};

const EN: ProMetricsCopy = {
  previewTitle: 'PRO Report preview',
  unlockedTitle: 'PRO Report unlocked',
  perMonth: '/mo',
  metrics: {
    netYield: {
      label: 'Net yield',
      tooltip:
        'Operating income minus real expenses, divided by purchase price. Why it matters: it separates a solid deal from one that only “works on paper” with optimistic assumptions.',
    },
    cashOnCash: {
      label: 'Cash-on-cash',
      tooltip:
        'Annual cash flow after expenses and debt, divided by equity invested. Why it matters: it shows return on the money you actually put in, not on the full property value.',
    },
    dscr: {
      label: 'DSCR',
      tooltip:
        'NOI divided by annual debt service. Why it matters: lenders often require ≥ 1.2; below 1.0 the property does not cover the mortgage from rent alone.',
    },
    breakEven: {
      label: 'Break-even rent',
      tooltip:
        'Minimum monthly rent to cover operating costs and mortgage payment. Why it matters: it is your rent floor — if the market pays less, you lose money every month.',
    },
    irr: {
      label: 'Estimated IRR',
      tooltip:
        'Internal rate of return including cash flows and sale at your chosen horizon. Why it matters: compare this deal with alternatives (funds, another property, cash) in one number.',
    },
  },
};

const PT: ProMetricsCopy = {
  previewTitle: 'Pré-visualização Relatório PRO',
  unlockedTitle: 'Relatório PRO desbloqueado',
  perMonth: '/mês',
  metrics: {
    netYield: {
      label: 'Rentabilidade líquida',
      tooltip:
        'Receitas operacionais menos despesas reais, dividido pelo preço de compra. Porque importa: distingue uma operação sólida de uma que só “fecha no Excel” com hipóteses otimistas.',
    },
    cashOnCash: {
      label: 'Cash-on-cash',
      tooltip:
        'Cashflow anual após despesas e dívida, dividido pelo capital que aporta. Porque importa: mostra o retorno sobre o dinheiro que realmente tira do bolso, não sobre o valor total do imóvel.',
    },
    dscr: {
      label: 'DSCR',
      tooltip:
        'NOI dividido pelo serviço anual da dívida. Porque importa: os bancos costumam exigir ≥ 1,2; abaixo de 1,0 o imóvel não cobre a prestação só com rendas.',
    },
    breakEven: {
      label: 'Renda break-even',
      tooltip:
        'Renda mensal mínima para cobrir despesas operacionais e prestação. Porque importa: é o chão de renda necessário; se o mercado paga menos, perde dinheiro todos os meses.',
    },
    irr: {
      label: 'TIR estimada',
      tooltip:
        'Taxa interna de retorno incluindo cashflows e venda no horizonte escolhido. Porque importa: compara esta operação com outras alternativas numa única métrica.',
    },
  },
};

const IT: ProMetricsCopy = {
  previewTitle: 'Anteprima Report PRO',
  unlockedTitle: 'Report PRO sbloccato',
  perMonth: '/mese',
  metrics: {
    netYield: {
      label: 'Rendimento netto',
      tooltip:
        'Ricavi operativi meno spese reali, diviso prezzo di acquisto. Perché conta: distingue un affare solido da uno che “funziona solo su Excel” con ipotesi ottimistiche.',
    },
    cashOnCash: {
      label: 'Cash-on-cash',
      tooltip:
        'Cash flow annuo dopo spese e debito, diviso capitale investito. Perché conta: mostra il rendimento sul denaro che metti davvero, non sul valore totale dell\'immobile.',
    },
    dscr: {
      label: 'DSCR',
      tooltip:
        'NOI diviso servizio annuo del debito. Perché conta: le banche spesso richiedono ≥ 1,2; sotto 1,0 l\'immobile non copre il mutuo solo con gli affitti.',
    },
    breakEven: {
      label: 'Affitto break-even',
      tooltip:
        'Affitto mensile minimo per coprire spese operative e rata mutuo. Perché conta: è il pavimento di affitto; se il mercato paga meno, perdi soldi ogni mese.',
    },
    irr: {
      label: 'TIR stimata',
      tooltip:
        'Tasso interno di rendimento con cash flow e vendita all\'orizzonte scelto. Perché conta: confronta questo investimento con altre alternative in un solo numero.',
    },
  },
};

const BY_LANG: Record<LanguageCode, ProMetricsCopy> = { es: ES, en: EN, pt: PT, it: IT };

export function getProMetricsCopy(language: LanguageCode): ProMetricsCopy {
  return BY_LANG[language] ?? ES;
}

/** Todas las métricas avanzadas del bloque preview son PRO. */
export const PRO_PREVIEW_METRIC_KEYS: ProMetricKey[] = [
  'netYield',
  'cashOnCash',
  'dscr',
  'breakEven',
  'irr',
];
