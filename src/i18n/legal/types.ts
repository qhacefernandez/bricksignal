export interface LegalSection {
  id: string;
  title: string;
  paragraphs: string[];
  listItems?: string[];
}

export interface LegalDocument {
  title: string;
  subtitle?: string;
  lastUpdated: string;
  sections: LegalSection[];
}

export type LegalPageKind = 'legal' | 'privacy' | 'cookies';

export interface LegalNavLabels {
  legal: string;
  privacy: string;
  cookies: string;
}

export interface MarketLegalPages {
  nav: LegalNavLabels;
  legal: LegalDocument;
  privacy: LegalDocument;
  cookies: LegalDocument;
}
