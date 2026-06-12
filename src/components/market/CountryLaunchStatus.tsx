import type { MarketConfig } from '@/config/types';

export default function CountryLaunchStatus({ market }: { market: MarketConfig }) {
  const items = [
    { label: 'Simulator', on: market.features.simulator },
    { label: 'Pro Report', on: market.features.proReport },
    { label: 'Radar Demo', on: market.features.radarDemo },
    { label: 'Subscriptions', on: market.features.subscriptions },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <span
          key={item.label}
          className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
            item.on ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-500'
          }`}
        >
          {item.label}
        </span>
      ))}
    </div>
  );
}
