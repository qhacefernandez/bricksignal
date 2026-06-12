import { getActivePricingVariant } from '@/config/pricing';
import type { MarketSlug } from '@/config/types';
import type { BasicCalculationResults, BasicSimulatorInput } from './calculations/basic';
import { generateScenarioId } from './proGating';

const SCENARIO_ID_KEY = 'bricksignal-scenario-id';

export function getOrCreateScenarioId(): string {
  if (typeof localStorage === 'undefined') return generateScenarioId();
  let id = localStorage.getItem(SCENARIO_ID_KEY);
  if (!id) {
    id = generateScenarioId();
    localStorage.setItem(SCENARIO_ID_KEY, id);
  }
  return id;
}

export function buildAnalyticsProps(
  marketSlug: MarketSlug,
  basic: BasicSimulatorInput,
  results: BasicCalculationResults,
): Record<string, string | number | boolean> {
  return {
    marketSlug,
    scenarioId: getOrCreateScenarioId(),
    pricingVariant: getActivePricingVariant(),
    hasMortgage: basic.useMortgage,
    estimatedPriceRange: String(Math.round(basic.purchasePrice / 1000) * 1000),
    estimatedGrossYieldRange: `${results.grossYield.toFixed(1)}%`,
  };
}
