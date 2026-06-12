'use client';

import { createContext, useContext, type ReactNode } from 'react';
import type { MarketConfig } from '@/config/types';

const MarketContext = createContext<MarketConfig | null>(null);

export function MarketProvider({ market, children }: { market: MarketConfig; children: ReactNode }) {
  return <MarketContext.Provider value={market}>{children}</MarketContext.Provider>;
}

export function useMarket(): MarketConfig {
  const ctx = useContext(MarketContext);
  if (!ctx) throw new Error('useMarket must be used within MarketProvider');
  return ctx;
}
