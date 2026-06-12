'use client';

import type { SliderRangeConfig } from '@/config/inputRanges';
import NumberSliderField from './NumberSliderField';

interface Props {
  id: string;
  label: string;
  help?: string;
  value: number;
  onChange: (value: number) => void;
  range: SliderRangeConfig;
  disabled?: boolean;
  error?: string;
}

export default function YearSliderField(props: Props) {
  return <NumberSliderField {...props} suffix="años" decimals={0} />;
}
