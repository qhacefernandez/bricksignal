import { ENABLE_PRO_PREVIEW_BLUR, ENABLE_PRO_REPORT } from '@/config/featureFlags';

export const LOCKED_PRO_METRICS = ['netYield', 'irr', 'dscr', 'sensitivity', 'marketPulse', 'pdf'] as const;
export type LockedProMetric = (typeof LOCKED_PRO_METRICS)[number];

export function isProReportEnabled(): boolean {
  return ENABLE_PRO_REPORT;
}

export function shouldShowProPreviewBlur(): boolean {
  return ENABLE_PRO_PREVIEW_BLUR;
}

export function maskProValue(unlocked: boolean, value: string): string {
  if (unlocked) return value;
  return '••••';
}

export function canAccessProMetric(unlocked: boolean, _metric: LockedProMetric): boolean {
  if (!ENABLE_PRO_REPORT) return false;
  return unlocked;
}

/** PRO must not be granted from localStorage alone — requires backend verify */
export function assertProUnlockRequiresVerification(
  sessionVerified: boolean,
  hasLocalFlag: boolean,
): boolean {
  if (!sessionVerified && hasLocalFlag) return false;
  return sessionVerified;
}

export function generateScenarioId(): string {
  return `sc_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}
