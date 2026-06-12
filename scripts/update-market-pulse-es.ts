/**
 * Placeholder v2 — actualización semi-automática España.
 * No hace scraping. Integra APIs oficiales en el futuro (INE, etc.).
 * Usage: npx tsx scripts/update-market-pulse-es.ts
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const REPORT_PATH = join(process.cwd(), 'src/content/market-pulse/es/2026-06.json');

const report = JSON.parse(readFileSync(REPORT_PATH, 'utf8')) as {
  metrics: Record<string, unknown>;
  sources: { name: string; date: string }[];
};

const optionalFields = [
  'priceTrendQoQ',
  'rentTrendQoQ',
  'transactionVolumeYoY',
  'rentalSupplyTrend',
] as const;

const missing: string[] = [];
for (const field of optionalFields) {
  if (report.metrics[field] == null) missing.push(field);
}

console.log('Market Pulse ES — resumen de actualización manual');
console.log(`Informe: ${REPORT_PATH}`);
console.log(`Fuentes configuradas: ${report.sources.length}`);
if (missing.length) {
  console.log(`Campos opcionales sin rellenar: ${missing.join(', ')}`);
} else {
  console.log('Todos los campos opcionales están presentes.');
}
console.log('\nPara integrar APIs oficiales: ampliar este script sin scraping de portales.');
