'use client';

import type { MarketConfig } from '@/config/types';
import type { SliderRangeConfig } from '@/config/inputRanges';
import { formatPercentInput, formatPercentValue } from '@/lib/format/percent';
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
  disabled?: boolean;
  error?: string;
  outOfRangeMessage?: string;
}

export default function PercentageSliderField({ market, ...props }: Props) {
  return (
    <SliderField
      {...props}
      suffix="%"
      formatDisplay={(v) => formatPercentValue(v, market.locale, 1)}
      formatInput={(v) => formatPercentInput(v)}
      parseInput={parseLocaleNumber}
    />
  );
}
