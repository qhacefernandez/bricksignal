import { useMemo } from 'react';
import type { MarketConfig } from '@/config/types';
import {
  FREE_LOCKED_VACANCY_PERCENT,
  getCashflowWarningThreshold,
  getMarketInputRanges,
  type MarketInputRanges,
} from '@/config/inputRanges';

export function useMarketRanges(market: MarketConfig): {
  ranges: MarketInputRanges;
  lockedVacancyPercent: number;
  cashflowWarningThreshold: number;
} {
  return useMemo(() => {
    const ranges = getMarketInputRanges(market.slug);
    return {
      ranges,
      lockedVacancyPercent: FREE_LOCKED_VACANCY_PERCENT,
      cashflowWarningThreshold: getCashflowWarningThreshold(market.currency),
    };
  }, [market.slug, market.currency]);
}
