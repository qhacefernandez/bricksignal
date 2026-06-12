'use client';

import { useEffect, useId, useRef, useState } from 'react';

interface TooltipProps {
  label: string;
  children: React.ReactNode;
}

export function InfoTip({ text }: { text: string }) {
  const [open, setOpen] = useState(false);
  const tipId = useId();
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent | KeyboardEvent) => {
      if (e instanceof KeyboardEvent && e.key !== 'Escape') return;
      if (e instanceof MouseEvent && ref.current?.contains(e.target as Node)) return;
      setOpen(false);
    };
    document.addEventListener('mousedown', close);
    document.addEventListener('keydown', close);
    return () => {
      document.removeEventListener('mousedown', close);
      document.removeEventListener('keydown', close);
    };
  }, [open]);

  return (
    <span ref={ref} className="relative inline-flex">
      <button
        type="button"
        aria-expanded={open}
        aria-describedby={open ? tipId : undefined}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-200 text-[11px] font-bold text-slate-600 hover:bg-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-300"
      >
        ?
      </button>
      {open && (
        <span
          id={tipId}
          role="tooltip"
          className="absolute bottom-full left-1/2 z-[60] mb-2 w-64 max-w-[min(16rem,calc(100vw-2rem))] -translate-x-1/2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs leading-relaxed text-slate-700 shadow-lg"
        >
          {text}
        </span>
      )}
    </span>
  );
}

export default function Tooltip({ label, children }: TooltipProps) {
  return (
    <span className="inline-flex items-center gap-1.5">
      {children}
      <InfoTip text={label} />
    </span>
  );
}

export function MetricLabel({ label, tooltip }: { label: string; tooltip: string }) {
  return (
    <Tooltip label={tooltip}>
      <span className="text-sm text-slate-600">{label}</span>
    </Tooltip>
  );
}
