# BrickSignal

Plataforma internacional de inversión inmobiliaria en alquiler. **8 mercados** desde una sola codebase: simulador, Informe Pro y Radar Pro (demo/waitlist). Configuración por país — sin hardcodear textos, divisas ni impuestos en componentes.

## Stack

- Astro + React + TypeScript
- Tailwind CSS
- Netlify (hosting + Functions)
- Vitest (tests de fórmulas y scoring)
- Zod (validación)
- Recharts, jsPDF
- Stripe Checkout (pago único + suscripción preparada)

## Instalación

```bash
npm install
cp .env.example .env
```

## Desarrollo local

```bash
npm run dev              # Astro en :4321
npx netlify dev          # Astro + Functions en :8888
```

## Scripts

| Script | Descripción |
|--------|-------------|
| `npm run dev` | Servidor de desarrollo (Astro :4321) |
| `npm run dev:netlify` | Astro + Functions (:8888) — usar para probar Stripe |
| `npm run build` | Build producción |
| `npm run test` | Tests Vitest |

## Despliegue en Netlify

El repo incluye `netlify.toml` (build, publish `dist`, functions, Node 20).

1. Sube el código a GitHub/GitLab/Bitbucket.
2. En [app.netlify.com](https://app.netlify.com) → **Add new site** → **Import from Git**.
3. Build: `npm run build` · Publish: `dist` · Functions: `netlify/functions` (auto).
4. En **Site configuration → Environment variables**, copia las variables de `.env.example` (mínimo para Informe PRO en ES: `STRIPE_SECRET_KEY`, `STRIPE_PRICE_REPORT_EUR`, `PUBLIC_SITE_URL`, `STRIPE_WEBHOOK_SECRET`).
5. Tras el primer deploy, pon `PUBLIC_SITE_URL` a la URL real (`https://tu-sitio.netlify.app`) y **redeploy**.
6. En Stripe → Webhooks → endpoint `https://tu-sitio.netlify.app/.netlify/functions/stripe-webhook` (eventos de checkout/suscripción).
7. Prueba el flujo en `/es/simulador` → desbloquear PRO → success con `session_id`.

**Importante:** `STRIPE_PRICE_REPORT_EUR` debe ser `price_...`, no `prod_...`. Con test keys (`sk_test_`) puedes probar en producción antes de pasar a live.

## Variables de entorno

| Variable | Descripción |
|----------|-------------|
| `STRIPE_SECRET_KEY` | Clave secreta Stripe |
| `STRIPE_PRICE_REPORT_EUR` | Price ID (`price_...`) del Informe Pro 14,90 € |
| `STRIPE_PRICE_ID_RADAR_BASIC` | Radar Basic 9 €/mes |
| `STRIPE_PRICE_ID_RADAR_PRO` | Radar Pro 19 €/mes |
| `STRIPE_PRICE_ID_RADAR_INVESTOR` | Radar Investor 39 €/mes |
| `STRIPE_WEBHOOK_SECRET` | Webhook Stripe (suscripciones) |
| `PUBLIC_SITE_URL` | URL pública del sitio |
| `ENABLE_RADAR_EARLY_ACCESS` | `true` para activar checkout suscripción (server) |
| `ENABLE_AUTHORIZED_LISTING_PROVIDER` | `true` solo con API autorizada configurada |

Feature flags en cliente: `src/lib/flags.ts`

```ts
ENABLE_RADAR_DEMO = true
ENABLE_RADAR_EARLY_ACCESS = false   // botón early access desactivado
ENABLE_SUPABASE_AUTH = false
ENABLE_AUTHORIZED_LISTING_PROVIDER = false
```

## Radar Pro — Activar demo

1. Visita `/radar` (landing) o `/radar/demo` (oportunidades mock).
2. `ENABLE_RADAR_DEMO=true` en `src/lib/flags.ts` (ya activo por defecto).
3. El **mock provider** (`src/lib/listings/providers/mockProvider.ts`) sirve datos ficticios — no provienen de portales.
4. Ajusta criterios y pulsa «Buscar oportunidades».
5. «Analizar en simulador» precarga el escenario en `localStorage` y abre `/simulador`.

## Arquitectura ListingProvider

```
src/lib/listings/
  ListingProvider.ts          # interfaz
  providers/
    mockProvider.ts           # demo (activo)
    manualProvider.ts         # localStorage usuario
    authorizedApiProvider.ts  # placeholder — lanza error si no configurado
  scoring.ts                  # scoreListing() reutiliza fórmulas del simulador
  simulatorBridge.ts          # Listing → SimulatorInput
```

### Conectar una API autorizada (futuro)

1. Implementar `authorizedApiProvider` con endpoints de tu partner/API con contrato.
2. **No** añadir scraping, Idealista ni extracción de HTML.
3. Activar `ENABLE_AUTHORIZED_LISTING_PROVIDER=true` en flags + env Netlify.
4. Persistir snapshots en Supabase (`docs/database-schema.md`).
5. Ejecutar jobs: `sync-authorized-listings`, `score-opportunities`, `send-radar-alerts`.

### Qué NO está permitido

- Scraping de Idealista u otros portales
- Extraer HTML, fotos o descripciones de anuncios sin autorización
- Robots/spiders contra portales externos
- Guardar contenido de portales sin licencia

Fuentes permitidas: entrada manual, mock demo, CSV admin autorizado, API oficial detrás de `ListingProvider`.

## Gratis vs PRO (freemium)

| Capa | Pregunta que responde | Qué incluye |
|------|----------------------|-------------|
| **Gratis** | ¿Merece la pena analizar esta operación? | 10 inputs simplificados, 5 métricas + semáforo, estimación rápida |
| **PRO** | ¿Cuánto podría ganar, qué riesgos tiene y cómo evoluciona el mercado? | TIR, DSCR, sensibilidad, proyecciones, PDF, checklist, **Market Pulse PRO** |

### Simulador gratuito (`src/components/basic/`)

- `BasicInvestmentSimulator`, `BasicInputPanel`, `BasicResultsSummary`, `BasicViabilityBadge`, `ProUpgradeCTA`
- Cálculos en `src/lib/calculations/basic.ts` — sin TIR, DSCR ni sensibilidad

### Informe PRO (`src/components/pro/`)

- Métricas avanzadas, desglose de gastos, hipoteca, proyección 10/20 años, escenario de venta
- Preview borrosa antes del pago (TIR, sensibilidad, Market Pulse, PDF)
- Desbloqueo solo tras verificar `session_id` en backend (`verify-checkout-session`)

### Estrategia de precios por mercado (`src/config/pricing.ts` → `MARKET_PRICE_TIERS`)

| País | Estrategia | Informe PRO | Radar (Basic / Pro / Investor) |
|------|------------|------------:|-------------------------------:|
| España | Competitivo bajo | 14,90 € | 9 / 19 / 39 € |
| Portugal | Escala/competitivo | 12,90 € | 9 / 19 / 39 € |
| Italia | Competitivo | 14,90 € | 12 / 24 / 49 € |
| UK | Competitivo premium | £19,90 | £14 / £29 / £59 |
| US | Competitivo agresivo | $19,90 | $19 / $39 / $79 |
| México | Escala | $199 MXN | $149 / $299 / $599 MXN |
| Australia | Competitivo premium | A$24,90 | A$29 / A$59 / A$99 |
| Irlanda | Competitivo premium | 19,90 € | 19 / 39 / 79 € |

Los Price IDs de Stripe se resuelven por divisa (`STRIPE_PRICE_REPORT_EUR`, `STRIPE_PRICE_RADAR_BASIC_GBP`, etc.). `PRICING_AB` queda reservado para experimentos futuros.

### Feature flags (`src/config/featureFlags.ts`)

```
ENABLE_PRO_REPORT = true
ENABLE_MARKET_PULSE_PRO = true
ENABLE_MARKET_PULSE_AUTO_UPDATE = false
ENABLE_PRO_PREVIEW_BLUR = true
ENABLE_DETAILED_FREE_SIMULATOR = false
```

## Market Pulse PRO

Lectura mensual de tendencias basada en JSON estático (v1 manual). Sin scraping.

| Archivo | Rol |
|---------|-----|
| `src/lib/marketPulse/types.ts` | Tipos |
| `src/lib/marketPulse/scoring.ts` | Score 0–100 + confianza |
| `src/lib/marketPulse/narrative.ts` | Narrativa por reglas (no IA externa) |
| `src/lib/marketPulse/sources.ts` | Catálogo de fuentes por mercado |
| `src/lib/marketPulse/loadMarketPulse.ts` | Carga el informe más reciente |
| `src/content/market-pulse/{market}/YYYY-MM.json` | Datos mensuales |

### Editar Market Pulse mensualmente

1. Copia el JSON del mes anterior: `src/content/market-pulse/es/2026-07.json`
2. Actualiza `period`, `publishedAt`, `validUntil` y `metrics` con datos de fuentes permitidas
3. Cita fuentes en `sources[]` con `accessType` correcto
4. Valida: `npx tsx scripts/validate-market-pulse.ts`

### Fuentes permitidas (España ejemplo)

- INE (IPV, hipotecas) — `public_report` / `official_api`
- MITMA/SERPAVI — referencia alquiler
- Banco de España — series financieras
- Registradores/Notariado — `manual_research` o informes públicos
- Idealista/Fotocasa — solo con API autorizada o licencia (`licensed_data`), **nunca scraping**

### Por qué no scraping

- Sin extracción de portales inmobiliarios ni copia de informes de terceros
- Sin afirmar integraciones que no existen
- Disclaimer obligatorio en cada informe Market Pulse

### Actualización automática (futuro)

- Script placeholder: `scripts/update-market-pulse-es.ts` (APIs oficiales, sin scraping)
- Netlify scheduled: `netlify/functions/update-market-pulse.ts` — **desactivada** (`ENABLE_MARKET_PULSE_AUTO_UPDATE=false`)
- Persistencia real requiere Supabase, GitHub Action o almacenamiento externo (Netlify Functions no escriben archivos en runtime)

### Limitaciones

Market Pulse PRO es orientativo. No predice rentabilidades ni recomienda compras. La confianza baja si faltan fuentes recientes.

## Stripe — Informe Pro (pago único)

Flujo: simulador gratuito → CTA PRO → `create-checkout-session` → `/{market}/success` → verificación backend → informe completo + PDF.

Precio según mercado (véase tabla arriba). Tarjeta test: `4242 4242 4242 4242`.

## Stripe — Suscripción Radar (preparado)

1. Crea Products/Prices recurrentes en Stripe (Basic 9 €, Pro 19 €, Investor 39 €).
2. Configura `STRIPE_PRICE_ID_RADAR_*`.
3. Activa early access:
   - Cliente: `ENABLE_RADAR_EARLY_ACCESS = true` en `src/lib/flags.ts`
   - Servidor: `ENABLE_RADAR_EARLY_ACCESS=true` en Netlify env
4. Endpoint: `/.netlify/functions/create-subscription-checkout-session`
5. Webhook: `/.netlify/functions/stripe-webhook` — registra eventos; **pendiente** conectar Supabase.

> **Importante:** No conceder acceso Radar solo con localStorage. La suscripción real debe validarse en backend contra `subscriptions` en Supabase.

## Waitlist Radar

Formulario Netlify en `/radar/waitlist` con email, zona, presupuesto, cashflow mínimo, estrategia y consentimiento.

## International markets

| Slug | País | Moneda | Locale |
|------|------|--------|--------|
| `/es` | España | EUR | es-ES |
| `/pt` | Portugal | EUR | pt-PT |
| `/it` | Italia | EUR | it-IT |
| `/uk` | Reino Unido (GB) | GBP | en-GB |
| `/us` | Estados Unidos | USD | en-US |
| `/mx` | México | MXN | es-MX |
| `/au` | Australia | AUD | en-AU |
| `/ie` | Irlanda | EUR | en-IE |

Rutas por mercado: `/{market}/`, `/{market}/simulador`, `/{market}/precios`, `/{market}/radar`, etc.

La home global `/` muestra selector de país (sin geolocalización invasiva).

### Añadir un nuevo país

1. Añadir entrada en `src/config/types.ts` (`MarketCode`, `MarketSlug`).
2. Configurar en `taxProfiles.ts`, `mortgageProfiles.ts`, `pricing.ts`, `seoProfiles.ts`.
3. Registrar en `src/config/markets.ts`.
4. Añadir mensajes i18n en `src/i18n/messages.ts` si hay idioma nuevo.
5. Crear Stripe Price IDs y variables `STRIPE_PRICE_*_{CURRENCY}`.

### Cambiar pricing por país

Editar `src/config/pricing.ts` → `MARKET_PRICING`. El backend resuelve el Price ID vía `stripePriceEnvKey` — **el frontend nunca envía priceId**.

### Activar/desactivar Radar

Por mercado en `MarketConfig.features` y `MarketConfig.radar`. Flags globales en `src/config/featureFlags.ts`.

### Tax profiles editables

Los impuestos son **hipótesis editables** por el usuario (`TaxField` en `taxProfiles.ts`). No hay asesoramiento fiscal. Avisos regionales/estatales en cada `TaxProfile.disclaimer`.

### Por qué no scraping

Radar solo usa: mock demo, entrada manual, CSV admin autorizado o `authorizedApiProvider` (API con contrato). Sin scraping de Idealista ni portales.

## Rutas

- `/` — Global country selector
- `/{market}/` — Landing localizada
- `/{market}/simulador` — Simulador
- `/{market}/precios` — Pricing
- `/{market}/radar/*` — Radar Pro
- `/dashboard/*` — Prototipo (TODO Supabase Auth)

Legacy redirects: `/simulador` → `/es/simulador`, `/radar` → `/es/radar`

## Pendiente para producción Radar

- [ ] Supabase Auth + RLS
- [ ] Base de datos (`docs/database-schema.md`)
- [ ] Webhooks Stripe → tabla `subscriptions`
- [ ] Email provider (alertas)
- [ ] Fuente de datos autorizada (API con contrato)
- [ ] Revisión legal (datos, suscripciones, portales)
- [ ] CSV admin upload flow

## Tests

```bash
npm run test
```

Incluye: hipoteca, TIR, métricas simulador, `scoreListing`, ordenación, validación criterios.

## Desplegar en Netlify

Build: `npm run build` · Publish: `dist` · Functions: `netlify/functions`

Configura webhook Stripe apuntando a:
`https://tudominio.netlify.app/.netlify/functions/stripe-webhook`

## Disclaimer

Herramienta orientativa. No constituye asesoramiento financiero, fiscal, legal ni recomendación de compra. Radar Pro no está afiliado a Idealista ni a portales salvo integración autorizada expresa.
