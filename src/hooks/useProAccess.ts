'use client';

import { useEffect, useState } from 'react';
import type { MarketSlug } from '@/config/types';
import type { BasicSimulatorInput } from '@/lib/calculations/basic';
import { hasProAccess, loadProAccess } from '@/lib/marketStorage';
import { canViewProReport, claimProReport, scenarioFingerprint } from '@/lib/proReports';

export type ProAccessState = {
  sessionValid: boolean;
  proUnlocked: boolean;
  reportsRemaining: number;
};

export function useProAccess(marketSlug: MarketSlug, basic: BasicSimulatorInput): ProAccessState {
  const [state, setState] = useState<ProAccessState>({
    sessionValid: false,
    proUnlocked: false,
    reportsRemaining: 0,
  });

  const fingerprint = scenarioFingerprint(basic);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const sessionValid = await hasProAccess(marketSlug);
      if (cancelled) return;
      if (!sessionValid) {
        setState({ sessionValid: false, proUnlocked: false, reportsRemaining: 0 });
        return;
      }
      const access = loadProAccess(marketSlug);
      let view = canViewProReport(access, fingerprint);
      if (
        view.allowed
        && access
        && !(access.claimedScenarios ?? []).includes(fingerprint)
        && (access.claimedScenarios ?? []).length === 0
      ) {
        const claimed = claimProReport(marketSlug, fingerprint);
        if (claimed) view = canViewProReport(claimed, fingerprint);
      }
      if (!cancelled) {
        setState({
          sessionValid: true,
          proUnlocked: view.allowed,
          reportsRemaining: view.remaining,
        });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [marketSlug, fingerprint]);

  return state;
}
