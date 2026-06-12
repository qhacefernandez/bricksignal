export type MarketCode = 'ES' | 'PT' | 'IT' | 'GB' | 'US' | 'MX' | 'AU' | 'IE';
export type MarketSlug = 'es' | 'pt' | 'it' | 'uk' | 'us' | 'mx' | 'au' | 'ie';
export type CurrencyCode = 'EUR' | 'GBP' | 'USD' | 'MXN' | 'AUD';
export type MeasurementSystem = 'metric' | 'imperial' | 'mixed';
export type LanguageCode = 'es' | 'en' | 'pt' | 'it';
export type ProductType = 'pro_report' | 'radar_basic' | 'radar_pro' | 'radar_investor';

export type ProductFeature = {
  simulator: boolean;
  proReport: boolean;
  radarLanding: boolean;
  radarDemo: boolean;
  radarWaitlist: boolean;
  radarEarlyAccess: boolean;
  authorizedListings: boolean;
  subscriptions: boolean;
};

export type MortgageProfile = {
  defaultInterestRate: number;
  defaultYears: number;
  defaultLtv: number;
  mortgageTypeLabel: string;
  requiresRegion: boolean;
  notes: string[];
};

export type TaxFieldAppliesTo =
  | 'purchase_price'
  | 'loan_amount'
  | 'rental_income'
  | 'profit'
  | 'fixed';

export type TaxField = {
  id: string;
  label: string;
  description: string;
  defaultRate?: number;
  defaultAmount?: number;
  inputType: 'percentage' | 'amount';
  editable: boolean;
  appliesTo: TaxFieldAppliesTo;
  /** Maps to internal simulator bucket for universal formulas */
  bucket: 'transfer_tax' | 'purchase_fixed' | 'annual_property' | 'annual_community' | 'annual_insurance' | 'annual_maintenance' | 'annual_other' | 'rental_tax_rate' | 'purchase_tax_extra';
};

export type TaxProfile = {
  mode: 'simple' | 'regional' | 'state_based' | 'manual';
  purchaseTaxFields: TaxField[];
  annualCostFields: TaxField[];
  rentalTaxFields: TaxField[];
  requiresRegionSelection: boolean;
  regionLabel?: string;
  disclaimer: string;
};

export type PriceConfig = {
  amount: number;
  currency: CurrencyCode;
  stripePriceEnvKey: string;
};

export type MarketPricing = {
  reportPrice: PriceConfig;
  radarBasic?: PriceConfig & { interval: 'month' };
  radarPro?: PriceConfig & { interval: 'month' };
  radarInvestor?: PriceConfig & { interval: 'month' };
};

export type MarketSeoProfile = {
  title: string;
  description: string;
  keywords: string[];
  faq?: Array<{ question: string; answer: string }>;
};

export type RadarMarketConfig = {
  enabled: boolean;
  waitlistEnabled: boolean;
  demoEnabled: boolean;
  authorizedProviderEnabled: boolean;
  supportedStrategies: Array<'long_term_rental' | 'room_rental' | 'renovate_and_rent' | 'short_term_rental'>;
  dataSourceMessage: string;
};

export type MarketLegalConfig = {
  disclaimer: string;
  dataNotice: string;
  noAdviceNotice: string;
};

export type MarketConfig = {
  code: MarketCode;
  slug: MarketSlug;
  name: string;
  nativeName: string;
  currency: CurrencyCode;
  locale: string;
  language: LanguageCode;
  measurementSystem: MeasurementSystem;
  defaultAreaUnit: 'm2' | 'sqft';
  features: ProductFeature;
  defaultMortgage: MortgageProfile;
  taxProfile: TaxProfile;
  pricing: MarketPricing;
  seo: MarketSeoProfile;
  radar: RadarMarketConfig;
  legal: MarketLegalConfig;
  /** Default cities for mock listings */
  mockCities: string[];
  /** Default region/state for simulator */
  defaultRegion: string;
};
