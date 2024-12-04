import { useD3MInfo } from '@/domain/d3m-info/useD3MInfo'
import { usePageChainId } from '@/domain/hooks/usePageChainId'
import { useMarketInfo } from '@/domain/market-info/useMarketInfo'
import { MarketEntry } from '../types'
import { MarketStats, aggregateStats } from './aggregate-stats'
import { transformReserves } from './transformers'

export interface UseMarketsResults {
  marketStats: MarketStats
  chainId: number
  activeAndPausedMarketEntries: MarketEntry[]
  frozenMarketEntries: MarketEntry[]
}

export function useMarkets(): UseMarketsResults {
  const { chainId } = usePageChainId()
  const { marketInfo } = useMarketInfo({ chainId })
  const { D3MInfo } = useD3MInfo({ chainId })

  const marketEntries = transformReserves(marketInfo)
  const activeAndPausedMarketEntries = marketEntries.filter((entry) => entry.reserveStatus !== 'frozen')
  const frozenMarketEntries = marketEntries.filter((entry) => entry.reserveStatus === 'frozen')

  return {
    marketStats: aggregateStats(marketInfo, D3MInfo),
    activeAndPausedMarketEntries,
    frozenMarketEntries,
    chainId,
  }
}
