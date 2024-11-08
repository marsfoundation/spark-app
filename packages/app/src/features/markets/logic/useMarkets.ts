import { getChainConfigEntry } from '@/config/chain'
// import { useD3MInfo } from '@/domain/d3m-info/useD3MInfo'
import { useMarketInfo } from '@/domain/market-info/useMarketInfo'

import { usePageChainId } from '@/domain/hooks/usePageChainId'
import { MarketEntry } from '../types'
import { MarketStats, aggregateStats } from './aggregate-stats'
import { transformReserves } from './transformers'

export interface UseMarketsResults {
  marketStats: MarketStats
  chainName: string
  chainId: number
  activeAndPausedMarketEntries: MarketEntry[]
  frozenMarketEntries: MarketEntry[]
}

export function useMarkets(): UseMarketsResults {
  const { chainId } = usePageChainId()
  const { marketInfo } = useMarketInfo({ chainId })
  // const { D3MInfo } = useD3MInfo({ chainId })
  const { meta: chainMeta } = getChainConfigEntry(chainId)

  const marketEntries = transformReserves(marketInfo)
  const activeAndPausedMarketEntries = marketEntries.filter((entry) => entry.reserveStatus !== 'frozen')
  const frozenMarketEntries = marketEntries.filter((entry) => entry.reserveStatus === 'frozen')

  return {
    marketStats: aggregateStats(marketInfo, undefined),
    activeAndPausedMarketEntries,
    frozenMarketEntries,
    chainName: chainMeta.name,
    chainId,
  }
}
