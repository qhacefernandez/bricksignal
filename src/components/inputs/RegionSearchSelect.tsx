'use client';

import { useEffect, useId, useRef, useState } from 'react';
import type { MarketConfig } from '@/config/types';
import { filterRegions } from '@/config/regions';

interface Props {
  market: MarketConfig;
  value: string;
  onChange: (value: string) => void;
  label?: string;
}

export default function RegionSearchSelect({ market, value, onChange, label }: Props) {
  const listId = useId();
  const wrapRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState(value);
  const [open, setOpen] = useState(false);
  const regionLabel = label ?? market.taxProfile.regionLabel ?? 'Ciudad / provincia';
  const options = filterRegions(market.slug, query);

  useEffect(() => {
    setQuery(value);
  }, [value]);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  const pick = (region: string) => {
    onChange(region);
    setQuery(region);
    setOpen(false);
  };

  return (
    <div ref={wrapRef} className="relative">
      <label htmlFor={listId} className="mb-1 block text-sm font-medium text-slate-700">
        {regionLabel}
      </label>
      <input
        id={listId}
        type="text"
        role="combobox"
        aria-expanded={open}
        aria-autocomplete="list"
        autoComplete="off"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
          if (options.includes(e.target.value)) onChange(e.target.value);
        }}
        onFocus={() => setOpen(true)}
        placeholder="Buscar…"
        className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
      />
      {open && options.length > 0 && (
        <ul
          role="listbox"
          className="absolute z-40 mt-1 max-h-48 w-full overflow-auto rounded-lg border border-slate-200 bg-white py-1 shadow-lg"
        >
          {options.slice(0, 12).map((region) => (
            <li key={region} role="option" aria-selected={region === value}>
              <button
                type="button"
                className={`w-full px-3 py-2 text-left text-sm hover:bg-brand-50 ${
                  region === value ? 'bg-brand-50 font-medium text-brand-800' : 'text-slate-700'
                }`}
                onMouseDown={(e) => {
                  e.preventDefault();
                  pick(region);
                }}
              >
                {region}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
