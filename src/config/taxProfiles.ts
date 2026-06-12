import type { MarketSlug, TaxProfile } from './types';

const pct = (id: string, label: string, description: string, defaultRate: number, bucket: TaxProfile['purchaseTaxFields'][0]['bucket'], appliesTo: TaxProfile['purchaseTaxFields'][0]['appliesTo'] = 'purchase_price') => ({
  id, label, description, defaultRate, inputType: 'percentage' as const, editable: true, appliesTo, bucket,
});

const amt = (id: string, label: string, description: string, defaultAmount: number, bucket: TaxProfile['annualCostFields'][0]['bucket']) => ({
  id, label, description, defaultAmount, inputType: 'amount' as const, editable: true, appliesTo: 'fixed' as const, bucket,
});

export const TAX_PROFILES: Record<MarketSlug, TaxProfile> = {
  es: {
    mode: 'regional',
    requiresRegionSelection: true,
    regionLabel: 'Comunidad autónoma',
    disclaimer: 'Los impuestos varían por comunidad autónoma y situación personal. Usa tus propios valores.',
    purchaseTaxFields: [
      pct('itp', 'ITP (segunda mano)', 'Impuesto de transmisiones — editable por CCAA', 6, 'transfer_tax'),
      pct('vat', 'IVA (obra nueva)', 'Por defecto 10% en vivienda', 10, 'transfer_tax'),
      pct('ajd', 'AJD', 'Actos jurídicos documentados', 0.5, 'purchase_tax_extra'),
      amt('notary', 'Notaría / registro / gestoría', 'Gastos de compra fijos', 2500, 'purchase_fixed'),
    ],
    annualCostFields: [
      amt('ibi', 'IBI', 'Impuesto sobre bienes inmuebles', 450, 'annual_property'),
      amt('community', 'Comunidad', 'Gastos de comunidad anuales', 600, 'annual_community'),
      amt('insurance', 'Seguro hogar', 'Seguro anual', 180, 'annual_insurance'),
      amt('maintenance', 'Mantenimiento', 'Mantenimiento anual estimado', 600, 'annual_maintenance'),
    ],
    rentalTaxFields: [
      pct('rental_tax', 'Tipo efectivo impuestos alquiler', 'Orientativo — consulta con profesional', 0, 'rental_tax_rate', 'profit'),
    ],
  },
  pt: {
    mode: 'simple',
    requiresRegionSelection: false,
    disclaimer: 'Fiscalidade orientativa. Os impostos variam conforme a situação pessoal.',
    purchaseTaxFields: [
      pct('imt', 'IMT', 'Imposto municipal sobre transmissões', 6, 'transfer_tax'),
      pct('stamp', 'Imposto do selo', 'Sobre financiamento/compra', 0.8, 'purchase_tax_extra'),
      amt('notary', 'Notário / registo', 'Custos de escritura e registo', 2000, 'purchase_fixed'),
    ],
    annualCostFields: [
      amt('condo', 'Condomínio', 'Despesas de condomínio', 500, 'annual_community'),
      amt('insurance', 'Seguro', 'Seguro multirriscos', 150, 'annual_insurance'),
      amt('maintenance', 'Manutenção', 'Manutenção anual', 500, 'annual_maintenance'),
    ],
    rentalTaxFields: [
      pct('rental_tax', 'Taxa efetiva rendimento', 'Hipótese editável', 0, 'rental_tax_rate', 'profit'),
    ],
  },
  it: {
    mode: 'simple',
    requiresRegionSelection: false,
    disclaimer: 'Fiscalità orientativa. Le aliquote dipendono da tipologia e situazione personale.',
    purchaseTaxFields: [
      pct('registration', 'Imposta di registro', 'Seconda mano', 9, 'transfer_tax'),
      pct('cadastral', 'Imposta catastale', 'Imposta catastale', 1, 'purchase_tax_extra'),
      pct('mortgage_tax', 'Imposta ipotecaria', 'Se con mutuo', 2, 'purchase_tax_extra'),
      pct('vat', 'IVA', 'Se prima casa/obra nueva', 10, 'transfer_tax'),
      amt('notary', 'Notaio', 'Spese notarili', 3000, 'purchase_fixed'),
    ],
    annualCostFields: [
      amt('condo', 'Spese condominiali', 'Condominio annuo', 700, 'annual_community'),
      amt('insurance', 'Assicurazione', 'Assicurazione annua', 200, 'annual_insurance'),
      amt('maintenance', 'Manutenzione', 'Manutenzione annua', 650, 'annual_maintenance'),
    ],
    rentalTaxFields: [
      pct('rental_tax', 'Aliquota fiscale effettiva', 'Ipotesi semplificata', 0, 'rental_tax_rate', 'profit'),
    ],
  },
  uk: {
    mode: 'regional',
    requiresRegionSelection: false,
    disclaimer: 'Stamp duty and tax treatment depend on property value, buyer status, location and personal circumstances.',
    purchaseTaxFields: [
      pct('sdlt', 'Stamp Duty Land Tax', 'Editable effective rate on purchase', 5, 'transfer_tax'),
      pct('sdlt_surcharge', 'Additional property surcharge', 'Second home / BTL surcharge', 3, 'purchase_tax_extra'),
      amt('legal', 'Legal fees', 'Solicitor / conveyancing', 1500, 'purchase_fixed'),
      amt('survey', 'Survey fees', 'Building survey', 600, 'purchase_fixed'),
      amt('mortgage_fee', 'Mortgage arrangement fees', 'Lender fees', 1000, 'purchase_fixed'),
    ],
    annualCostFields: [
      amt('council_tax', 'Council tax (landlord)', 'If applicable', 0, 'annual_property'),
      amt('service_charge', 'Service charge', 'Leasehold service charge', 1200, 'annual_community'),
      amt('ground_rent', 'Ground rent', 'If leasehold', 200, 'annual_other'),
      amt('insurance', 'Insurance', 'Landlord insurance', 250, 'annual_insurance'),
      amt('maintenance', 'Maintenance', 'Repairs allowance', 800, 'annual_maintenance'),
    ],
    rentalTaxFields: [
      pct('rental_tax', 'Effective tax on rental profit', 'Simplified editable rate', 0, 'rental_tax_rate', 'profit'),
    ],
  },
  us: {
    mode: 'state_based',
    requiresRegionSelection: true,
    regionLabel: 'State',
    disclaimer: 'Property taxes, transfer taxes, insurance and landlord rules vary by state, county and municipality.',
    purchaseTaxFields: [
      pct('closing', 'Closing costs', 'Effective % of purchase price', 2, 'transfer_tax'),
      pct('transfer_tax', 'Transfer tax', 'State/local transfer tax', 0.5, 'purchase_tax_extra'),
      amt('closing_fixed', 'Closing costs (fixed)', 'Fixed closing items', 3000, 'purchase_fixed'),
    ],
    annualCostFields: [
      amt('property_tax', 'Property tax (annual)', 'Annual property tax amount', 3500, 'annual_property'),
      amt('hoa', 'HOA', 'Homeowners association', 600, 'annual_community'),
      amt('insurance', 'Insurance', 'Landlord insurance', 1200, 'annual_insurance'),
      amt('maintenance', 'Repairs and maintenance', 'Annual maintenance', 1500, 'annual_maintenance'),
      pct('management', 'Property management', '% of rent', 8, 'annual_other'),
    ],
    rentalTaxFields: [
      pct('rental_tax', 'Effective tax on rental profit', 'Editable simplified rate', 0, 'rental_tax_rate', 'profit'),
    ],
  },
  mx: {
    mode: 'state_based',
    requiresRegionSelection: true,
    regionLabel: 'Estado (opcional)',
    disclaimer: 'Los costes notariales, impuestos y reglas fiscales pueden variar por estado y situación personal.',
    purchaseTaxFields: [
      pct('isai', 'ISAI / adquisición', 'Impuesto adquisición editable', 2, 'transfer_tax'),
      amt('notary', 'Notaría', 'Honorarios notariales', 35000, 'purchase_fixed'),
      amt('registry', 'Registro', 'Inscripción registral', 8000, 'purchase_fixed'),
      amt('appraisal', 'Avalúo', 'Coste avalúo', 5000, 'purchase_fixed'),
    ],
    annualCostFields: [
      amt('predial', 'Predial', 'Impuesto predial anual', 2500, 'annual_property'),
      amt('maintenance_fee', 'Cuota mantenimiento', 'Mantenimiento condominio', 6000, 'annual_community'),
      amt('insurance', 'Seguro', 'Seguro anual', 3500, 'annual_insurance'),
      amt('maintenance', 'Mantenimiento', 'Mantenimiento anual', 8000, 'annual_maintenance'),
    ],
    rentalTaxFields: [
      pct('rental_tax', 'Tipo efectivo impuestos alquiler', 'Hipótesis orientativa', 0, 'rental_tax_rate', 'profit'),
    ],
  },
  au: {
    mode: 'state_based',
    requiresRegionSelection: true,
    regionLabel: 'State / territory',
    disclaimer: 'Stamp duty, land tax and rental rules vary by state or territory.',
    purchaseTaxFields: [
      pct('stamp_duty', 'Stamp duty', 'Effective rate — varies by state', 4, 'transfer_tax'),
      amt('conveyancing', 'Conveyancing', 'Legal/conveyancing fees', 2000, 'purchase_fixed'),
      amt('inspection', 'Building and pest inspection', 'Pre-purchase inspection', 600, 'purchase_fixed'),
    ],
    annualCostFields: [
      amt('council_rates', 'Council rates', 'Annual council rates', 2200, 'annual_property'),
      amt('strata', 'Strata / body corporate', 'Body corporate fees', 3500, 'annual_community'),
      amt('insurance', 'Landlord insurance', 'Insurance annual', 900, 'annual_insurance'),
      amt('maintenance', 'Repairs and maintenance', 'Maintenance allowance', 1200, 'annual_maintenance'),
      pct('management', 'Property management', '% of rent', 7, 'annual_other'),
    ],
    rentalTaxFields: [
      pct('rental_tax', 'Effective tax on rental profit', 'Simplified editable rate', 0, 'rental_tax_rate', 'profit'),
    ],
  },
  ie: {
    mode: 'simple',
    requiresRegionSelection: false,
    disclaimer: 'Tax treatment is indicative and depends on personal circumstances and property type.',
    purchaseTaxFields: [
      pct('stamp_duty', 'Stamp duty', 'Editable effective rate', 1, 'transfer_tax'),
      amt('solicitor', 'Solicitor fees', 'Legal fees', 2500, 'purchase_fixed'),
      amt('survey', 'Valuation / survey', 'Survey costs', 500, 'purchase_fixed'),
    ],
    annualCostFields: [
      amt('lpt', 'Local Property Tax', 'Annual LPT', 400, 'annual_property'),
      amt('management', 'Management fees', 'Property management', 0, 'annual_other'),
      amt('insurance', 'Insurance', 'Landlord insurance', 300, 'annual_insurance'),
      amt('maintenance', 'Maintenance', 'Annual maintenance', 700, 'annual_maintenance'),
    ],
    rentalTaxFields: [
      pct('rental_tax', 'Effective tax on rental profit', 'Editable simplified rate', 0, 'rental_tax_rate', 'profit'),
    ],
  },
};
