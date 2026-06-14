'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { MarketConfig } from '@/config/types';
import { track } from '@/lib/analytics';
import { buildAnalyticsProps } from '@/lib/analyticsContext';
import {
  annualExpenseToPercent,
  calculateBasicInvestment,
  percentToAnnualExpense,
  type BasicSimulatorInput,
} from '@/lib/calculations/basic';
import { expandBasicToProInput } from '@/lib/calculations/pro';
import { hasProAccess, loadBasicScenario, loadProAccess, saveBasicScenario } from '@/lib/marketStorage';
import {
  applySameSimulationException,
  canViewProReport,
  claimProReport,
  getSameSimulationExceptionsRemaining,
  scenarioFingerprint,
} from '@/lib/proReports';
import type { SimulatorInput } from '@/lib/types';
import { validateBasicScenario } from '@/lib/validation/scenarioValidation';
import { MORTGAGE_PROFILES } from '@/config/mortgageProfiles';
import { getMarketInputRanges, valueBucket, vacancyBucket } from '@/config/inputRanges';
import { getActivePricingVariant } from '@/config/pricing';
import { useDebouncedValue } from './useDebouncedValue';
import { useMarketRanges } from './useMarketRanges';

export interface ScenarioChangeWarning {
  pendingFingerprint: string;
  exceptionsRemaining: number;
  reportsRemaining: number;
}

export type MicrocopyKey =
  | 'cashflow_positive'
  | 'low_down_payment'
  | 'rate_impact'
  | 'expense_impact';

const MICROCOPY: Record<MicrocopyKey, string> = {
  cashflow_positive: 'Ahora la operación genera cashflow positivo con estas hipótesis.',
  low_down_payment: 'Menor entrada aumenta el apalancamiento, pero también puede reducir el cashflow.',
  rate_impact: 'La financiación tiene un impacto relevante en esta operación.',
  expense_impact: 'Los gastos operativos reducen el margen mensual.',
};

function buildDefaultBasic(market: MarketConfig): BasicSimulatorInput {
  const ranges = getMarketInputRanges(market.slug);
  return {
    purchasePrice: ranges.purchasePrice.defaultValue,
    monthlyRent: ranges.monthlyRent.defaultValue,
    region: '',
    useMortgage: true,
    downPayment: ranges.downPayment.defaultValue,
    interestRate: ranges.interestRate.defaultValue,
    mortgageYears: ranges.mortgageYears.defaultValue,
    amortizationMethod: MORTGAGE_PROFILES[market.slug].defaultAmortizationMethod,
    purchaseCostsPercent: ranges.purchaseCostsPercent.defaultValue,
    annualExpensesPercent: ranges.annualExpensesPercent.defaultValue,
    annualExpensesMode: 'percent',
    annualExpensesAbsolute: percentToAnnualExpense(
      ranges.monthlyRent.defaultValue,
      ranges.annualExpensesPercent.defaultValue,
    ),
    vacancyPercent: ranges.vacancyRate.defaultValue,
    vacancyMode: 'percent',
    vacancyMonths: 0,
    marketSlug: market.slug,
  };
}

export function useInvestmentScenario(market: MarketConfig) {
  const { ranges, lockedVacancyPercent, cashflowWarningThreshold } = useMarketRanges(market);
  const [basic, setBasic] = useState<BasicSimulatorInput>(() => buildDefaultBasic(market));
  const [proUnlocked, setProUnlocked] = useState(false);
  const [reportsRemaining, setReportsRemaining] = useState(0);
  const [scenarioChangeWarning, setScenarioChangeWarning] = useState<ScenarioChangeWarning | null>(null);
  const lastUnlockedBasicRef = useRef<BasicSimulatorInput | null>(null);
  const [proOverrides, setProOverrides] = useState<Partial<SimulatorInput>>({});
  const [microcopy, setMicrocopy] = useState<string | null>(null);
  const [started, setStarted] = useState(false);
  const prevCashflow = useRef<number | null>(null);
  const prevRate = useRef(basic.interestRate);
  const prevExpenses = useRef(basic.annualExpensesPercent);

  useEffect(() => {
    const saved = loadBasicScenario(market.slug);
    if (saved) {
      setBasic({
        ...buildDefaultBasic(market),
        ...saved,
        marketSlug: market.slug,
        annualExpensesMode: saved.annualExpensesMode ?? 'percent',
        annualExpensesAbsolute:
          saved.annualExpensesAbsolute
          ?? percentToAnnualExpense(saved.monthlyRent, saved.annualExpensesPercent),
        vacancyMode: saved.vacancyMode ?? 'percent',
        vacancyMonths: saved.vacancyMonths ?? 0,
        vacancyPercent: lockedVacancyPercent,
      });
      setStarted(true);
    }
  }, [market.slug, lockedVacancyPercent]);

  const fingerprint = scenarioFingerprint(basic);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const sessionValid = await hasProAccess(market.slug);
      if (cancelled) return;
      if (!sessionValid) {
        setProUnlocked(false);
        setReportsRemaining(0);
        setScenarioChangeWarning(null);
        return;
      }
      const access = loadProAccess(market.slug);
      if (!access) {
        setProUnlocked(false);
        setReportsRemaining(0);
        setScenarioChangeWarning(null);
        return;
      }

      const view = canViewProReport(access, fingerprint);
      const claimed = access.claimedScenarios ?? [];

      if (claimed.includes(fingerprint)) {
        lastUnlockedBasicRef.current = basic;
        setProUnlocked(true);
        setReportsRemaining(view.remaining);
        setScenarioChangeWarning(null);
        return;
      }

      if (view.allowed && claimed.length === 0) {
        const next = claimProReport(market.slug, fingerprint);
        if (next) {
          lastUnlockedBasicRef.current = basic;
          setProUnlocked(true);
          setReportsRemaining(canViewProReport(next, fingerprint).remaining);
          setScenarioChangeWarning(null);
          return;
        }
      }

      if (claimed.length > 0) {
        setProUnlocked(false);
        setScenarioChangeWarning({
          pendingFingerprint: fingerprint,
          exceptionsRemaining: getSameSimulationExceptionsRemaining(access),
          reportsRemaining: access.reportsRemaining ?? 0,
        });
        return;
      }

      setProUnlocked(view.allowed);
      setReportsRemaining(view.remaining);
      setScenarioChangeWarning(null);
    })();
    return () => {
      cancelled = true;
    };
  }, [market.slug, fingerprint, basic]);

  const basicForCalc = useMemo(() => {
    if (!proUnlocked) {
      return {
        ...basic,
        vacancyPercent: lockedVacancyPercent,
        vacancyMode: 'percent' as const,
        vacancyMonths: 0,
      };
    }
    if (proOverrides.vacancyPercent !== undefined) {
      return {
        ...basic,
        vacancyPercent: proOverrides.vacancyPercent,
        vacancyMode: 'percent' as const,
        vacancyMonths: 0,
      };
    }
    if (proOverrides.vacancyMonths !== undefined && proOverrides.vacancyMonths > 0) {
      return {
        ...basic,
        vacancyMode: 'months' as const,
        vacancyMonths: proOverrides.vacancyMonths,
      };
    }
    return basic;
  }, [basic, proUnlocked, proOverrides.vacancyPercent, proOverrides.vacancyMonths, lockedVacancyPercent]);

  const debouncedBasic = useDebouncedValue(basicForCalc, 150);
  const basicResults = useMemo(
    () => calculateBasicInvestment(debouncedBasic, { cashflowWarningThreshold }),
    [debouncedBasic, cashflowWarningThreshold],
  );

  const validation = useMemo(() => validateBasicScenario(basic), [basic]);

  const proInput = useMemo(() => {
    const expanded = expandBasicToProInput(basicForCalc, market.slug);
    return { ...expanded, ...proOverrides };
  }, [basicForCalc, market.slug, proOverrides]);

  useEffect(() => {
    saveBasicScenario(market.slug, { ...basicForCalc, vacancyPercent: lockedVacancyPercent });
  }, [basicForCalc, market.slug, lockedVacancyPercent]);

  useEffect(() => {
    if (!started) return;
    const cf = basicResults.monthlyCashflow;
    if (prevCashflow.current !== null && prevCashflow.current <= 0 && cf > 0) {
      setMicrocopy(MICROCOPY.cashflow_positive);
    }
    prevCashflow.current = cf;
  }, [basicResults.monthlyCashflow, started]);

  useEffect(() => {
    if (basic.interestRate > prevRate.current && started) {
      setMicrocopy(MICROCOPY.rate_impact);
    }
    prevRate.current = basic.interestRate;
  }, [basic.interestRate, started]);

  useEffect(() => {
    if (basic.annualExpensesPercent > prevExpenses.current && started) {
      setMicrocopy(MICROCOPY.expense_impact);
    }
    prevExpenses.current = basic.annualExpensesPercent;
  }, [basic.annualExpensesPercent, started]);

  const updateBasic = useCallback(
    (patch: Partial<BasicSimulatorInput>, fieldId?: string) => {
      setStarted(true);
      setBasic((prev) => {
        let next = { ...prev, ...patch, marketSlug: market.slug };
        if (!proUnlocked) {
          next.vacancyPercent = lockedVacancyPercent;
          next.vacancyMode = 'percent';
          next.vacancyMonths = 0;
        }
        if (patch.annualExpensesMode && patch.annualExpensesMode !== prev.annualExpensesMode) {
          if (patch.annualExpensesMode === 'absolute') {
            next.annualExpensesAbsolute = percentToAnnualExpense(
              next.monthlyRent,
              next.annualExpensesPercent,
            );
          } else {
            next.annualExpensesPercent = annualExpenseToPercent(
              next.monthlyRent,
              next.annualExpensesAbsolute,
            );
          }
        }
        if (patch.monthlyRent !== undefined && next.annualExpensesMode === 'percent') {
          next.annualExpensesAbsolute = percentToAnnualExpense(
            next.monthlyRent,
            next.annualExpensesPercent,
          );
        }
        if (patch.annualExpensesPercent !== undefined && next.annualExpensesMode === 'percent') {
          next.annualExpensesAbsolute = percentToAnnualExpense(next.monthlyRent, next.annualExpensesPercent);
        }
        if (patch.annualExpensesAbsolute !== undefined && next.annualExpensesMode === 'absolute') {
          next.annualExpensesPercent = annualExpenseToPercent(next.monthlyRent, next.annualExpensesAbsolute);
        }
        if (patch.downPayment !== undefined && patch.downPayment < prev.downPayment) {
          setMicrocopy(MICROCOPY.low_down_payment);
        }
        return next;
      });
      if (fieldId) {
        const range = ranges[fieldId as keyof typeof ranges];
        track('slider_changed', {
          marketSlug: market.slug,
          fieldId,
          valueBucket: range ? valueBucket((patch as Record<string, number>)[fieldId] ?? 0, range.min, range.max) : 'unknown',
          hasMortgage: patch.useMortgage ?? basic.useMortgage,
          pricingVariant: getActivePricingVariant(),
        });
      }
    },
    [market.slug, proUnlocked, lockedVacancyPercent, ranges, basic.useMortgage],
  );

  const updatePro = useCallback((patch: Partial<SimulatorInput>) => {
    if (!proUnlocked) return;
    setProOverrides((prev) => ({ ...prev, ...patch }));
    if (patch.amortizationMethod !== undefined) {
      setBasic((prev) => ({ ...prev, amortizationMethod: patch.amortizationMethod }));
    }
  }, [proUnlocked]);

  const reset = useCallback(() => {
    setBasic(buildDefaultBasic(market));
    setProOverrides({});
    setMicrocopy(null);
    track('scenario_reset', { marketSlug: market.slug, pricingVariant: getActivePricingVariant() });
  }, [market]);

  const confirmSameSimulation = useCallback(() => {
    const next = applySameSimulationException(market.slug, fingerprint);
    if (!next) return;
    lastUnlockedBasicRef.current = basic;
    setProUnlocked(true);
    setReportsRemaining(canViewProReport(next, fingerprint).remaining);
    setScenarioChangeWarning(null);
    track('pro_same_simulation_exception', { marketSlug: market.slug });
  }, [market.slug, fingerprint, basic]);

  const claimCurrentScenario = useCallback(() => {
    const next = claimProReport(market.slug, fingerprint);
    if (!next) return;
    lastUnlockedBasicRef.current = basic;
    setProUnlocked(true);
    setReportsRemaining(next.reportsRemaining ?? 0);
    setScenarioChangeWarning(null);
    track('pro_scenario_credit_claimed', { marketSlug: market.slug });
  }, [market.slug, fingerprint, basic]);

  const revertToUnlockedScenario = useCallback(() => {
    if (!lastUnlockedBasicRef.current) return;
    setBasic(lastUnlockedBasicRef.current);
    setScenarioChangeWarning(null);
    track('pro_scenario_reverted', { marketSlug: market.slug });
  }, [market.slug]);

  const trackFreeResult = useCallback(() => {
    track('free_result_viewed', buildAnalyticsProps(market.slug, basicForCalc, basicResults));
    track('vacancy_locked_viewed', {
      marketSlug: market.slug,
      defaultVacancyBucket: vacancyBucket(lockedVacancyPercent),
      pricingVariant: getActivePricingVariant(),
    });
  }, [market.slug, basicForCalc, basicResults, lockedVacancyPercent]);

  return {
    basic,
    basicForCalc,
    basicResults,
    proInput,
    proOverrides,
    updateBasic,
    updatePro,
    reset,
    validation,
    microcopy,
    setMicrocopy,
    started,
    setStarted,
    ranges,
    lockedVacancyPercent,
    trackFreeResult,
    proUnlocked,
    reportsRemaining,
    scenarioChangeWarning,
    confirmSameSimulation,
    claimCurrentScenario,
    revertToUnlockedScenario,
  };
}

export type InvestmentScenarioState = ReturnType<typeof useInvestmentScenario>;
