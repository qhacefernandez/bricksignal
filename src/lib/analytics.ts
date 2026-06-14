export type AnalyticsEvent =
  | 'market_selected'
  | 'market_geo_redirect'
  | 'simulator_started'
  | 'simulator_completed'
  | 'pro_cta_clicked'
  | 'checkout_started'
  | 'checkout_success'
  | 'lead_submitted'
  | 'radar_landing_viewed'
  | 'radar_demo_started'
  | 'radar_demo_searched'
  | 'radar_waitlist_submitted'
  | 'radar_early_access_clicked'
  | 'subscription_cta_clicked'
  | 'free_result_viewed'
  | 'pro_locked_metric_viewed'
  | 'market_pulse_locked_viewed'
  | 'market_pulse_pro_viewed'
  | 'pro_upgrade_clicked'
  | 'pro_checkout_started'
  | 'pro_report_generated'
  | 'slider_changed'
  | 'numeric_input_changed'
  | 'mortgage_toggle_changed'
  | 'locked_assumption_viewed'
  | 'vacancy_locked_viewed'
  | 'scenario_reset'
  | 'scenario_saved'
  | 'pro_preview_card_viewed'
  | 'pro_same_simulation_exception'
  | 'pro_scenario_credit_claimed'
  | 'pro_scenario_reverted';

declare global {
  interface Window {
    plausible?: (event: string, options?: { props?: Record<string, string | number | boolean> }) => void;
  }
}

export function track(event: AnalyticsEvent, props?: Record<string, string | number | boolean>): void {
  if (typeof window !== 'undefined' && typeof window.plausible === 'function') {
    window.plausible(event, props ? { props } : undefined);
    return;
  }

  if (import.meta.env.DEV) {
    console.debug('[analytics]', event, props ?? '');
  }
}

export { hasAnalyticsConsent, loadAnalyticsScript } from './cookieConsent';
