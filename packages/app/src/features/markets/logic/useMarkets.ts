import { getChainConfigEntry } from '@/config/chain'
import { useMakerInfo } from '@/domain/maker-info/useMakerInfo'
import { useMarketInfo } from '@/domain/market-info/useMarketInfo'

import { MarketEntry } from '../types'
import { aggregateStats, MarketStats } from './aggregate-stats'
import { transformReserves } from './transformers'

export interface UseMarketsResults {
  marketStats: MarketStats
  chainName: string
  chainId: number
  activeAndPausedMarketEntries: MarketEntry[]
  frozenMarketEntries: MarketEntry[]
}

export function useMarkets(): UseMarketsResults {
  const { marketInfo } = useMarketInfo()
  const { makerInfo } = useMakerInfo()
  const { meta: chainMeta } = getChainConfigEntry(marketInfo.chainId)

  const marketEntries = transformReserves(marketInfo)
  const activeAndPausedMarketEntries = marketEntries.filter((entry) => entry.reserveStatus !== 'frozen')
  const frozenMarketEntries = marketEntries.filter((entry) => entry.reserveStatus === 'frozen')

  return {
    marketStats: aggregateStats(marketInfo, makerInfo),
    activeAndPausedMarketEntries,
    frozenMarketEntries,
    chainName: chainMeta.name,
    chainId: marketInfo.chainId,
  }
}
