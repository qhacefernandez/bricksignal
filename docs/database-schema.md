# Esquema Supabase recomendado — BrickSignal / Radar

> v1 no usa base de datos. Este documento describe la arquitectura objetivo para auth, suscripciones y Radar.

## `users`

| Columna | Tipo | Notas |
|---------|------|-------|
| `id` | `uuid` PK | Supabase Auth user id |
| `email` | `text` | |
| `created_at` | `timestamptz` | |

## `subscriptions`

| Columna | Tipo | Notas |
|---------|------|-------|
| `id` | `uuid` PK | |
| `user_id` | `uuid` FK → users | |
| `stripe_customer_id` | `text` | |
| `stripe_subscription_id` | `text` unique | |
| `status` | `text` | active, canceled, past_due… |
| `price_id` | `text` | Stripe Price ID |
| `current_period_end` | `timestamptz` | |
| `created_at` | `timestamptz` | |
| `updated_at` | `timestamptz` | |

Sincronizar vía `stripe-webhook.ts` en eventos:
- `checkout.session.completed` (mode=subscription)
- `customer.subscription.*`
- `invoice.paid` / `invoice.payment_failed`

**No conceder acceso Radar solo con localStorage.** Validar `subscriptions.status = 'active'` en backend.

## `saved_searches`

| Columna | Tipo | Notas |
|---------|------|-------|
| `id` | `uuid` PK | |
| `user_id` | `uuid` FK | |
| `name` | `text` | |
| `criteria_json` | `jsonb` | `InvestorCriteria` |
| `frequency` | `text` | daily, weekly |
| `active` | `boolean` | |
| `created_at` | `timestamptz` | |
| `updated_at` | `timestamptz` | |

## `listing_snapshots`

| Columna | Tipo | Notas |
|---------|------|-------|
| `id` | `uuid` PK | |
| `provider` | `text` | mock, manual, csv, authorized_api |
| `external_id` | `text` | ID en fuente autorizada |
| `source_url` | `text` nullable | Solo si licencia lo permite |
| `data_json` | `jsonb` | `Listing` — datos mínimos, no copiar contenido protegido |
| `first_seen_at` | `timestamptz` | |
| `last_seen_at` | `timestamptz` | |

Índice único: `(provider, external_id)`.

## `opportunity_scores`

| Columna | Tipo | Notas |
|---------|------|-------|
| `id` | `uuid` PK | |
| `listing_snapshot_id` | `uuid` FK | |
| `user_id` | `uuid` FK | |
| `saved_search_id` | `uuid` FK nullable | |
| `score_json` | `jsonb` | `OpportunityScore` |
| `created_at` | `timestamptz` | |

## `alerts`

| Columna | Tipo | Notas |
|---------|------|-------|
| `id` | `uuid` PK | |
| `user_id` | `uuid` FK | |
| `saved_search_id` | `uuid` FK | |
| `opportunity_score_id` | `uuid` FK | |
| `channel` | `text` | email, push |
| `sent_at` | `timestamptz` | |
| `opened_at` | `timestamptz` nullable | |

## Row Level Security

- Todas las tablas: `user_id = auth.uid()` para SELECT/INSERT/UPDATE.
- `listing_snapshots`: lectura solo vía funciones server-side o políticas restringidas.

## Jobs Netlify (futuro)

| Function | Trigger | Dependencias |
|----------|---------|--------------|
| `sync-authorized-listings` | Cron | `ENABLE_AUTHORIZED_LISTING_PROVIDER`, API autorizada |
| `score-opportunities` | Post-sync / Cron | Supabase, `scoring.ts` |
| `send-radar-alerts` | Cron | Email provider, `alerts` table |

## Fuentes de datos permitidas

1. Entrada manual del usuario
2. Mock demo
3. CSV admin (datos propios/autorizados)
4. `authorizedApiProvider` con contrato/API oficial

**Prohibido:** scraping de Idealista u otros portales sin autorización.
