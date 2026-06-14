'use client';

import { useEffect, useState } from 'react';
import type { LanguageCode } from '@/config/types';
import { t } from '@/i18n/messages';
import {
  applyStoredCookieConsent,
  getCookieConsent,
  saveCookieConsent,
} from '@/lib/cookieConsent';

interface Props {
  language: LanguageCode;
  cookiesHref: string;
}

export default function CookieConsentBanner({ language, cookiesHref }: Props) {
  const [visible, setVisible] = useState(false);
  const msg = (key: Parameters<typeof t>[1]) => t(language, key);

  useEffect(() => {
    if (getCookieConsent()) {
      applyStoredCookieConsent();
      return;
    }
    setVisible(true);
  }, []);

  useEffect(() => {
    if (!visible) {
      document.body.classList.remove('pb-32');
      return;
    }
    document.body.classList.add('pb-32');
    return () => document.body.classList.remove('pb-32');
  }, [visible]);

  if (!visible) return null;

  const acceptAll = () => {
    saveCookieConsent('all');
    setVisible(false);
  };

  const acceptNecessary = () => {
    saveCookieConsent('necessary');
    setVisible(false);
  };

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white/95 p-4 shadow-[0_-8px_30px_rgba(15,23,42,0.12)] backdrop-blur-sm"
      role="dialog"
      aria-live="polite"
      aria-label={msg('cookies.bannerAria')}
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm leading-relaxed text-slate-600">
          {msg('cookies.banner')}{' '}
          <a href={cookiesHref} className="font-medium text-brand-600 underline hover:text-brand-700">
            {msg('cookies.policyLink')}
          </a>
          .
        </p>
        <div className="flex shrink-0 flex-col gap-2 sm:flex-row sm:items-center">
          <button
            type="button"
            onClick={acceptAll}
            className="rounded-xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-brand-700"
          >
            {msg('cookies.acceptAll')}
          </button>
          <button
            type="button"
            onClick={acceptNecessary}
            className="rounded-xl px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
          >
            {msg('cookies.necessaryOnly')}
          </button>
        </div>
      </div>
    </div>
  );
}
