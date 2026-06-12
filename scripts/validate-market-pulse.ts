/**
 * Validates Market Pulse JSON files under src/content/market-pulse.
 * Usage: npx tsx scripts/validate-market-pulse.ts
 */
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = join(process.cwd(), 'src/content/market-pulse');
const MARKETS = ['es', 'pt', 'it', 'uk', 'us', 'mx', 'au', 'ie'] as const;

type MissingSummary = { market: string; file: string; missing: string[] };

function validateReport(data: Record<string, unknown>, file: string): string[] {
  const required = [
    'marketCode', 'marketSlug', 'period', 'publishedAt', 'validUntil',
    'geographyLevel', 'geographyName', 'metrics', 'sources', 'disclaimer',
  ];
  const missing = required.filter((k) => data[k] == null);
  if (!Array.isArray(data.sources)) missing.push('sources[]');
  if (missing.length) {
    console.warn(`[warn] ${file}: missing ${missing.join(', ')}`);
  }
  return missing;
}

const summaries: MissingSummary[] = [];

for (const market of MARKETS) {
  const dir = join(ROOT, market);
  let files: string[] = [];
  try {
    files = readdirSync(dir).filter((f) => f.endsWith('.json'));
  } catch {
    summaries.push({ market, file: '-', missing: ['directory'] });
    continue;
  }
  if (!files.length) {
    summaries.push({ market, file: '-', missing: ['no JSON files'] });
    continue;
  }
  for (const file of files) {
    const path = join(dir, file);
    const data = JSON.parse(readFileSync(path, 'utf8')) as Record<string, unknown>;
    const missing = validateReport(data, path);
    if (missing.length) summaries.push({ market, file, missing });
  }
}

if (summaries.length) {
  console.log('\nResumen de datos faltantes:');
  for (const s of summaries) {
    console.log(`- ${s.market}/${s.file}: ${s.missing.join(', ')}`);
  }
} else {
  console.log('Todos los informes Market Pulse pasan validación básica.');
}

process.exit(0);
