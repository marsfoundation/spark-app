import { QueryKey } from '@tanstack/react-query'
import { Config } from 'wagmi'
import { MarketInfo } from './marketInfo'

export interface MarketInfoQueryParams {
  wagmiConfig: Config
  chainId: number
  timeAdvance?: number
}

export interface MarketInfoQueryOptions {
  queryKey: QueryKey
  queryFn: () => Promise<MarketInfo | null>
}
