'use client';

import { useEffect } from 'react';
import type { MarketConfig } from '@/config/types';
import { track } from '@/lib/analytics';
import { MarketProvider } from '@/lib/marketContext';
import { ENABLE_PRO_REPORT } from '@/config/featureFlags';
import { useInvestmentScenario } from '@/hooks/useInvestmentScenario';
import ProInvestmentAnalysis from '../pro/ProInvestmentAnalysis';
import BasicInputPanel from './BasicInputPanel';
import BasicResultsSummary from './BasicResultsSummary';
import ProScenarioChangeWarning from './ProScenarioChangeWarning';
import ProUpgradeCTA from './ProUpgradeCTA';

interface Props {
  market: MarketConfig;
}

function SimulatorInner({ market }: Props) {
  const scenario = useInvestmentScenario(market);
  const {
    proUnlocked,
    reportsRemaining,
    scenarioChangeWarning,
    confirmSameSimulation,
    claimCurrentScenario,
    revertToUnlockedScenario,
  } = scenario;
  const {
    basic,
    basicForCalc,
    basicResults,
    updateBasic,
    validation,
    microcopy,
    ranges,
    lockedVacancyPercent,
    started,
    trackFreeResult,
  } = scenario;

  useEffect(() => {
    track('simulator_started', { marketSlug: market.slug });
  }, [market.slug]);

  useEffect(() => {
    if (started) {
      trackFreeResult();
      track('simulator_completed', { marketSlug: market.slug });
    }
  }, [started, market.slug, trackFreeResult]);

  return (
    <div className="space-y-8">
      {scenarioChangeWarning && (
        <ProScenarioChangeWarning
          market={market}
          basic={basicForCalc}
          warning={scenarioChangeWarning}
          onSameSimulation={confirmSameSimulation}
          onRevert={revertToUnlockedScenario}
          onUseCredit={scenarioChangeWarning.reportsRemaining > 0 ? claimCurrentScenario : undefined}
        />
      )}

      <div className="flex flex-col gap-8 lg:grid lg:grid-cols-[1fr_340px]">
        <BasicInputPanel
          market={market}
          input={basic}
          ranges={ranges}
          lockedVacancyPercent={lockedVacancyPercent}
          proUnlocked={proUnlocked}
          reportsRemaining={reportsRemaining}
          validation={validation}
          onChange={updateBasic}
        />
        <BasicResultsSummary
          market={market}
          results={basicResults}
          microcopy={microcopy}
          proUnlocked={proUnlocked}
          basic={basicForCalc}
          lockedVacancyPercent={lockedVacancyPercent}
          started={started}
        />
      </div>

      {ENABLE_PRO_REPORT && !proUnlocked && (
        <ProUpgradeCTA
          market={market}
          basic={basicForCalc}
          results={basicResults}
          lockedVacancyPercent={lockedVacancyPercent}
        />
      )}

      {ENABLE_PRO_REPORT && (
        <ProInvestmentAnalysis
          market={market}
          basic={basicForCalc}
          basicResults={basicResults}
          proUnlocked={proUnlocked}
          scenario={scenario}
        />
      )}
    </div>
  );
}

export default function BasicInvestmentSimulator({ market }: Props) {
  return (
    <MarketProvider market={market}>
      <SimulatorInner market={market} />
    </MarketProvider>
  );
}
