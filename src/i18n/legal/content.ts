import type { MarketConfig, MarketSlug } from '@/config/types';
import { LEGAL_ENTITY } from '@/config/legalEntity';
import type { LegalDocument, LegalPageKind, LegalSection, MarketLegalPages } from './types';

const LAST_UPDATED: Record<MarketConfig['language'], string> = {
  es: 'Última actualización: 11 de junio de 2025',
  en: 'Last updated: 11 June 2025',
  pt: 'Última atualização: 11 de junho de 2025',
  it: 'Ultimo aggiornamento: 11 giugno 2025',
};

function updated(lang: MarketConfig['language']): string {
  return LAST_UPDATED[lang];
}

const { companyName, privacyEmail, legalEmail } = LEGAL_ENTITY;

type Jurisdiction = MarketSlug;

function authorityBlock(j: Jurisdiction): LegalSection {
  const blocks: Record<Jurisdiction, LegalSection> = {
    es: {
      id: 'authority',
      title: 'Autoridad de control y ley aplicable',
      paragraphs: [
        'El tratamiento de datos personales se ajusta al Reglamento (UE) 2016/679 (RGPD) y a la Ley Orgánica 3/2018 (LOPDGDD).',
        'Puede presentar reclamación ante la Agencia Española de Protección de Datos (AEPD): www.aepd.es.',
      ],
    },
    pt: {
      id: 'authority',
      title: 'Autoridade de controlo e lei aplicável',
      paragraphs: [
        'O tratamento de dados pessoais cumpre o Regulamento (UE) 2016/679 (RGPD) e a Lei n.º 58/2019.',
        'Pode apresentar reclamação à Comissão Nacional de Proteção de Dados (CNPD): www.cnpd.pt.',
      ],
    },
    it: {
      id: 'authority',
      title: 'Autorità di controllo e legge applicabile',
      paragraphs: [
        'Il trattamento dei dati personali è conforme al Regolamento (UE) 2016/679 (GDPR) e al D.lgs. 196/2003 come modificato.',
        'Può presentare reclamo al Garante per la protezione dei dati personali: www.garanteprivacy.it.',
      ],
    },
    ie: {
      id: 'authority',
      title: 'Supervisory authority and applicable law',
      paragraphs: [
        'Personal data is processed in accordance with Regulation (EU) 2016/679 (GDPR) and the Data Protection Act 2018 (Ireland).',
        'You may lodge a complaint with the Data Protection Commission (DPC): www.dataprotection.ie.',
      ],
    },
    uk: {
      id: 'authority',
      title: 'Supervisory authority and applicable law',
      paragraphs: [
        'Personal data is processed in accordance with UK GDPR and the Data Protection Act 2018.',
        'You may lodge a complaint with the Information Commissioner\'s Office (ICO): www.ico.org.uk.',
      ],
    },
    us: {
      id: 'authority',
      title: 'Applicable law and US residents',
      paragraphs: [
        'This notice is provided for transparency. US privacy law varies by state.',
        'California residents may have additional rights under the CCPA/CPRA (access, deletion, opt-out of sale/sharing where applicable). We do not sell personal information.',
        'To exercise rights, contact us at the email below. We will respond within the timeframes required by applicable state law.',
      ],
    },
    mx: {
      id: 'authority',
      title: 'Autoridad y ley aplicable (México)',
      paragraphs: [
        'El tratamiento de datos se realiza conforme a la Ley Federal de Protección de Datos Personales en Posesión de los Particulares (LFPDPPP) y su Reglamento.',
        'Puede ejercer derechos ARCO (Acceso, Rectificación, Cancelación y Oposición) contactándonos. También puede acudir al INAI: www.inai.org.mx.',
      ],
    },
    au: {
      id: 'authority',
      title: 'Applicable law and complaints (Australia)',
      paragraphs: [
        'We handle personal information in accordance with the Privacy Act 1988 (Cth) and the Australian Privacy Principles (APPs).',
        'You may lodge a complaint with the Office of the Australian Information Commissioner (OAIC): www.oaic.gov.au.',
      ],
    },
  };
  return blocks[j];
}

function rightsSectionEs(j: Jurisdiction): LegalSection {
  const base: LegalSection = {
    id: 'rights',
    title: j === 'mx' ? 'Derechos ARCO y otros derechos' : 'Tus derechos',
    paragraphs: [
      `Para ejercer tus derechos, escribe a ${privacyEmail} indicando el mercado (${j}) y tu solicitud. Responderemos en el plazo legal aplicable.`,
    ],
    listItems:
      j === 'mx'
        ? [
            'Acceso: saber qué datos tratamos sobre ti.',
            'Rectificación: corregir datos inexactos.',
            'Cancelación/supresión: solicitar el borrado cuando proceda.',
            'Oposición: oponerte a ciertos tratamientos.',
            'Portabilidad (cuando aplique RGPD en transferencias transfronterizas).',
          ]
        : [
            'Acceso, rectificación y supresión.',
            'Limitación u oposición al tratamiento.',
            'Portabilidad de los datos facilitados.',
            'Retirar el consentimiento en cualquier momento (sin afectar a tratamientos previos lícitos).',
            'Presentar reclamación ante la autoridad de control indicada arriba.',
          ],
  };
  return base;
}

function rightsSectionEn(j: Jurisdiction): LegalSection {
  if (j === 'us') {
    return {
      id: 'rights',
      title: 'Your privacy rights',
      paragraphs: [`Contact ${privacyEmail} to request access, correction or deletion of your personal information.`],
      listItems: [
        'Know what personal information we collect and how it is used.',
        'Request deletion of information we hold about you (subject to legal exceptions).',
        'Correct inaccurate information.',
        'Non-discrimination for exercising your rights.',
      ],
    };
  }
  return {
    id: 'rights',
    title: 'Your rights',
    paragraphs: [`To exercise your rights, email ${privacyEmail} with your request and market (${j}). We will respond within applicable legal timeframes.`],
    listItems: [
      'Access, rectification and erasure.',
      'Restriction or objection to processing.',
      'Data portability (where applicable).',
      'Withdraw consent at any time.',
      'Lodge a complaint with the supervisory authority listed above.',
    ],
  };
}

function rightsSectionPt(): LegalSection {
  return {
    id: 'rights',
    title: 'Os seus direitos',
    paragraphs: [`Para exercer os seus direitos, contacte ${privacyEmail} indicando o mercado e o pedido.`],
    listItems: [
      'Acesso, retificação e apagamento.',
      'Limitação ou oposição ao tratamento.',
      'Portabilidade dos dados.',
      'Retirar o consentimento a qualquer momento.',
      'Apresentar reclamação à CNPD.',
    ],
  };
}

function rightsSectionIt(): LegalSection {
  return {
    id: 'rights',
    title: 'I tuoi diritti',
    paragraphs: [`Per esercitare i tuoi diritti, scrivi a ${privacyEmail} indicando il mercado e la richiesta.`],
    listItems: [
      'Accesso, rettifica e cancellazione.',
      'Limitazione o opposizione al trattamento.',
      'Portabilità dei dati.',
      'Revocare il consenso in qualsiasi momento.',
      'Proporre reclamo al Garante Privacy.',
    ],
  };
}

function buildLegalEs(market: MarketConfig): LegalDocument {
  return {
    title: `Aviso legal — ${market.nativeName}`,
    lastUpdated: updated('es'),
    sections: [
      {
        id: 'operator',
        title: '1. Titular del servicio',
        paragraphs: [
          `Denominación: ${companyName}. Contacto legal: ${legalEmail}.`,
          `Este sitio web ofrece herramientas de simulación y análisis orientativo de inversiones en alquiler para el mercado ${market.nativeName} (${market.slug}).`,
          'Antes de operar comercialmente, complete aquí la razón social, NIF/CIF, domicilio y datos registrales de la entidad titular.',
        ],
      },
      {
        id: 'service',
        title: '2. Objeto y naturaleza del servicio',
        paragraphs: [
          `${companyName} es una plataforma informativa y de cálculo. Los resultados (rentabilidad, cashflow, TIR, etc.) son estimaciones basadas en hipótesis introducidas por el usuario o valores por defecto editables.`,
          'No somos una entidad de asesoramiento financiero, fiscal, jurídico ni agencia inmobiliaria. No intermediamos operaciones ni recomendamos la compra o venta de inmuebles concretos.',
        ],
      },
      {
        id: 'disclaimers',
        title: '3. Limitaciones y exención de responsabilidad',
        paragraphs: [market.legal.disclaimer, market.legal.noAdviceNotice, market.legal.dataNotice],
        listItems: [
          'Los impuestos, tipos hipotecarios y gastos mostrados son orientativos y pueden no reflejar tu situación real.',
          'La deducción de intereses de hipoteca solo se modela donde la normativa del mercado lo permite*.',
          'Radar (cuando esté disponible) puede usar datos de ejemplo o fuentes autorizadas; no garantizamos disponibilidad, exactitud ni actualización de anuncios de terceros.',
          'No garantizamos rentabilidades ni resultados de inversión.',
        ],
      },
      {
        id: 'user',
        title: '4. Uso permitido',
        paragraphs: [
          'El usuario se compromete a utilizar el sitio de forma lícita, sin intentar vulnerar medidas de seguridad, extraer datos masivamente ni suplantar identidades.',
          'Queda prohibido reproducir, distribuir o crear obras derivadas del software o contenidos sin autorización expresa.',
        ],
      },
      {
        id: 'payments',
        title: '5. Pagos y suscripciones',
        paragraphs: [
          'Los pagos del Informe PRO y futuras suscripciones Radar se procesan mediante Stripe, Inc. Las condiciones comerciales (precio, moneda, alcance) se muestran antes del checkout.',
          'Salvo indicación contraria en el momento de la compra, el Informe PRO es un pago único por escenario/inmueble analizado.',
        ],
      },
      {
        id: 'ip',
        title: '6. Propiedad intelectual',
        paragraphs: [
          `Los contenidos, diseño, código, marcas y metodología de cálculo de ${companyName} están protegidos por la normativa de propiedad intelectual e industrial.`,
        ],
      },
      {
        id: 'third',
        title: '7. Enlaces y servicios de terceros',
        paragraphs: [
          'Podemos enlazar a sitios de terceros (p. ej. Stripe Checkout). No somos responsables de sus contenidos ni políticas.',
          'Netlify aloja el sitio y procesa formularios de lista de espera según su propia infraestructura.',
        ],
      },
      {
        id: 'changes',
        title: '8. Modificaciones',
        paragraphs: [
          'Podemos actualizar este aviso legal. La fecha de revisión aparece al inicio. El uso continuado del sitio tras cambios relevantes implica la aceptación de la versión publicada.',
        ],
      },
      {
        id: 'law',
        title: '9. Legislación y jurisdicción',
        paragraphs: [
          market.slug === 'mx'
            ? 'Salvo norma imperativa en contrario, cualquier controversia se someterá a los tribunales competentes en México, sin perjuicio de derechos irrenunciables del consumidor.'
            : market.slug === 'es'
              ? 'Salvo norma imperativa en contrario, cualquier controversia se someterá a los tribunales competentes en España.'
              : `Este aviso se redacta para usuarios del mercado ${market.nativeName}. Consulte también la normativa local aplicable.`,
        ],
      },
    ],
  };
}

function buildLegalEn(market: MarketConfig): LegalDocument {
  return {
    title: `Legal notice — ${market.nativeName}`,
    lastUpdated: updated('en'),
    sections: [
      {
        id: 'operator',
        title: '1. Service operator',
        paragraphs: [
          `Name: ${companyName}. Legal contact: ${legalEmail}.`,
          `This website provides rental investment simulation and indicative analysis tools for the ${market.nativeName} market (${market.slug}).`,
          'Before going live, insert your registered company name, company number, registered address and applicable registration details here.',
        ],
      },
      {
        id: 'service',
        title: '2. Nature of the service',
        paragraphs: [
          `${companyName} is an informational and calculation platform. Results (yield, cash flow, IRR, etc.) are estimates based on user inputs or editable defaults.`,
          'We are not a financial, tax or legal adviser, estate agent or broker. We do not arrange transactions or recommend specific properties.',
        ],
      },
      {
        id: 'disclaimers',
        title: '3. Limitations and liability',
        paragraphs: [market.legal.disclaimer, market.legal.noAdviceNotice, market.legal.dataNotice],
        listItems: [
          'Tax, mortgage and cost figures are indicative and may not reflect your actual situation.',
          'Mortgage interest deduction is modelled only where local tax rules allow it*.',
          'Radar (when available) may use sample or authorized data; we do not guarantee third-party listing accuracy or availability.',
          'We do not guarantee investment returns or outcomes.',
        ],
      },
      {
        id: 'user',
        title: '4. Acceptable use',
        paragraphs: [
          'You agree to use the site lawfully, without attempting to breach security, scrape data at scale or impersonate others.',
          'You may not copy, distribute or create derivative works from our software or content without permission.',
        ],
      },
      {
        id: 'payments',
        title: '5. Payments and subscriptions',
        paragraphs: [
          'PRO Report and future Radar subscriptions are processed by Stripe, Inc. Price, currency and scope are shown before checkout.',
          'Unless stated otherwise at purchase, the PRO Report is a one-off payment per property/scenario analysed.',
        ],
      },
      {
        id: 'ip',
        title: '6. Intellectual property',
        paragraphs: [`Content, design, code, branding and calculation methodology of ${companyName} are protected by applicable IP laws.`],
      },
      {
        id: 'third',
        title: '7. Third-party links and services',
        paragraphs: [
          'We may link to third-party sites (e.g. Stripe Checkout). We are not responsible for their content or policies.',
          'Netlify hosts the site and processes waitlist forms on its infrastructure.',
        ],
      },
      {
        id: 'changes',
        title: '8. Changes',
        paragraphs: [
          'We may update this legal notice. The revision date is shown at the top. Continued use after material changes constitutes acceptance of the published version.',
        ],
      },
      {
        id: 'law',
        title: '9. Governing law',
        paragraphs: [
          market.slug === 'uk'
            ? 'This notice is governed by the laws of England and Wales, subject to mandatory consumer protections.'
            : market.slug === 'au'
              ? 'This notice is governed by the laws of Australia, subject to mandatory consumer protections.'
              : market.slug === 'us'
                ? 'This notice is governed by the laws applicable in the United States state where the operator is established, without regard to conflict-of-law rules, subject to mandatory consumer protections in your state of residence.'
                : market.slug === 'ie'
                  ? 'This notice is governed by the laws of Ireland, subject to mandatory consumer protections.'
                  : `This notice is addressed to users in ${market.nativeName}. Local mandatory consumer laws may also apply.`,
        ],
      },
    ],
  };
}

function buildLegalPt(market: MarketConfig): LegalDocument {
  const doc = buildLegalEs(market);
  return {
    ...doc,
    title: `Aviso legal — ${market.nativeName}`,
    lastUpdated: updated('pt'),
    sections: doc.sections.map((s) => {
      const map: Record<string, Partial<LegalSection>> = {
        operator: {
          title: '1. Titular do serviço',
          paragraphs: [
            `Denominação: ${companyName}. Contacto legal: ${legalEmail}.`,
            `Este site disponibiliza ferramentas de simulação e análise orientativa de investimento em arrendamento para o mercado ${market.nativeName}.`,
            'Antes de produção, complete aqui a razão social, NIF, sede e dados registrais.',
          ],
        },
        service: {
          title: '2. Objeto e natureza do serviço',
          paragraphs: [
            `${companyName} é uma plataforma informativa e de cálculo. Os resultados são estimativas baseadas em hipóteses do utilizador.`,
            'Não somos consultores financeiros, fiscais ou jurídicos, nem agência imobiliária.',
          ],
        },
        disclaimers: { title: '3. Limitações e responsabilidade' },
        user: { title: '4. Utilização permitida' },
        payments: { title: '5. Pagamentos e subscrições' },
        ip: { title: '6. Propriedade intelectual' },
        third: { title: '7. Ligações e serviços de terceiros' },
        changes: { title: '8. Alterações' },
        law: {
          title: '9. Lei aplicável',
          paragraphs: ['Salvo disposição legal imperativa em contrário, qualquer litígio será submetido aos tribunais competentes em Portugal.'],
        },
      };
      return map[s.id] ? { ...s, ...map[s.id] } : s;
    }),
  };
}

function buildLegalIt(market: MarketConfig): LegalDocument {
  const doc = buildLegalEs(market);
  return {
    ...doc,
    title: `Note legali — ${market.nativeName}`,
    lastUpdated: updated('it'),
    sections: doc.sections.map((s) => {
      const map: Record<string, Partial<LegalSection>> = {
        operator: {
          title: '1. Titolare del servizio',
          paragraphs: [
            `Denominazione: ${companyName}. Contatto legale: ${legalEmail}.`,
            `Questo sito offre strumenti di simulazione e analisi orientativa per il mercato ${market.nativeName}.`,
            'Prima del go-live, inserire ragione sociale, P. IVA, sede e dati registrali.',
          ],
        },
        service: {
          title: '2. Natura del servizio',
          paragraphs: [
            `${companyName} è una piattaforma informativa e di calcolo. I risultati sono stime basate su ipotesi dell\'utente.`,
            'Non siamo consulenti finanziari, fiscali o legali, né agenzia immobiliare.',
          ],
        },
        disclaimers: { title: '3. Limitazioni di responsabilità' },
        law: {
          title: '9. Legge applicabile',
          paragraphs: ['Salvo norme imperative, ogni controversia sarà devoluta al foro competente in Italia.'],
        },
      };
      return map[s.id] ? { ...s, ...map[s.id] } : s;
    }),
  };
}

function buildPrivacy(market: MarketConfig): LegalDocument {
  const j = market.slug;
  const lang = market.language;

  const titles: Record<MarketConfig['language'], string> = {
    es: `Política de privacidad — ${market.nativeName}`,
    en: `Privacy policy — ${market.nativeName}`,
    pt: `Política de privacidade — ${market.nativeName}`,
    it: `Informativa sulla privacy — ${market.nativeName}`,
  };

  const controller: LegalSection = {
    id: 'controller',
    title: lang === 'en' ? '1. Data controller' : lang === 'pt' ? '1. Responsável pelo tratamento' : lang === 'it' ? '1. Titolare del trattamento' : '1. Responsable del tratamiento',
    paragraphs: [
      lang === 'en'
        ? `${companyName} is responsible for personal data collected through this site for the ${market.nativeName} market. Contact: ${privacyEmail}.`
        : lang === 'pt'
          ? `${companyName} é responsável pelo tratamento dos dados pessoais recolhidos neste site para o mercado ${market.nativeName}. Contacto: ${privacyEmail}.`
          : lang === 'it'
            ? `${companyName} è responsabile del trattamento dei dati personali raccolti su questo sito per il mercato ${market.nativeName}. Contatto: ${privacyEmail}.`
            : `${companyName} es responsable del tratamiento de los datos personales recogidos a través de este sitio para el mercado ${market.nativeName}. Contacto: ${privacyEmail}.`,
    ],
  };

  const dataCollected: LegalSection = {
    id: 'data',
    title: lang === 'en' ? '2. What data we collect' : lang === 'pt' ? '2. Dados que recolhemos' : lang === 'it' ? '2. Dati che raccogliamo' : '2. Datos que recogemos',
    paragraphs:
      lang === 'en'
        ? ['We minimise data collection. Depending on how you use BrickSignal:']
        : lang === 'pt'
          ? ['Minimizamos a recolha de dados. Consoante a utilização:']
          : lang === 'it'
            ? ['Raccogliamo il minimo indispensabile. A seconda dell\'uso:']
            : ['Minimizamos la recogida de datos. Según cómo uses BrickSignal:'],
    listItems:
      lang === 'en'
        ? [
            'Simulator: inputs stay mainly in your browser (localStorage). We do not receive them unless you choose to submit a form or checkout.',
            'Waitlist (Radar): email, market, language and consent — via Netlify Forms.',
            'PRO Report purchase: payment data is processed by Stripe; we may receive transaction identifiers, email and market metadata from Stripe.',
            'Technical logs: hosting provider may record IP address, user agent and timestamps for security and operation (Netlify).',
            'Analytics: if enabled, we may use privacy-friendly analytics (e.g. Plausible) without advertising profiles.',
          ]
        : [
            'Simulador: los datos introducidos se guardan principalmente en tu navegador (localStorage). No los recibimos salvo que envíes un formulario o pagues.',
            'Lista de espera (Radar): email, mercado, idioma y consentimiento — vía Netlify Forms.',
            'Compra Informe PRO: Stripe procesa el pago; podemos recibir identificadores de transacción, email y metadatos del mercado.',
            'Registros técnicos: el hosting puede registrar IP, agente de usuario y marcas de tiempo (Netlify).',
            'Analítica: si está activa, podemos usar analítica respetuosa con la privacidad (p. ej. Plausible), sin perfiles publicitarios.',
          ],
  };

  const purposes: LegalSection = {
    id: 'purposes',
    title: lang === 'en' ? '3. Purposes and legal bases' : lang === 'pt' ? '3. Finalidades e bases legais' : lang === 'it' ? '3. Finalità e basi giuridiche' : '3. Finalidades y bases legales',
    paragraphs: [
      lang === 'en'
        ? 'We process personal data for the following purposes:'
        : lang === 'pt'
          ? 'Tratamos dados pessoais para as seguintes finalidades:'
          : lang === 'it'
            ? 'Trattiamo i dati personali per le seguenti finalità:'
            : 'Tratamos datos personales para las siguientes finalidades:',
    ],
    listItems:
      lang === 'en'
        ? [
            'Provide the simulator and PRO Report (performance of contract / steps prior to contract).',
            'Process waitlist sign-ups (consent).',
            'Process payments via Stripe (contract / legal obligation).',
            'Improve security and service (legitimate interest).',
            'Comply with legal obligations.',
          ]
        : [
            'Prestar el simulador e Informe PRO (ejecución de contrato / medidas precontractuales).',
            'Gestionar la lista de espera (consentimiento).',
            'Procesar pagos con Stripe (contrato / obligación legal).',
            'Seguridad y mejora del servicio (interés legítimo).',
            'Cumplir obligaciones legales.',
          ],
  };

  const processors: LegalSection = {
    id: 'processors',
    title: lang === 'en' ? '4. Processors and transfers' : lang === 'pt' ? '4. Subcontratantes e transferências' : lang === 'it' ? '4. Responsabili del trattamento e trasferimenti' : '4. Encargados y transferencias',
    paragraphs:
      lang === 'en'
        ? [
            'We use trusted providers that process data on our behalf:',
            'Stripe (payments), Netlify (hosting and forms). They may process data outside your country with appropriate safeguards (Standard Contractual Clauses or equivalent).',
          ]
        : [
            'Utilizamos proveedores de confianza:',
            'Stripe (pagos), Netlify (hosting y formularios). Pueden tratar datos fuera de tu país con garantías adecuadas (cláusulas contractuales tipo u equivalentes).',
          ],
    listItems: ['Stripe — stripe.com/privacy', 'Netlify — netlify.com/privacy'],
  };

  const retention: LegalSection = {
    id: 'retention',
    title: lang === 'en' ? '5. Retention' : lang === 'pt' ? '5. Conservação' : lang === 'it' ? '5. Conservazione' : '5. Conservación',
    paragraphs:
      lang === 'en'
        ? [
            'Waitlist data: until launch communication ends or you withdraw consent, then deleted or anonymised within a reasonable period.',
            'Payment records: retained as required by tax and accounting law (typically 4–10 years depending on jurisdiction).',
            'localStorage on your device: until you clear browser data or use reset controls in the app.',
          ]
        : [
            'Lista de espera: hasta fin de comunicaciones de lanzamiento o retirada del consentimiento; después eliminación o anonimización razonable.',
            'Registros de pago: según obligaciones fiscales y contables (habitualmente 4–10 años según jurisdicción).',
            'localStorage: hasta que borres datos del navegador o uses restablecer en la app.',
          ],
  };

  const rights =
    lang === 'pt' ? rightsSectionPt() : lang === 'it' ? rightsSectionIt() : lang === 'en' ? rightsSectionEn(j) : rightsSectionEs(j);

  const children: LegalSection = {
    id: 'children',
    title: lang === 'en' ? '6. Children' : lang === 'pt' ? '6. Menores' : lang === 'it' ? '6. Minori' : '6. Menores',
    paragraphs:
      lang === 'en'
        ? ['The service is not directed at children under 16 (or 13 in the US). We do not knowingly collect their data.']
        : ['El servicio no está dirigido a menores de 16 años (o 13 en EE. UU.). No recogemos sus datos de forma consciente.'],
  };

  const security: LegalSection = {
    id: 'security',
    title: lang === 'en' ? '7. Security' : lang === 'pt' ? '7. Segurança' : lang === 'it' ? '7. Sicurezza' : '7. Seguridad',
    paragraphs:
      lang === 'en'
        ? ['We apply reasonable technical and organisational measures. No method of transmission over the Internet is 100% secure.']
        : ['Aplicamos medidas técnicas y organizativas razonables. Ningún sistema es 100 % seguro.'],
  };

  const changes: LegalSection = {
    id: 'changes',
    title: lang === 'en' ? '8. Changes to this policy' : lang === 'pt' ? '8. Alterações' : lang === 'it' ? '8. Modifiche' : '8. Cambios',
    paragraphs:
      lang === 'en'
        ? ['We may update this policy. Material changes will be reflected by updating the date above.']
        : ['Podemos actualizar esta política. Los cambios relevantes se reflejarán actualizando la fecha indicada.'],
  };

  return {
    title: titles[lang],
    lastUpdated: updated(lang),
    sections: [controller, dataCollected, purposes, processors, retention, rights, authorityBlock(j), children, security, changes],
  };
}

function buildCookies(market: MarketConfig): LegalDocument {
  const lang = market.language;
  const titles: Record<MarketConfig['language'], string> = {
    es: `Política de cookies — ${market.nativeName}`,
    en: `Cookie policy — ${market.nativeName}`,
    pt: `Política de cookies — ${market.nativeName}`,
    it: `Informativa sui cookie — ${market.nativeName}`,
  };

  const intro =
    lang === 'en'
      ? `${companyName} uses minimal storage technologies. This policy explains what we use on the ${market.nativeName} site.`
      : lang === 'pt'
        ? `${companyName} utiliza tecnologias de armazenamento mínimas. Esta política explica o que usamos no site ${market.nativeName}.`
        : lang === 'it'
          ? `${companyName} utilizza tecnologie di archiviazione minime. Questa informativa spiega cosa usiamo sul sito ${market.nativeName}.`
          : `${companyName} utiliza tecnologías de almacenamiento mínimas. Esta política explica qué usamos en el sitio ${market.nativeName}.`;

  return {
    title: titles[lang],
    lastUpdated: updated(lang),
    subtitle: intro,
    sections: [
      {
        id: 'what',
        title: lang === 'en' ? '1. What are cookies and similar technologies?' : lang === 'pt' ? '1. O que são cookies?' : lang === 'it' ? '1. Cosa sono i cookie?' : '1. ¿Qué son las cookies?',
        paragraphs:
          lang === 'en'
            ? [
                'Cookies are small files stored on your device. We also use localStorage/sessionStorage, which work similarly but are not always classified as cookies.',
              ]
            : [
                'Las cookies son pequeños archivos en tu dispositivo. También usamos localStorage/sessionStorage, con funcionamiento similar.',
              ],
      },
      {
        id: 'strict',
        title: lang === 'en' ? '2. Strictly necessary storage' : lang === 'pt' ? '2. Armazenamento estritamente necessário' : lang === 'it' ? '2. Archiviazione strettamente necessaria' : '2. Almacenamiento estrictamente necesario',
        paragraphs:
          lang === 'en'
            ? ['Required for the site to function. No consent banner is required for these under ePrivacy exemptions for strictly necessary storage.']
            : ['Necesario para que el sitio funcione. No requiere consentimiento previo en la UE cuando es estrictamente necesario.'],
        listItems: [
          lang === 'en' ? 'Preferred market (bricksignal-preferred-market) — remembers your country selection.' : 'Mercado preferido (bricksignal-preferred-market) — recuerda tu país.',
          lang === 'en' ? 'Simulator scenario (bricksignal-scenario-{market}) — saves your inputs locally.' : 'Escenario del simulador (bricksignal-scenario-{market}) — guarda tus datos localmente.',
          lang === 'en' ? 'Geo check flag (session) — avoids repeated geolocation prompts in the same session.' : 'Comprobación geo (sesión) — evita repetir detección en la misma sesión.',
          lang === 'en' ? 'PRO access flags (local) — remembers unlocked preview state after verified payment.' : 'Flags de acceso PRO (local) — recuerda desbloqueo tras pago verificado.',
          lang === 'en' ? 'Cookie preference (bricksignal-cookie-consent) — stores your accept/necessary-only choice.' : 'Preferencia de cookies (bricksignal-cookie-consent) — guarda tu elección de aceptar o solo necesarias.',
        ],
      },
      {
        id: 'third',
        title: lang === 'en' ? '3. Third-party cookies' : lang === 'pt' ? '3. Cookies de terceiros' : lang === 'it' ? '3. Cookie di terze parti' : '3. Cookies de terceros',
        paragraphs:
          lang === 'en'
            ? ['When you pay via Stripe Checkout or interact with embedded Stripe elements, Stripe may set cookies necessary for fraud prevention and payment processing. See Stripe\'s cookie policy.']
            : ['Al pagar con Stripe Checkout, Stripe puede instalar cookies necesarias para el pago y prevención del fraude. Consulta la política de cookies de Stripe.'],
        listItems: ['Stripe — stripe.com/cookies-policy/legal'],
      },
      {
        id: 'analytics',
        title: lang === 'en' ? '4. Analytics' : lang === 'pt' ? '4. Analítica' : lang === 'it' ? '4. Analytics' : '4. Analítica',
        paragraphs:
          lang === 'en'
            ? [
                'We may use privacy-oriented analytics (e.g. Plausible) without cross-site advertising profiles. If we enable non-essential analytics, we will request consent where required.',
                'Currently we do not use advertising or social media tracking pixels.',
              ]
            : [
                'Podemos usar analítica orientada a la privacidad (p. ej. Plausible) sin perfiles publicitarios. Si activamos analítica no esencial, pediremos consentimiento cuando sea obligatorio.',
                'Actualmente no usamos píxeles publicitarios ni de redes sociales.',
              ],
      },
      {
        id: 'manage',
        title: lang === 'en' ? '5. How to manage or delete data' : lang === 'pt' ? '5. Como gerir ou eliminar' : lang === 'it' ? '5. Come gestire o eliminare' : '5. Cómo gestionar o eliminar',
        paragraphs:
          lang === 'en'
            ? [
                'Clear site data from your browser settings to remove localStorage.',
                'Use the market selector to change your preferred country.',
                'Use simulator reset controls to clear saved scenarios.',
              ]
            : [
                'Borra datos del sitio desde la configuración del navegador para eliminar localStorage.',
                'Usa el selector de mercado para cambiar país.',
                'Usa restablecer en el simulador para borrar escenarios guardados.',
              ],
      },
      {
        id: 'contact',
        title: lang === 'en' ? '6. Contact' : lang === 'pt' ? '6. Contacto' : lang === 'it' ? '6. Contatto' : '6. Contacto',
        paragraphs: [
          lang === 'en'
            ? `Questions about this policy: ${privacyEmail}.`
            : lang === 'pt'
              ? `Dúvidas sobre esta política: ${privacyEmail}.`
              : lang === 'it'
                ? `Domande su questa informativa: ${privacyEmail}.`
                : `Dudas sobre esta política: ${privacyEmail}.`,
        ],
      },
    ],
  };
}

function navLabels(lang: MarketConfig['language']): MarketLegalPages['nav'] {
  const labels: Record<MarketConfig['language'], MarketLegalPages['nav']> = {
    es: { legal: 'Aviso legal', privacy: 'Privacidad', cookies: 'Cookies' },
    en: { legal: 'Legal', privacy: 'Privacy', cookies: 'Cookies' },
    pt: { legal: 'Aviso legal', privacy: 'Privacidade', cookies: 'Cookies' },
    it: { legal: 'Note legali', privacy: 'Privacy', cookies: 'Cookie' },
  };
  return labels[lang];
}

export function getMarketLegalPages(market: MarketConfig): MarketLegalPages {
  const legalBuilders: Record<MarketConfig['language'], (m: MarketConfig) => LegalDocument> = {
    es: buildLegalEs,
    en: buildLegalEn,
    pt: buildLegalPt,
    it: buildLegalIt,
  };

  const buildLegal = legalBuilders[market.language];

  return {
    nav: navLabels(market.language),
    legal: buildLegal(market),
    privacy: buildPrivacy(market),
    cookies: buildCookies(market),
  };
}

export function getLegalDocument(market: MarketConfig, kind: LegalPageKind): LegalDocument {
  return getMarketLegalPages(market)[kind];
}
