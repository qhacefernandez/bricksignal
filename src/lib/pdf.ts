import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { MarketConfig } from '@/config/types';
import { calculateProjectionAtHorizon, DUE_DILIGENCE_CHECKLIST } from './calculations';
import { formatCurrencyForMarket } from './currency';
import { formatEuro, formatPercent } from './format';
import type { MarketPulseReport } from './marketPulse/types';
import type { CalculationResults, SimulatorInput, ViabilityStatus } from './types';

const DIRECTION_LABELS = {
  cooling: 'Enfriándose',
  stable: 'Estable',
  warming: 'Calentándose',
  hot: 'Caliente',
} as const;

const BRAND: [number, number, number] = [0, 111, 199];
const BRAND_LIGHT: [number, number, number] = [240, 247, 255];
const SLATE: [number, number, number] = [71, 85, 105];
const MARGIN = 14;
const PAGE_W = 210;
const CONTENT_W = PAGE_W - MARGIN * 2;
const FOOTER_Y = 282;

type DocWithTable = jsPDF & { lastAutoTable?: { finalY: number } };

function hexRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.replace('#', ''), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

const VIABILITY_COLORS: Record<ViabilityStatus, { bg: [number, number, number]; text: [number, number, number] }> = {
  green: { bg: hexRgb('#dcfce7'), text: hexRgb('#166534') },
  yellow: { bg: hexRgb('#fef9c3'), text: hexRgb('#854d0e') },
  red: { bg: hexRgb('#fee2e2'), text: hexRgb('#991b1b') },
};

class ProReportPdfBuilder {
  private readonly doc: jsPDF;
  private y = MARGIN;
  private page = 1;
  private readonly pagesWithHeader = new Set<number>();

  constructor(
    private readonly input: SimulatorInput,
    private readonly results: CalculationResults,
    private readonly market?: MarketConfig,
  ) {
    this.doc = new jsPDF({ unit: 'mm', format: 'a4' });
  }

  private money(value: number, precise = false): string {
    if (this.market) return formatCurrencyForMarket(value, this.market, precise);
    return formatEuro(value, precise);
  }

  private pct(value: number): string {
    return formatPercent(value);
  }

  private ensureSpace(needed: number): void {
    if (this.y + needed > FOOTER_Y) {
      this.drawFooterOnPage(this.page);
      this.doc.addPage();
      this.page += 1;
      this.ensureRunningHeader(this.page);
      this.y = MARGIN + 6;
    }
  }

  private ensureRunningHeader(pageNum: number): void {
    if (pageNum <= 1 || this.pagesWithHeader.has(pageNum)) return;
    this.doc.setPage(pageNum);
    this.drawRunningHeader();
    this.pagesWithHeader.add(pageNum);
    this.doc.setPage(this.page);
  }

  private drawFooterOnPage(pageNum: number): void {
    this.doc.setPage(pageNum);
    this.doc.setDrawColor(226, 232, 240);
    this.doc.line(MARGIN, FOOTER_Y - 2, PAGE_W - MARGIN, FOOTER_Y - 2);
    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(7.5);
    this.doc.setTextColor(...SLATE);
    this.doc.text(
      'BrickSignal · Informe PRO · No constituye asesoramiento financiero, fiscal, legal ni recomendación de compra.',
      MARGIN,
      FOOTER_Y + 2,
    );
    this.doc.text(`Página ${pageNum}`, PAGE_W - MARGIN, FOOTER_Y + 2, { align: 'right' });
    this.doc.setTextColor(0, 0, 0);
  }

  private drawFootersOnAllPages(): void {
    const total = this.doc.getNumberOfPages();
    for (let p = 1; p <= total; p += 1) {
      this.drawFooterOnPage(p);
    }
    this.doc.setPage(total);
    this.page = total;
  }

  private drawRunningHeader(): void {
    this.doc.setFillColor(...BRAND);
    this.doc.rect(0, 0, PAGE_W, 10, 'F');
    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(9);
    this.doc.setTextColor(255, 255, 255);
    this.doc.text('BrickSignal — Informe PRO', MARGIN, 6.5);
    const region = this.input.region || this.market?.defaultRegion || '';
    if (region) {
      this.doc.setFont('helvetica', 'normal');
      this.doc.text(region, PAGE_W - MARGIN, 6.5, { align: 'right' });
    }
    this.doc.setTextColor(0, 0, 0);
  }

  private drawCoverHeader(): void {
    this.doc.setFillColor(...BRAND);
    this.doc.rect(0, 0, PAGE_W, 42, 'F');
    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(22);
    this.doc.setTextColor(255, 255, 255);
    this.doc.text('BrickSignal', MARGIN, 18);
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'normal');
    this.doc.text('Informe de inversión PRO', MARGIN, 27);
    const dateStr = new Date().toLocaleDateString(this.market?.locale ?? 'es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
    this.doc.setFontSize(9);
    this.doc.text(`Generado el ${dateStr}`, MARGIN, 35);
    if (this.input.region) {
      this.doc.text(this.input.region, PAGE_W - MARGIN, 35, { align: 'right' });
    }
    this.doc.setTextColor(0, 0, 0);
    this.y = 50;
  }

  private sectionTitle(title: string): void {
    this.ensureSpace(14);
    this.doc.setFillColor(...BRAND);
    this.doc.rect(MARGIN, this.y, 3, 8, 'F');
    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(12);
    this.doc.setTextColor(...BRAND);
    this.doc.text(title, MARGIN + 6, this.y + 6);
    this.doc.setTextColor(0, 0, 0);
    this.y += 12;
  }

  private paragraph(text: string, size = 9): void {
    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(size);
    this.doc.setTextColor(...SLATE);
    const lines = this.doc.splitTextToSize(text, CONTENT_W) as string[];
    const blockH = lines.length * (size * 0.42) + 2;
    this.ensureSpace(blockH);
    this.doc.text(lines, MARGIN, this.y);
    this.y += blockH;
    this.doc.setTextColor(0, 0, 0);
  }

  private drawViabilityBanner(): void {
    const colors = VIABILITY_COLORS[this.results.viability];
    const h = 16;
    this.ensureSpace(h + 4);
    this.doc.setFillColor(...colors.bg);
    this.doc.roundedRect(MARGIN, this.y, CONTENT_W, h, 2, 2, 'F');
    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(11);
    this.doc.setTextColor(...colors.text);
    this.doc.text(`Viabilidad: ${this.results.viabilityLabel}`, MARGIN + 4, this.y + 7);
    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(8.5);
    const reasonLines = this.doc.splitTextToSize(this.results.viabilityReason, CONTENT_W - 8) as string[];
    this.doc.text(reasonLines, MARGIN + 4, this.y + 12);
    this.doc.setTextColor(0, 0, 0);
    this.y += h + 6;
  }

  private drawKpiGrid(items: { label: string; value: string }[]): void {
    const cols = 3;
    const gap = 4;
    const cellW = (CONTENT_W - gap * (cols - 1)) / cols;
    const cellH = 18;
    const rows = Math.ceil(items.length / cols);
    this.ensureSpace(rows * (cellH + gap));

    items.forEach((item, i) => {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const x = MARGIN + col * (cellW + gap);
      const y = this.y + row * (cellH + gap);
      this.doc.setFillColor(...BRAND_LIGHT);
      this.doc.setDrawColor(191, 219, 254);
      this.doc.roundedRect(x, y, cellW, cellH, 1.5, 1.5, 'FD');
      this.doc.setFont('helvetica', 'normal');
      this.doc.setFontSize(7.5);
      this.doc.setTextColor(...SLATE);
      this.doc.text(item.label, x + 3, y + 6);
      this.doc.setFont('helvetica', 'bold');
      this.doc.setFontSize(10);
      this.doc.setTextColor(...BRAND);
      this.doc.text(item.value, x + 3, y + 13);
    });
    this.doc.setTextColor(0, 0, 0);
    this.y += rows * (cellH + gap) + 4;
  }

  private table(
    head: string[][],
    body: (string | number)[][],
    opts?: { theme?: 'striped' | 'grid' | 'plain'; fontSize?: number },
  ): void {
    if (this.y > FOOTER_Y - 24) {
      this.doc.addPage();
      this.page += 1;
      this.y = MARGIN + 6;
    }
    const rows = body.map((row) => row.map(String));
    autoTable(this.doc, {
      startY: this.y,
      head,
      body: rows,
      margin: { top: 16, bottom: 20, left: MARGIN, right: MARGIN },
      showHead: 'everyPage',
      theme: opts?.theme ?? 'striped',
      styles: {
        fontSize: opts?.fontSize ?? 8.5,
        cellPadding: 2.5,
        lineColor: [226, 232, 240],
        lineWidth: 0.1,
        overflow: 'linebreak',
      },
      headStyles: {
        fillColor: [...BRAND],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: opts?.fontSize ?? 8.5,
      },
      alternateRowStyles: { fillColor: [248, 250, 252] },
      tableWidth: CONTENT_W,
      willDrawPage: (data: { pageNumber: number }) => {
        this.page = data.pageNumber;
        this.ensureRunningHeader(data.pageNumber);
      },
    });
    this.page = this.doc.getNumberOfPages();
    this.y = (this.doc as DocWithTable).lastAutoTable?.finalY ?? this.y;
    this.y += 8;
  }

  private bulletList(title: string, items: string[]): void {
    if (!items.length) return;
    this.sectionTitle(title);
    for (const item of items) {
      const lines = this.doc.splitTextToSize(`• ${item}`, CONTENT_W - 4) as string[];
      const h = lines.length * 4 + 1;
      this.ensureSpace(h);
      this.doc.setFont('helvetica', 'normal');
      this.doc.setFontSize(8.5);
      this.doc.setTextColor(...SLATE);
      this.doc.text(lines, MARGIN + 2, this.y);
      this.y += h;
    }
    this.doc.setTextColor(0, 0, 0);
    this.y += 2;
  }

  build(marketPulse?: MarketPulseReport & { lastUpdatedLabel?: string }): void {
    const { input, results } = this;
    const vacancyPct = input.vacancyPercent ?? (input.vacancyMonths ? (input.vacancyMonths / 12) * 100 : 5);

    this.drawCoverHeader();
    this.drawViabilityBanner();

    this.sectionTitle('Resumen ejecutivo');
    this.drawKpiGrid([
      { label: 'Precio de compra', value: this.money(input.purchasePrice) },
      { label: 'Renta mensual', value: `${this.money(input.monthlyRent)}/mes` },
      { label: 'Cashflow mensual', value: this.money(results.monthlyCashflow, true) },
      { label: 'Rentabilidad neta', value: this.pct(results.netYield) },
      { label: 'TIR estimada', value: this.pct(results.irr) },
      { label: 'Vacancia', value: `${vacancyPct.toFixed(1)} %` },
    ]);

    this.sectionTitle('Métricas clave');
    this.table(
      [['Métrica', 'Valor']],
      [
        ['Rentabilidad bruta', this.pct(results.grossYield)],
        ['Rentabilidad neta', this.pct(results.netYield)],
        ['Cash-on-cash', this.pct(results.cashOnCash)],
        ['DSCR', results.dscr === Infinity ? '∞' : results.dscr.toFixed(2)],
        ['Break-even renta', `${this.money(results.breakEvenRent)}/mes`],
        ['Inversión inicial', this.money(results.initialInvestment)],
        ['NOI anual', this.money(results.noi)],
        ['Gastos operativos anuales', this.money(results.operatingExpenses)],
        ['TIR estimada', this.pct(results.irr)],
      ],
    );

    this.sectionTitle('Inversión inicial');
    this.table(
      [['Concepto', 'Importe']],
      [
        ['Precio de compra', this.money(input.purchasePrice)],
        ['Impuesto de transmisión / ITP', this.money(results.transferTax)],
        ['Notaría y registro', this.money(input.notaryAndRegistry)],
        ['Reforma', this.money(input.renovationCost)],
        ['Mobiliario', this.money(input.furnitureCost)],
        ['Entrada / equity', this.money(input.downPayment)],
        ['Total inversión inicial', this.money(results.initialInvestment)],
      ],
    );

    this.sectionTitle('Desglose de gastos operativos (anuales)');
    const mgmt = input.monthlyRent * 12 * (input.managementPercent / 100);
    this.table(
      [['Gasto', 'Importe / año']],
      [
        ['IBI / impuesto sobre bienes', this.money(input.ibi)],
        ['Comunidad / HOA', this.money(input.communityFees)],
        ['Seguro del hogar', this.money(input.homeInsurance)],
        ['Mantenimiento', this.money(input.maintenance)],
        ['Otros gastos', this.money(input.otherExpenses)],
        ['Gestión inmobiliaria', this.money(mgmt)],
        ['NOI (ingreso neto operativo)', this.money(results.noi)],
      ],
    );

    if (input.useMortgage && input.financedAmount > 0) {
      this.sectionTitle('Hipoteca');
      this.table(
        [['Concepto', 'Valor']],
        [
          ['Importe financiado', this.money(input.financedAmount)],
          ['Cuota mensual', this.money(results.monthlyMortgagePayment)],
          ['Servicio de deuda anual', this.money(results.debtServiceAnnual)],
          ['Tipo de interés', `${input.interestRate.toFixed(2)} %`],
          ['Plazo', `${input.mortgageYears} años`],
        ],
      );
    }

    const proj10 = calculateProjectionAtHorizon(input, 10);
    const proj20 = calculateProjectionAtHorizon(input, 20);
    this.sectionTitle('Proyección a 10 y 20 años');
    this.table(
      [['Horizonte', 'Cashflow acumulado', 'Valor inmueble', 'Patrimonio neto', 'TIR']],
      [
        ['10 años', this.money(proj10.cumulativeCashflow), this.money(proj10.propertyValue), this.money(proj10.equity), this.pct(proj10.irr)],
        ['20 años', this.money(proj20.cumulativeCashflow), this.money(proj20.propertyValue), this.money(proj20.equity), this.pct(proj20.irr)],
      ],
    );

    const sale = results.saleScenario;
    this.sectionTitle('Escenario de venta');
    this.table(
      [['Concepto', 'Importe']],
      [
        [`Valor inmueble a ${sale.horizonYears} años`, this.money(sale.propertyValue)],
        ['Costes de venta', this.money(sale.saleCosts)],
        ['Deuda pendiente', this.money(sale.remainingDebt)],
        ['Proceeds netos de venta', this.money(sale.netSaleProceeds)],
      ],
    );

    const cfYears = Math.min(20, results.annualCashflows.length);
    this.sectionTitle(`Cashflows anuales (${cfYears} años)`);
    this.table(
      [['Año', 'Renta efectiva', 'Gastos op.', 'NOI', 'Deuda', 'CF post-imp.', 'Valor', 'Equity']],
      results.annualCashflows.slice(0, cfYears).map((row) => [
        String(row.year),
        this.money(row.effectiveRent),
        this.money(row.operatingExpenses),
        this.money(row.noi),
        this.money(row.debtService),
        this.money(row.cashflowAfterTax),
        this.money(row.propertyValue),
        this.money(row.equity),
      ]),
      { theme: 'grid', fontSize: 7.5 },
    );

    this.sectionTitle('Análisis de sensibilidad (cashflow mensual)');
    this.paragraph(
      'Variación de renta (−10 %, base, +10 %), vacancia y tipos de interés (+0, +1 y +2 puntos porcentuales).',
      8,
    );
    const rentLabels = ['-10%', 'Base', '+10%'];
    const sensitivityBody: string[][] = [];
    for (const vacancy of [0, 5, 10]) {
      for (const delta of [0, 1, 2]) {
        const row: string[] = [`Vac. ${vacancy}% · tipo +${delta} pp`];
        for (const label of rentLabels) {
          const cell = results.sensitivity.find(
            (s) =>
              s.rentLabel === label &&
              s.vacancyPercent === vacancy &&
              Math.abs(s.interestRate - (input.interestRate + delta)) < 0.01,
          );
          row.push(cell ? this.money(cell.cell.monthlyCashflow, true) : '—');
        }
        sensitivityBody.push(row);
      }
    }
    this.table([['Escenario', ...rentLabels]], sensitivityBody, { fontSize: 8 });

    this.sectionTitle('Hipótesis utilizadas');
    this.table(
      [['Parámetro', 'Valor']],
      Object.entries(results.assumptions).map(([k, v]) => [k, v]),
      { theme: 'plain' },
    );

    if (marketPulse) {
      this.sectionTitle('Market Pulse PRO');
      this.drawKpiGrid([
        { label: 'Score mercado', value: `${marketPulse.score}/100` },
        { label: 'Tendencia', value: DIRECTION_LABELS[marketPulse.direction] },
        { label: 'Confianza', value: marketPulse.confidence },
        {
          label: 'Precio YoY',
          value: marketPulse.metrics.priceTrendYoY != null ? `${marketPulse.metrics.priceTrendYoY}%` : '—',
        },
        {
          label: 'Renta YoY',
          value: marketPulse.metrics.rentTrendYoY != null ? `${marketPulse.metrics.rentTrendYoY}%` : '—',
        },
        {
          label: 'Tipo hipoteca ref.',
          value: marketPulse.metrics.mortgageRate != null ? `${marketPulse.metrics.mortgageRate}%` : '—',
        },
      ]);
      this.paragraph(
        `${marketPulse.geographyName} (${marketPulse.geographyLevel}) · ${marketPulse.period} · ${marketPulse.lastUpdatedLabel ?? marketPulse.publishedAt}`,
        8,
      );
      if (marketPulse.narrative.headline) {
        this.doc.setFont('helvetica', 'bold');
        this.doc.setFontSize(9);
        this.ensureSpace(8);
        this.doc.text(marketPulse.narrative.headline, MARGIN, this.y);
        this.y += 6;
      }
      this.paragraph(marketPulse.narrative.summary);
      this.bulletList('Factores positivos', marketPulse.narrative.positives);
      this.bulletList('Riesgos', marketPulse.narrative.risks);
      this.bulletList('Vigilar', marketPulse.narrative.watchlist);
      this.paragraph(
        `Fuentes: ${marketPulse.sources.map((s) => `${s.name} (${s.publisher}, ${s.date})`).join(' · ')}`,
        7.5,
      );
      this.paragraph(marketPulse.disclaimer, 7);
    }

    this.sectionTitle('Checklist de due diligence');
    this.paragraph('Lista orientativa antes de comprometerte con la operación:', 8.5);
    this.table(
      [['#', 'Acción recomendada']],
      DUE_DILIGENCE_CHECKLIST.map((item, i) => [String(i + 1), item]),
      { theme: 'striped', fontSize: 8.5 },
    );

    this.drawFootersOnAllPages();
    this.doc.save(`bricksignal-informe-${Date.now()}.pdf`);
  }
}

export function generateProReportPdf(
  input: SimulatorInput,
  results: CalculationResults,
  market?: MarketConfig,
  marketPulse?: MarketPulseReport & { lastUpdatedLabel?: string },
): void {
  new ProReportPdfBuilder(input, results, market).build(marketPulse);
}
