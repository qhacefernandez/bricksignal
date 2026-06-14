import { z } from 'zod';
import type { MarketSlug } from '@/config/types';

export const amortizationMethodSchema = z.enum(['french', 'linear', 'interest_only']);

export const propertyTypeSchema = z.enum(['second_hand', 'new_build']);
export const propertyStatusSchema = z.enum(['ready', 'needs_renovation']);
export const projectionHorizonSchema = z.union([
  z.literal(5),
  z.literal(10),
  z.literal(15),
  z.literal(20),
]);

export const simulatorInputSchema = z.object({
  purchasePrice: z.number().min(1000).max(50_000_000),
  region: z.string().min(1),
  propertyType: propertyTypeSchema,
  squareMeters: z.number().min(1).max(10_000).optional(),
  propertyStatus: propertyStatusSchema,
  renovationCost: z.number().min(0).max(5_000_000),
  furnitureCost: z.number().min(0).max(500_000),
  monthlyRent: z.number().min(0).max(100_000),
  vacancyMonths: z.number().min(0).max(12).optional(),
  vacancyPercent: z.number().min(0).max(100).optional(),
  rentGrowthPercent: z.number().min(-10).max(30),
  ibi: z.number().min(0).max(100_000),
  communityFees: z.number().min(0).max(100_000),
  homeInsurance: z.number().min(0).max(50_000),
  rentDefaultInsurance: z.number().min(0).max(50_000),
  maintenance: z.number().min(0).max(500_000),
  managementPercent: z.number().min(0).max(30),
  otherExpenses: z.number().min(0).max(500_000),
  itpPercent: z.number().min(0).max(15),
  vatPercent: z.number().min(0).max(21).default(10),
  ajdPercent: z.number().min(0).max(5),
  notaryAndRegistry: z.number().min(0).max(100_000),
  liquidityReserve: z.number().min(0).max(1_000_000),
  useMortgage: z.boolean(),
  downPayment: z.number().min(0).max(50_000_000),
  financedAmount: z.number().min(0).max(50_000_000),
  interestRate: z.number().min(0).max(20),
  mortgageYears: z.number().min(1).max(40),
  amortizationMethod: amortizationMethodSchema.optional(),
  effectiveTaxRate: z.number().min(0).max(50),
  projectionHorizon: projectionHorizonSchema,
  appreciationPercent: z.number().min(-10).max(20),
  saleCostPercent: z.number().min(0).max(15),
  expenseInflationPercent: z.number().min(0).max(15),
  marketSlug: z.enum(['es', 'pt', 'it', 'uk', 'us', 'mx', 'au', 'ie']).optional(),
  taxValues: z.record(z.string(), z.number()).optional(),
  areaSqft: z.number().min(1).max(100_000).optional(),
});

export type SimulatorInput = z.infer<typeof simulatorInputSchema>;
export type ViabilityStatus = 'green' | 'yellow' | 'red';

export interface AnnualCashflowRow {
  year: number;
  grossRent: number;
  vacancyLoss: number;
  effectiveRent: number;
  operatingExpenses: number;
  noi: number;
  debtService: number;
  cashflowBeforeTax: number;
  taxes: number;
  cashflowAfterTax: number;
  propertyValue: number;
  remainingDebt: number;
  equity: number;
}

export interface SensitivityCell {
  monthlyCashflow: number;
  netYield: number;
  dscr: number;
  viability: ViabilityStatus;
}

export interface SensitivityScenario {
  rentMultiplier: number;
  rentLabel: string;
  vacancyPercent: number;
  interestRate: number;
  expenseMultiplier?: number;
  cell: SensitivityCell;
}

export interface SaleScenario {
  horizonYears: number;
  propertyValue: number;
  saleCosts: number;
  netSaleProceeds: number;
  remainingDebt: number;
  netEquity: number;
  totalReturn: number;
}

export interface CalculationResults {
  grossYield: number;
  netYield: number;
  monthlyCashflow: number;
  annualCashflowAfterTax: number;
  monthlyMortgagePayment: number;
  initialInvestment: number;
  viability: ViabilityStatus;
  viabilityLabel: string;
  viabilityReason: string;
  cashOnCash: number;
  dscr: number;
  breakEvenRent: number;
  irr: number;
  noi: number;
  effectiveAnnualRent: number;
  operatingExpenses: number;
  debtServiceAnnual: number;
  acquisitionCost: number;
  transferTax: number;
  totalPurchaseCosts: number;
  annualCashflows: AnnualCashflowRow[];
  sensitivity: SensitivityScenario[];
  saleScenario: SaleScenario;
  assumptions: Record<string, string>;
}

export type { MarketSlug };

export const DEFAULT_INPUT: SimulatorInput = {
  purchasePrice: 150_000,
  region: 'Madrid',
  propertyType: 'second_hand',
  squareMeters: 65,
  propertyStatus: 'ready',
  renovationCost: 0,
  furnitureCost: 0,
  monthlyRent: 850,
  vacancyPercent: 8,
  rentGrowthPercent: 2,
  ibi: 450,
  communityFees: 600,
  homeInsurance: 180,
  rentDefaultInsurance: 0,
  maintenance: 600,
  managementPercent: 0,
  otherExpenses: 0,
  itpPercent: 6,
  vatPercent: 10,
  ajdPercent: 0.5,
  notaryAndRegistry: 2_500,
  liquidityReserve: 5_000,
  useMortgage: true,
  downPayment: 45_000,
  financedAmount: 105_000,
  interestRate: 3.2,
  mortgageYears: 25,
  effectiveTaxRate: 0,
  projectionHorizon: 10,
  appreciationPercent: 2,
  saleCostPercent: 3,
  expenseInflationPercent: 2,
  marketSlug: 'es',
  taxValues: {},
};

export const SPANISH_REGIONS = [
  'Andalucía', 'Aragón', 'Asturias', 'Baleares', 'Canarias', 'Cantabria',
  'Castilla-La Mancha', 'Castilla y León', 'Cataluña', 'Comunidad Valenciana',
  'Extremadura', 'Galicia', 'La Rioja', 'Madrid', 'Murcia', 'Navarra',
  'País Vasco', 'Ceuta', 'Melilla',
] as const;

export const SCENARIO_STORAGE_KEY = 'bricksignal-scenario';
export const PRO_ACCESS_STORAGE_KEY = 'bricksignal-pro-access';

export interface ProAccess {
  sessionId: string;
  verifiedAt: number;
  /** Informes no usados de la compra actual */
  reportsRemaining?: number;
  /** Fingerprints de escenarios ya desbloqueados */
  claimedScenarios?: string[];
  /** Excepciones "es la misma simulación" consumidas (máx. 2 por compra) */
  sameSimulationExceptions?: number;
}
