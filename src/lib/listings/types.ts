import { z } from 'zod';

export type ListingSource = 'mock' | 'manual' | 'csv' | 'authorized_api';
export type ListingCondition = 'ready' | 'needs_renovation' | 'unknown';
export type InvestmentStrategy =
  | 'traditional_rental'
  | 'room_rental'
  | 'renovate_and_rent';
export type RiskLevel = 'low' | 'medium' | 'high';

export interface Listing {
  id: string;
  source: ListingSource;
  sourceUrl?: string;
  title: string;
  city: string;
  district: string;
  price: number;
  sizeM2: number;
  rooms: number;
  bathrooms: number;
  floor?: number;
  hasElevator?: boolean;
  condition: ListingCondition;
  estimatedRenovationCost: number;
  estimatedMonthlyRent: number;
  communityFeesAnnual: number;
  ibiAnnual: number;
  otherAnnualCosts: number;
  publishedAt: string;
  updatedAt: string;
}

export interface InvestorCriteria {
  targetCity: string;
  targetDistricts: string[];
  maxPrice: number;
  availableCash: number;
  mortgageLtv: number;
  interestRate: number;
  mortgageYears: number;
  minGrossYield: number;
  minNetYield: number;
  minMonthlyCashflow: number;
  minDscr: number;
  maxRenovationCost: number;
  vacancyRate: number;
  rentGrowth: number;
  expenseGrowth: number;
  propertyAppreciation: number;
  strategy: InvestmentStrategy;
}

export interface OpportunityScore {
  listingId: string;
  grossYield: number;
  netYield: number;
  monthlyCashflow: number;
  annualCashflow: number;
  cashOnCash: number;
  dscr: number;
  initialInvestment: number;
  breakEvenRent: number;
  score: number;
  riskLevel: RiskLevel;
  reasons: string[];
  assumptions: Record<string, string>;
}

export interface ScoredOpportunity {
  listing: Listing;
  score: OpportunityScore;
}

export const investorCriteriaSchema = z.object({
  targetCity: z.string().min(1),
  targetDistricts: z.array(z.string()).default([]),
  maxPrice: z.number().min(10_000).max(50_000_000),
  availableCash: z.number().min(0).max(50_000_000),
  mortgageLtv: z.number().min(0).max(0.95),
  interestRate: z.number().min(0).max(20),
  mortgageYears: z.number().min(1).max(40),
  minGrossYield: z.number().min(0).max(30),
  minNetYield: z.number().min(0).max(30),
  minMonthlyCashflow: z.number().min(-10_000).max(50_000),
  minDscr: z.number().min(0).max(10),
  maxRenovationCost: z.number().min(0).max(5_000_000),
  vacancyRate: z.number().min(0).max(1),
  rentGrowth: z.number().min(-10).max(30),
  expenseGrowth: z.number().min(0).max(20),
  propertyAppreciation: z.number().min(-10).max(20),
  strategy: z.enum(['traditional_rental', 'room_rental', 'renovate_and_rent']),
});

export const DEFAULT_INVESTOR_CRITERIA: InvestorCriteria = {
  targetCity: 'Madrid',
  targetDistricts: [],
  maxPrice: 200_000,
  availableCash: 60_000,
  mortgageLtv: 0.7,
  interestRate: 3.2,
  mortgageYears: 25,
  minGrossYield: 5,
  minNetYield: 3,
  minMonthlyCashflow: 100,
  minDscr: 1.1,
  maxRenovationCost: 25_000,
  vacancyRate: 0.08,
  rentGrowth: 2,
  expenseGrowth: 2,
  propertyAppreciation: 2,
  strategy: 'traditional_rental',
};

export const RADAR_CRITERIA_STORAGE_KEY = 'bricksignal-radar-criteria';
