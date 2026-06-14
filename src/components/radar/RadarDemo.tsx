'use client';

import { useCallback, useEffect, useState } from 'react';
import { track } from '@/lib/analytics';
import { ENABLE_RADAR_DEMO } from '@/lib/flags';
import { searchOpportunities, scoreListings } from '@/lib/listings';
import {
  DEFAULT_INVESTOR_CRITERIA,
  RADAR_CRITERIA_STORAGE_KEY,
  type InvestorCriteria,
  type ScoredOpportunity,
} from '@/lib/listings/types';
import AuthorizedDataNotice from './AuthorizedDataNotice';
import DataSourceDisclaimer from './DataSourceDisclaimer';
import OpportunityCard from './OpportunityCard';
import OpportunityDetail from './OpportunityDetail';
import OpportunityTable from './OpportunityTable';
import RadarCriteriaForm from './RadarCriteriaForm';

export default function RadarDemo() {
  const [criteria, setCriteria] = useState<InvestorCriteria>(DEFAULT_INVESTOR_CRITERIA);
  const [opportunities, setOpportunities] = useState<ScoredOpportunity[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<ScoredOpportunity | null>(null);
  const [view, setView] = useState<'cards' | 'table'>('cards');

  const runSearch = useCallback(async (c: InvestorCriteria) => {
    setLoading(true);
    try {
      const listings = await searchOpportunities(c, 'es');
      setOpportunities(scoreListings(listings, c));
      localStorage.setItem(RADAR_CRITERIA_STORAGE_KEY, JSON.stringify(c));
      track('radar_demo_searched', { count: listings.length });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem(RADAR_CRITERIA_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as InvestorCriteria;
        setCriteria(parsed);
        void runSearch(parsed);
        return;
      } catch {
        /* ignore */
      }
    }
    void runSearch(DEFAULT_INVESTOR_CRITERIA);
  }, [runSearch]);

  if (!ENABLE_RADAR_DEMO) {
    return (
      <p className="text-center text-slate-600">
        La demo de Radar no está disponible.{' '}
        <a href="/radar/waitlist" className="text-brand-600 underline">
          Únete a la waitlist
        </a>
      </p>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Radar — Demo</h1>
        <p className="mt-2 text-slate-600">
          Oportunidades de ejemplo ordenadas por score. Sin datos de portales externos.
        </p>
      </div>

      <DataSourceDisclaimer demo />
      <AuthorizedDataNotice />

      <RadarCriteriaForm
        criteria={criteria}
        onChange={(patch) => setCriteria((prev) => ({ ...prev, ...patch }))}
        onSubmit={() => void runSearch(criteria)}
        loading={loading}
      />

      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">
          {opportunities.length} oportunidad{opportunities.length !== 1 ? 'es' : ''}
        </h2>
        <div className="flex gap-2 text-sm">
          <button
            type="button"
            onClick={() => setView('cards')}
            className={`rounded px-3 py-1 ${view === 'cards' ? 'bg-brand-100 text-brand-800' : 'text-slate-600'}`}
          >
            Tarjetas
          </button>
          <button
            type="button"
            onClick={() => setView('table')}
            className={`rounded px-3 py-1 ${view === 'table' ? 'bg-brand-100 text-brand-800' : 'text-slate-600'}`}
          >
            Tabla
          </button>
        </div>
      </div>

      {view === 'table' ? (
        <OpportunityTable
          opportunities={opportunities}
          criteria={criteria}
          onSelect={setSelected}
        />
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {opportunities.map((op) => (
            <OpportunityCard
              key={op.listing.id}
              opportunity={op}
              criteria={criteria}
              onSelect={setSelected}
            />
          ))}
        </div>
      )}

      {selected && (
        <OpportunityDetail
          opportunity={selected}
          criteria={criteria}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}
