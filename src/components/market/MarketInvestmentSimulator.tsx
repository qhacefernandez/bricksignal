import type { MarketConfig } from '@/config/types';
import BasicInvestmentSimulator from '../basic/BasicInvestmentSimulator';

interface Props {
  market: MarketConfig;
}

export default function MarketInvestmentSimulator({ market }: Props) {
  return <BasicInvestmentSimulator market={market} />;
}
