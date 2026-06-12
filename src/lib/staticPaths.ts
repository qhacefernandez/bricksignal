import { MARKET_SLUGS } from '@/config/markets';

export function marketStaticPaths() {
  return MARKET_SLUGS.map((market) => ({ params: { market } }));
}
