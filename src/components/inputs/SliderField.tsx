'use client';

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

/** Estilos cross-browser; input nativo type=range funciona en iOS Safari (Radix pointer events no). */
const RANGE_CLASS =
  'h-11 w-full cursor-pointer appearance-none bg-transparent ' +
  '[&::-webkit-slider-runnable-track]:h-2 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-slate-200 ' +
  '[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:mt-[-18px] [&::-webkit-slider-thumb]:h-11 [&::-webkit-slider-thumb]:w-11 ' +
  '[&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-brand-600 ' +
  '[&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-md ' +
  '[&::-moz-range-track]:h-2 [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-slate-200 ' +
  '[&::-moz-range-thumb]:box-border [&::-moz-range-thumb]:h-11 [&::-moz-range-thumb]:w-11 [&::-moz-range-thumb]:rounded-full ' +
  '[&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-brand-600 [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:shadow-md ' +
  'disabled:cursor-not-allowed disabled:opacity-60';

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
  const rangeId = `${id}-range`;
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

  const handleRangeChange = useCallback(
    (raw: number) => {
      if (!Number.isFinite(raw)) return;
      onChange(roundToStep(raw, effectiveRange.step));
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
        <input
          id={rangeId}
          type="range"
          disabled={disabled}
          aria-labelledby={labelId}
          aria-valuemin={effectiveRange.min}
          aria-valuemax={effectiveRange.max}
          aria-valuenow={sliderValue}
          min={effectiveRange.min}
          max={effectiveRange.max}
          step={effectiveRange.step}
          value={sliderValue}
          onChange={(e) => handleRangeChange(Number(e.target.value))}
          onInput={(e) => handleRangeChange(Number(e.currentTarget.value))}
          className={`${RANGE_CLASS} accent-brand-600`}
        />
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
