'use client';

import { useCallback, useEffect, useState } from 'react';
import type { MarketConfig } from '@/config/types';
import { track } from '@/lib/analytics';
import { searchOpportunities, scoreListings } from '@/lib/listings';
import {
  DEFAULT_INVESTOR_CRITERIA,
  type InvestorCriteria,
  type ScoredOpportunity,
} from '@/lib/listings/types';
import MarketRadarCriteriaForm from './MarketRadarCriteriaForm';
import OpportunityCard from '../radar/OpportunityCard';
import OpportunityDetail from '../radar/OpportunityDetail';
import OpportunityTable from '../radar/OpportunityTable';
import DataSourceDisclaimer from '../radar/DataSourceDisclaimer';
import AuthorizedDataNotice from '../radar/AuthorizedDataNotice';

interface Props {
  market: MarketConfig;
}

export default function MarketRadarDemo({ market }: Props) {
  const [criteria, setCriteria] = useState<InvestorCriteria>({
    ...DEFAULT_INVESTOR_CRITERIA,
    targetCity: market.mockCities[0] ?? market.defaultRegion,
  });
  const [opportunities, setOpportunities] = useState<ScoredOpportunity[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<ScoredOpportunity | null>(null);
  const [view, setView] = useState<'cards' | 'table'>('cards');

  const runSearch = useCallback(async (c: InvestorCriteria) => {
    setLoading(true);
    try {
      const listings = await searchOpportunities(c, market.slug);
      setOpportunities(scoreListings(listings, c));
      track('radar_demo_searched', { marketSlug: market.slug, count: listings.length });
    } finally {
      setLoading(false);
    }
  }, [market.slug]);

  useEffect(() => {
    track('radar_demo_started', { marketSlug: market.slug });
    void runSearch(criteria);
  }, [market.slug]);

  if (!market.radar.demoEnabled) {
    return <p className="text-center text-slate-600">Radar demo not available in this market.</p>;
  }

  return (
    <div className="space-y-6">
      <DataSourceDisclaimer demo />
      <p className="text-sm text-slate-600">{market.radar.dataSourceMessage}</p>
      <AuthorizedDataNotice />
      <MarketRadarCriteriaForm
        market={market}
        criteria={criteria}
        onChange={(p) => setCriteria((prev) => ({ ...prev, ...p }))}
        onSubmit={() => void runSearch(criteria)}
        loading={loading}
      />
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">{opportunities.length} opportunities</h2>
        <div className="flex gap-2 text-sm">
          <button type="button" onClick={() => setView('cards')} className={view === 'cards' ? 'text-brand-700 font-medium' : 'text-slate-500'}>Cards</button>
          <button type="button" onClick={() => setView('table')} className={view === 'table' ? 'text-brand-700 font-medium' : 'text-slate-500'}>Table</button>
        </div>
      </div>
      {view === 'table' ? (
        <OpportunityTable opportunities={opportunities} criteria={criteria} onSelect={setSelected} market={market} />
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {opportunities.map((op) => (
            <OpportunityCard key={op.listing.id} opportunity={op} criteria={criteria} onSelect={setSelected} market={market} />
          ))}
        </div>
      )}
      {selected && <OpportunityDetail opportunity={selected} criteria={criteria} onClose={() => setSelected(null)} market={market} />}
    </div>
  );
}
