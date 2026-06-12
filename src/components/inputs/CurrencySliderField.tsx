'use client';

import type { MarketConfig } from '@/config/types';
import type { SliderRangeConfig } from '@/config/inputRanges';
import { formatCurrencyForMarketConfig, formatCurrencyInputDisplay } from '@/lib/format/currency';
import { parseLocaleNumber } from '@/lib/format/number';
import SliderField from './SliderField';

interface Props {
  id: string;
  label: string;
  help?: string;
  value: number;
  onChange: (value: number) => void;
  range: SliderRangeConfig;
  market: MarketConfig;
  suffix?: string;
  disabled?: boolean;
  error?: string;
  outOfRangeMessage?: string;
}

export default function CurrencySliderField({
  market,
  suffix,
  ...props
}: Props) {
  return (
    <SliderField
      {...props}
      suffix={suffix}
      formatDisplay={(v) => formatCurrencyForMarketConfig(v, market)}
      formatInput={(v) => formatCurrencyInputDisplay(v, market.currency, market.locale)}
      parseInput={parseLocaleNumber}
    />
  );
}
