'use client';

import type { SliderRangeConfig } from '@/config/inputRanges';
import { parseLocaleNumber } from '@/lib/format/number';
import SliderField from './SliderField';

interface Props {
  id: string;
  label: string;
  help?: string;
  value: number;
  onChange: (value: number) => void;
  range: SliderRangeConfig;
  suffix?: string;
  decimals?: number;
  disabled?: boolean;
  error?: string;
  outOfRangeMessage?: string;
}

export default function NumberSliderField({
  decimals = 0,
  suffix,
  ...props
}: Props) {
  return (
    <SliderField
      {...props}
      suffix={suffix}
      formatDisplay={(v) => (decimals > 0 ? v.toFixed(decimals) : String(Math.round(v)))}
      formatInput={(v) => (decimals > 0 ? v.toFixed(decimals) : String(Math.round(v)))}
      parseInput={parseLocaleNumber}
    />
  );
}
