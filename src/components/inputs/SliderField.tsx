'use client';

import * as Slider from '@radix-ui/react-slider';
import { useCallback, useId, useMemo, useState } from 'react';
import { expandSliderRange, type SliderRangeConfig } from '@/config/inputRanges';
import { isOutOfSliderRange } from '@/lib/validation/scenarioValidation';
import { roundToStep } from '@/lib/format/number';
import FieldHelp from './FieldHelp';
import InputError from './InputError';

export interface SliderFieldProps {
  id: string;
  label: string;
  help?: string;
  value: number;
  onChange: (value: number) => void;
  range: SliderRangeConfig;
  formatDisplay: (value: number) => string;
  formatInput?: (value: number) => string;
  parseInput?: (raw: string) => number;
  suffix?: string;
  disabled?: boolean;
  error?: string;
  outOfRangeMessage?: string;
}

export default function SliderField({
  id,
  label,
  help,
  value,
  onChange,
  range,
  formatDisplay,
  formatInput,
  parseInput,
  suffix,
  disabled,
  error,
  outOfRangeMessage = 'Valor fuera del rango habitual, pero se usará en el cálculo.',
}: SliderFieldProps) {
  const helpId = useId();
  const labelId = useId();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState('');

  const effectiveRange = useMemo(() => expandSliderRange(range, value), [range, value]);
  const sliderValue = Math.min(
    effectiveRange.max,
    Math.max(effectiveRange.min, value),
  );

  const handleInputFocus = () => {
    setEditing(true);
    setDraft(formatInput ? formatInput(value) : String(value));
  };

  const handleInputBlur = () => {
    setEditing(false);
    const parsed = parseInput ? parseInput(draft) : parseFloat(draft);
    if (Number.isFinite(parsed)) onChange(parsed);
  };

  const handleSliderChange = useCallback(
    (vals: number[]) => {
      const v = vals[0];
      if (v !== undefined) onChange(roundToStep(v, effectiveRange.step));
    },
    [onChange, effectiveRange.step],
  );

  const outOfRange = isOutOfSliderRange(value, range.min, range.max);

  return (
    <div className={disabled ? 'opacity-60' : ''}>
      <div className="mb-2 flex items-baseline justify-between gap-2">
        <label id={labelId} htmlFor={id} className="text-sm font-medium text-slate-800">
          {label}
        </label>
      </div>
      {help && <FieldHelp id={helpId}>{help}</FieldHelp>}
      <div className="mt-2 flex items-center gap-3">
        <input
          id={id}
          type="text"
          inputMode="decimal"
          disabled={disabled}
          aria-labelledby={labelId}
          aria-describedby={help ? helpId : undefined}
          aria-valuemin={range.min}
          aria-valuemax={range.max}
          aria-valuenow={value}
          value={editing ? draft : formatDisplay(value)}
          onFocus={handleInputFocus}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={handleInputBlur}
          className="w-full max-w-[9rem] rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm font-semibold text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
        />
        {suffix && <span className="text-sm text-slate-500">{suffix}</span>}
      </div>
      <div className="mt-4 px-1">
        <Slider.Root
          value={[sliderValue]}
          onValueChange={handleSliderChange}
          min={effectiveRange.min}
          max={effectiveRange.max}
          step={effectiveRange.step}
          disabled={disabled}
          aria-labelledby={labelId}
          className="relative flex h-11 select-none items-center touch-pan-y"
        >
          <Slider.Track className="relative h-2 grow rounded-full bg-slate-200">
            <Slider.Range className="absolute h-full rounded-full bg-brand-500" />
          </Slider.Track>
          <Slider.Thumb
            className="block h-11 w-11 touch-none rounded-full border-2 border-brand-600 bg-white shadow-md focus:outline-none focus:ring-2 focus:ring-brand-400 focus:ring-offset-2"
            aria-labelledby={labelId}
          />
        </Slider.Root>
        <div className="mt-1 flex justify-between text-xs text-slate-400">
          <span>{formatDisplay(effectiveRange.min)}</span>
          <span>{formatDisplay(effectiveRange.max)}</span>
        </div>
      </div>
      {outOfRange && !error && (
        <p className="mt-1 text-xs text-amber-700">{outOfRangeMessage}</p>
      )}
      <InputError message={error} />
    </div>
  );
}
